#include "chrome/browser/first_run/first_run_internal.h"

#include "base/base_paths.h"
#include "base/files/file_path.h"
#include "base/files/file_util.h"
#include "base/path_service.h"
#include "chrome/installer/util/initial_preferences.h"

namespace first_run {
namespace internal {

base::FilePath InitialPrefsPath() {
  // The standard location of the initial prefs is next to the chrome binary.
  base::FilePath dir_exe;
  if (!base::PathService::Get(base::DIR_EXE, &dir_exe)) {
    return base::FilePath();
  }

  return installer::InitialPreferences::Path(dir_exe);
}

void DoPostImportPlatformSpecificTasks() {

}

bool ShowPostInstallEULAIfNeeded(installer::InitialPreferences* install_prefs) {
  // The EULA is only handled on Windows.
  return false;
}

}  // namespace internal
}  // namespace first_run