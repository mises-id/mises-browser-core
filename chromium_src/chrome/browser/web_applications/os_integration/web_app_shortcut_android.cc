#include "chrome/browser/web_applications/os_integration/web_app_shortcut_linux.h"

#include <utility>

#include <fcntl.h>
#include <algorithm>

#include "base/base_paths.h"
#include "base/bind.h"
#include "base/callback.h"
#include "base/environment.h"
#include "base/files/file_path.h"
#include "base/files/file_util.h"
#include "base/files/scoped_temp_dir.h"
#include "base/i18n/file_util_icu.h"
#include "base/location.h"
#include "base/logging.h"
#include "base/memory/ref_counted_memory.h"
#include "base/metrics/histogram_macros.h"
#include "base/nix/xdg_util.h"
#include "base/no_destructor.h"
#include "base/path_service.h"
#include "base/posix/eintr_wrapper.h"
#include "base/process/kill.h"
#include "base/process/launch.h"
#include "base/strings/string_number_conversions.h"
#include "base/strings/string_util.h"
#include "base/task/task_runner.h"
#include "base/threading/scoped_blocking_call.h"
#include "chrome/browser/shell_integration.h"
#include "chrome/browser/web_applications/os_integration/web_app_shortcut.h"
#include "chrome/browser/web_applications/web_app_constants.h"
#include "chrome/browser/web_applications/web_app_id.h"
#include "chrome/common/buildflags.h"
#include "chrome/common/chrome_constants.h"

namespace {

// UMA metric name for creating shortcut result.
constexpr const char* kCreateShortcutResult =
    "Apps.CreateShortcuts.Android.Result";

// UMA metric name for creating shortcut icon result.
constexpr const char* kCreateShortcutIconResult =
    "Apps.CreateShortcutIcon.Android.Result";


base::FilePath GetDesktopPath() {
  base::FilePath desktop_path;
  base::PathService::Get(base::DIR_USER_DESKTOP, &desktop_path);
  return desktop_path;
}

base::FilePath GetAutostartPath(base::Environment* env) {
  base::FilePath ret; 
  return ret;
}

// Result of creating app shortcut icon.
// Success is recorded for each icon image, but the first two errors
// are per app, so the success/error ratio might not be very meaningful.
enum class CreateShortcutIconResult {
  kSuccess = 0,
  kEmptyIconImages = 1,
  kFailToCreateTempDir = 2,
  kFailToEncodeImageToPng = 3,
  kImageCorrupted = 4,
  kFailToInstallIcon = 5,
  kMaxValue = kFailToInstallIcon
};

// Result of creating app shortcut.
// These values are persisted to logs. Entries should not be renumbered and
// numeric values should never be reused.
enum class CreateShortcutResult {
  kSuccess = 0,
  kFailToGetShortcutFilename = 1,
  kFailToGetChromeExePath = 2,
  kFailToGetDesktopPath = 3,
  kFailToOpenDesktopDir = 4,
  kFailToOpenShortcutFilepath = 5,
  kCorruptDesktopShortcut = 6,
  kFailToCreateTempDir = 7,
  kCorruptDirectoryContents = 8,
  kCorruptApplicationsMenuShortcut = 9,
  kFailToInstallShortcut = 10,
  kMaxValue = kFailToInstallShortcut
};

// Record UMA metric for creating shortcut icon.
void RecordCreateIcon(CreateShortcutIconResult result) {
  UMA_HISTOGRAM_ENUMERATION(kCreateShortcutIconResult, result);
}

// Record UMA metric for creating shortcut.
void RecordCreateShortcut(CreateShortcutResult result) {
  UMA_HISTOGRAM_ENUMERATION(kCreateShortcutResult, result);
}


const char kDirectoryFilename[] = "chrome-apps.directory";

std::string CreateShortcutIcon(const gfx::ImageFamily& icon_images,
                               const base::FilePath& shortcut_filename) {
  if (icon_images.empty()) {
    RecordCreateIcon(CreateShortcutIconResult::kEmptyIconImages);
    return std::string();
  }

  // TODO(phajdan.jr): Report errors from this function, possibly as infobars.
  base::ScopedTempDir temp_dir;
  if (!temp_dir.CreateUniqueTempDir()) {
    RecordCreateIcon(CreateShortcutIconResult::kFailToCreateTempDir);
    return std::string();
  }

  base::FilePath temp_file_path =
      temp_dir.GetPath().Append(shortcut_filename.ReplaceExtension("png"));
  std::string icon_name = temp_file_path.BaseName().RemoveExtension().value();

  for (gfx::ImageFamily::const_iterator it = icon_images.begin();
       it != icon_images.end(); ++it) {
    int width = it->Width();
    scoped_refptr<base::RefCountedMemory> png_data = it->As1xPNGBytes();
    if (png_data->size() == 0) {
      // If the bitmap could not be encoded to PNG format, skip it.
      LOG(WARNING) << "Could not encode icon " << icon_name << ".png at size "
                   << width << ".";
      RecordCreateIcon(CreateShortcutIconResult::kFailToEncodeImageToPng);
      continue;
    }
    if (!base::WriteFile(temp_file_path, *png_data)) {
      RecordCreateIcon(CreateShortcutIconResult::kImageCorrupted);
      return std::string();
    }
  }
  return std::string();
}

#if !BUILDFLAG(IS_ANDROID)
bool CreateShortcutAtLocation(const base::FilePath location_path,
                              const base::FilePath& shortcut_filename,
                              const std::string& contents) {
  // Make sure that we will later call openat in a secure way.
  DCHECK_EQ(shortcut_filename.BaseName().value(), shortcut_filename.value());

  int location_fd = open(location_path.value().c_str(), O_RDONLY | O_DIRECTORY);
  if (location_fd < 0) {
    RecordCreateShortcut(CreateShortcutResult::kFailToOpenDesktopDir);
    return false;
  }

  int fd = openat(location_fd, shortcut_filename.value().c_str(),
                  O_CREAT | O_EXCL | O_WRONLY,
                  S_IRWXU | S_IRGRP | S_IXGRP | S_IROTH | S_IXOTH);
  if (fd < 0) {
    if (IGNORE_EINTR(close(location_fd)) < 0)
      PLOG(ERROR) << "close";
    RecordCreateShortcut(CreateShortcutResult::kFailToOpenShortcutFilepath);
    return false;
  }

  if (!base::WriteFileDescriptor(fd, contents)) {
    // Delete the file. No shortcut is better than corrupted one. Use unlinkat
    // to make sure we're deleting the file in the directory we think we are.
    // Even if an attacker manager to put something other at
    // |shortcut_filename| we'll just undo their action.
    RecordCreateShortcut(CreateShortcutResult::kCorruptDesktopShortcut);
    unlinkat(location_fd, shortcut_filename.value().c_str(), 0);
  }

  if (IGNORE_EINTR(close(fd)) < 0)
    PLOG(ERROR) << "close";

  if (IGNORE_EINTR(close(location_fd)) < 0)
    PLOG(ERROR) << "close";

  return true;
}

bool CreateShortcutOnDesktop(const base::FilePath& shortcut_filename,
                             const std::string& contents) {
  base::FilePath desktop_path = GetDesktopPath();
  if (desktop_path.empty()) {
    RecordCreateShortcut(CreateShortcutResult::kFailToGetDesktopPath);
    return false;
  }

  return CreateShortcutAtLocation(desktop_path, shortcut_filename, contents);
}

bool CreateShortcutInAutoStart(base::Environment* env,
                               const base::FilePath& shortcut_filename,
                               const std::string& contents) {
  base::FilePath autostart_path = GetAutostartPath(env);
  if (!base::DirectoryExists(autostart_path) &&
      !base::CreateDirectory(autostart_path)) {
    return false;
  }

  return CreateShortcutAtLocation(autostart_path, shortcut_filename, contents);
}

// Creates a shortcut with |shortcut_filename| and |contents| in the system
// applications menu. If |directory_filename| is non-empty, creates a sub-menu
// with |directory_filename| and |directory_contents|, and stores the shortcut
// under the sub-menu.
bool CreateShortcutInApplicationsMenu(base::Environment* env,
                                      const base::FilePath& shortcut_filename,
                                      const std::string& contents,
                                      const base::FilePath& directory_filename,
                                      const std::string& directory_contents) {
  DCHECK(!web_app::GetShortcutOverrideForTesting());
  base::ScopedTempDir temp_dir;
  if (!temp_dir.CreateUniqueTempDir()) {
    RecordCreateShortcut(CreateShortcutResult::kFailToCreateTempDir);
    return false;
  }

  base::FilePath temp_directory_path;
  if (!directory_filename.empty()) {
    temp_directory_path = temp_dir.GetPath().Append(directory_filename);
    if (!base::WriteFile(temp_directory_path, directory_contents)) {
      RecordCreateShortcut(CreateShortcutResult::kCorruptDirectoryContents);
      return false;
    }
  }

  base::FilePath temp_file_path = temp_dir.GetPath().Append(shortcut_filename);
  if (!base::WriteFile(temp_file_path, contents)) {
    RecordCreateShortcut(
        CreateShortcutResult::kCorruptApplicationsMenuShortcut);
    return false;
  }

  return true;
}
#endif
}  // namespace

namespace web_app {

DesktopActionInfo::DesktopActionInfo() = default;

DesktopActionInfo::DesktopActionInfo(const std::string& id,
                                     const std::string& name,
                                     const GURL& exec_launch_url)
    : id(id), name(name), exec_launch_url(exec_launch_url) {
#if DCHECK_IS_ON()
  // Check that `id` only contains characters A-Za-z0-9-.
  auto is_character_allowed = [](auto c) {
    return base::IsAsciiAlpha(c) || base::IsAsciiDigit(c) || c == '-';
  };
  DCHECK(std::all_of(id.begin() + 1, id.end(), is_character_allowed));
#endif  // DCHECK_IS_ON()
}

DesktopActionInfo::DesktopActionInfo(const DesktopActionInfo&) = default;

bool DesktopActionInfo::operator<(const DesktopActionInfo& other) const {
  return this->id < other.id;
}

DesktopActionInfo::~DesktopActionInfo() = default;
base::FilePath GetAppShortcutFilename(const base::FilePath& profile_path,
                                      const std::string& app_id) {
  DCHECK(!app_id.empty());

  // Use a prefix, because xdg-desktop-menu requires it.
  std::string filename(chrome::kBrowserProcessExecutableName);
  filename.append("-").append(app_id).append("-").append(
      profile_path.BaseName().value());
  base::i18n::ReplaceIllegalCharactersInPath(&filename, '_');
  // Spaces in filenames break xdg-desktop-menu
  // (see https://bugs.freedesktop.org/show_bug.cgi?id=66605).
  base::ReplaceChars(filename, " ", "_", &filename);
  return base::FilePath(filename.append(".desktop"));
}

bool DeleteShortcutOnDesktop(const base::FilePath& shortcut_filename) {
  base::FilePath desktop_path = GetDesktopPath();
  bool result = false;
  if (!desktop_path.empty())
    result = base::DeleteFile(desktop_path.Append(shortcut_filename));
  return result;
}

bool DeleteShortcutInAutoStart(base::Environment* env,
                               const base::FilePath& shortcut_filename) {
  base::FilePath autostart_path = GetAutostartPath(env);
  return base::DeleteFile(autostart_path.Append(shortcut_filename));
}

bool DeleteShortcutInApplicationsMenu(
    const base::FilePath& shortcut_filename,
    const base::FilePath& directory_filename) {
  return false;
}

bool CreateDesktopShortcut(base::Environment* env,
                           const ShortcutInfo& shortcut_info,
                           const ShortcutLocations& creation_locations) {
  base::ScopedBlockingCall scoped_blocking_call(FROM_HERE,
                                                base::BlockingType::MAY_BLOCK);

  bool create_shortcut_in_startup = creation_locations.in_startup;

  ApplicationsMenuLocation applications_menu_location =
      creation_locations.applications_menu_location;
  // Do not create the shortcuts in startup directory when testing because
  // xdg-utility (which creates this shortcut) doesn't work well with temp
  // directories.
  if (web_app::GetShortcutOverrideForTesting())
    applications_menu_location = APP_MENU_LOCATION_NONE;

  base::FilePath shortcut_filename;
  if (!shortcut_info.extension_id.empty()) {
    shortcut_filename = GetAppShortcutFilename(shortcut_info.profile_path,
                                               shortcut_info.extension_id);
    // For extensions we do not want duplicate shortcuts. So, delete any that
    // already exist and replace them.
    if (creation_locations.on_desktop)
      DeleteShortcutOnDesktop(shortcut_filename);

    if (create_shortcut_in_startup)
      // if (creation_locations.in_startup)
      DeleteShortcutInAutoStart(env, shortcut_filename);

    if (applications_menu_location != APP_MENU_LOCATION_NONE) {
      DeleteShortcutInApplicationsMenu(shortcut_filename, base::FilePath());
    }
  } else {
  }
  if (shortcut_filename.empty()) {
    RecordCreateShortcut(CreateShortcutResult::kFailToGetShortcutFilename);
    return false;
  }

  std::string icon_name =
      CreateShortcutIcon(shortcut_info.favicon, shortcut_filename);

  std::string app_name = GenerateApplicationNameFromInfo(shortcut_info);

  bool success = true;
/*
  base::FilePath chrome_exe_path =
      shell_integration_linux::internal::GetChromeExePath();
  if (chrome_exe_path.empty()) {
    RecordCreateShortcut(CreateShortcutResult::kFailToGetChromeExePath);
    NOTREACHED();
    return false;
  }

  if (creation_locations.on_desktop) {
    std::string contents = shell_integration_linux::GetDesktopFileContents(
        chrome_exe_path, app_name, shortcut_info.url,
        shortcut_info.extension_id, shortcut_info.title, icon_name,
        shortcut_info.profile_path, "", "", false, "",
        std::move(shortcut_info.actions));
    success = CreateShortcutOnDesktop(shortcut_filename, contents);
  }

  if (create_shortcut_in_startup) {
    // if (creation_locations.in_startup) {
    std::string contents = shell_integration_linux::GetDesktopFileContents(
        chrome_exe_path, app_name, shortcut_info.url,
        shortcut_info.extension_id, shortcut_info.title, icon_name,
        shortcut_info.profile_path, "", "", false, kRunOnOsLoginModeWindowed,
        std::move(shortcut_info.actions));
    success =
        CreateShortcutInAutoStart(env, shortcut_filename, contents) && success;
  }

  if (applications_menu_location == APP_MENU_LOCATION_NONE) {
    return success;
  }

  base::FilePath directory_filename;
  std::string directory_contents;
  switch (creation_locations.applications_menu_location) {
    case APP_MENU_LOCATION_HIDDEN:
      break;
    case APP_MENU_LOCATION_SUBDIR_CHROMEAPPS:
      directory_filename = base::FilePath(kDirectoryFilename);
      directory_contents = shell_integration_linux::GetDirectoryFileContents(
          shell_integration::GetAppShortcutsSubdirName(), "");
      break;
    default:
      NOTREACHED();
      break;
  }
*/
  std::vector<std::string> mime_types(
      shortcut_info.file_handler_mime_types.begin(),
      shortcut_info.file_handler_mime_types.end());

  // Convert protocol handlers into mime types for registration in the
  // .desktop file.
  for (const auto& protocol_handler : shortcut_info.protocol_handlers) {
    mime_types.push_back("x-scheme-handler/" + protocol_handler);
  }
/*
  // Set NoDisplay=true if hidden. This will hide the application from
  // user-facing menus.
  std::string contents = shell_integration_linux::GetDesktopFileContents(
      chrome_exe_path, app_name, shortcut_info.url, shortcut_info.extension_id,
      shortcut_info.title, icon_name, shortcut_info.profile_path, "",
      base::JoinString(mime_types, ";"),
      creation_locations.applications_menu_location == APP_MENU_LOCATION_HIDDEN,
      "", std::move(shortcut_info.actions));
  success = CreateShortcutInApplicationsMenu(env, shortcut_filename, contents,
                                             directory_filename,
                                             directory_contents) &&
            success;
*/  
  if (success) {
    RecordCreateShortcut(CreateShortcutResult::kSuccess);
  }
  return success;
}

ShortcutLocations GetExistingShortcutLocations(
    base::Environment* env,
    const base::FilePath& profile_path,
    const std::string& extension_id) {
  base::ScopedBlockingCall scoped_blocking_call(FROM_HERE,
                                                base::BlockingType::MAY_BLOCK);

  base::FilePath shortcut_filename =
      GetAppShortcutFilename(profile_path, extension_id);
  DCHECK(!shortcut_filename.empty());
  ShortcutLocations locations;

  // Determine whether there is a shortcut on desktop.
  base::FilePath desktop_path = GetDesktopPath();

  if (!desktop_path.empty()) {
    locations.on_desktop =
        base::PathExists(desktop_path.Append(shortcut_filename));
  }

  base::FilePath autostart_path = GetAutostartPath(env);
  if (!autostart_path.empty()) {
    locations.in_startup =
        base::PathExists(autostart_path.Append(shortcut_filename));
  }
/*
  // Determine whether there is a shortcut in the applications directory.
  std::string shortcut_contents;
  if (shell_integration_linux::GetExistingShortcutContents(
          env, shortcut_filename, &shortcut_contents)) {
    // If the shortcut contents contain NoDisplay=true, it should be hidden.
    // Otherwise since these shortcuts are for apps, they are always in the
    // "Chrome Apps" directory.
    locations.applications_menu_location =
        shell_integration_linux::internal::GetNoDisplayFromDesktopFile(
            shortcut_contents)
            ? APP_MENU_LOCATION_HIDDEN
            : APP_MENU_LOCATION_SUBDIR_CHROMEAPPS;
  }
*/
  return locations;
}

bool DeleteDesktopShortcuts(base::Environment* env,
                            const base::FilePath& profile_path,
                            const std::string& extension_id) {
  base::ScopedBlockingCall scoped_blocking_call(FROM_HERE,
                                                base::BlockingType::MAY_BLOCK);

  base::FilePath shortcut_filename =
      GetAppShortcutFilename(profile_path, extension_id);
  DCHECK(!shortcut_filename.empty());

  bool deleted_from_desktop = DeleteShortcutOnDesktop(shortcut_filename);
  // Delete shortcuts from |kDirectoryFilename|.
  // Note that it is possible that shortcuts were not created in the Chrome Apps
  // directory. It doesn't matter: this will still delete the shortcut even if
  // it isn't in the directory.

  bool deleted_from_autostart = true;
  if (!web_app::GetShortcutOverrideForTesting())
    deleted_from_autostart = DeleteShortcutInAutoStart(env, shortcut_filename);

  bool deleted_from_application_menu = true;
  if (!web_app::GetShortcutOverrideForTesting())
    deleted_from_application_menu = DeleteShortcutInApplicationsMenu(
        shortcut_filename, base::FilePath(kDirectoryFilename));
  return (deleted_from_desktop && deleted_from_autostart &&
          deleted_from_application_menu);
}

bool DeleteAllDesktopShortcuts(base::Environment* env,
                               const base::FilePath& profile_path) {
  base::ScopedBlockingCall scoped_blocking_call(FROM_HERE,
                                                base::BlockingType::MAY_BLOCK);

  bool result = true;
  /*
  // Delete shortcuts from Desktop.
  base::FilePath desktop_path = GetDesktopPath();
  if (!desktop_path.empty()) {
    std::vector<base::FilePath> shortcut_filenames_desktop =
        shell_integration_linux::GetExistingProfileShortcutFilenames(
            profile_path, desktop_path);
    for (const auto& shortcut : shortcut_filenames_desktop) {
      if (!DeleteShortcutOnDesktop(shortcut))
        result = false;
    }
  }

  base::FilePath autostart_path = GetAutostartPath(env);
  std::vector<base::FilePath> shortcut_filenames_autostart =
      shell_integration_linux::GetExistingProfileShortcutFilenames(
          profile_path, autostart_path);
  for (const auto& shortcut : shortcut_filenames_autostart) {
    if (!web_app::GetShortcutOverrideForTesting() &&
        !DeleteShortcutInAutoStart(env, shortcut))
      result = false;
  }

  // Delete shortcuts from |kDirectoryFilename|.
  base::FilePath applications_menu =
      shell_integration_linux::GetDataWriteLocation(env);
  applications_menu = applications_menu.AppendASCII("applications");
  std::vector<base::FilePath> shortcut_filenames_app_menu =
      shell_integration_linux::GetExistingProfileShortcutFilenames(
          profile_path, applications_menu);
  for (const auto& menu : shortcut_filenames_app_menu) {
    if (!web_app::GetShortcutOverrideForTesting() &&
        !DeleteShortcutInApplicationsMenu(menu,
                                          base::FilePath(kDirectoryFilename))) {
      result = false;
    }
  }
  */
  return result;
}

void UpdateDesktopShortcuts(base::Environment* env,
                            const ShortcutInfo& shortcut_info) {
  base::ScopedBlockingCall scoped_blocking_call(FROM_HERE,
                                                base::BlockingType::MAY_BLOCK);

  // Find out whether shortcuts are already installed.
  ShortcutLocations creation_locations = GetExistingShortcutLocations(
      env, shortcut_info.profile_path, shortcut_info.extension_id);

  // Always create a hidden shortcut in applications if a visible one is not
  // being created. This allows the operating system to identify the app, but
  // not show it in the menu.
  if (creation_locations.applications_menu_location == APP_MENU_LOCATION_NONE)
    creation_locations.applications_menu_location = APP_MENU_LOCATION_HIDDEN;

  CreateDesktopShortcut(env, shortcut_info, creation_locations);
}

std::vector<base::FilePath> GetShortcutLocations(
    base::Environment* env,
    const ShortcutLocations& locations,
    const base::FilePath& profile_path,
    const std::string& app_id) {
  base::ScopedBlockingCall scoped_blocking_call(FROM_HERE,
                                                base::BlockingType::MAY_BLOCK);

  std::vector<base::FilePath> shortcut_locations;
  base::FilePath shortcut_filename =
      GetAppShortcutFilename(profile_path, app_id);
  DCHECK(!shortcut_filename.empty());

  if (locations.on_desktop) {
    base::FilePath desktop_path = GetDesktopPath();
    if (!desktop_path.empty()) {
      base::FilePath desktop_shortcut_path =
          desktop_path.Append(shortcut_filename);
      if (base::PathExists(desktop_shortcut_path))
        shortcut_locations.push_back(desktop_shortcut_path);
    }
  }

  if (locations.in_startup) {
    base::FilePath autostart_path = GetAutostartPath(env);
    if (!autostart_path.empty()) {
      base::FilePath autostart_shortcut_path =
          autostart_path.Append(shortcut_filename);
      if (base::PathExists(autostart_shortcut_path))
        shortcut_locations.push_back(autostart_shortcut_path);
    }
  }

  // Can't retrieve file name for applications menu location.
  DCHECK(!locations.applications_menu_location);
  return shortcut_locations;
}

namespace internals {

bool CreatePlatformShortcuts(const base::FilePath& /*web_app_path*/,
                             const ShortcutLocations& creation_locations,
                             ShortcutCreationReason /*creation_reason*/,
                             const ShortcutInfo& shortcut_info) {
  base::ScopedBlockingCall scoped_blocking_call(FROM_HERE,
                                                base::BlockingType::MAY_BLOCK);
  std::unique_ptr<base::Environment> env(base::Environment::Create());
  return CreateDesktopShortcut(env.get(), shortcut_info, creation_locations);
}

ShortcutLocations GetAppExistingShortCutLocationImpl(
    const ShortcutInfo& shortcut_info) {
  std::unique_ptr<base::Environment> env(base::Environment::Create());
  return GetExistingShortcutLocations(env.get(), shortcut_info.profile_path,
                                      shortcut_info.extension_id);
}

void DeletePlatformShortcuts(const base::FilePath& web_app_path,
                             const ShortcutInfo& shortcut_info,
                             scoped_refptr<base::TaskRunner> result_runner,
                             DeleteShortcutsCallback callback) {
  std::unique_ptr<base::Environment> env(base::Environment::Create());
  result_runner->PostTask(
      FROM_HERE, base::BindOnce(std::move(callback),
                                DeleteDesktopShortcuts(
                                    env.get(), shortcut_info.profile_path,
                                    shortcut_info.extension_id)));
}

void UpdatePlatformShortcuts(const base::FilePath& /*web_app_path*/,
                             const std::u16string& /*old_app_title*/,
                             const ShortcutInfo& shortcut_info) {
  std::unique_ptr<base::Environment> env(base::Environment::Create());
  UpdateDesktopShortcuts(env.get(), shortcut_info);
}

void DeleteAllShortcutsForProfile(const base::FilePath& profile_path) {
  std::unique_ptr<base::Environment> env(base::Environment::Create());
  DeleteAllDesktopShortcuts(env.get(), profile_path);
}

std::vector<base::FilePath> GetShortcutLocations(
    const ShortcutLocations& locations,
    const base::FilePath& profile_path,
    const std::string& app_id) {
  std::unique_ptr<base::Environment> env(base::Environment::Create());
  return GetShortcutLocations(env.get(), locations, profile_path, app_id);
}

}  // namespace internals

}  // namespace web_app
