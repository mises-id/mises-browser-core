#include "chrome/browser/web_applications/os_integration/web_app_shortcut.h"

#include <utility>

#include "base/functional/bind.h"
#include "base/functional/callback.h"
#include "base/location.h"
#include "base/task/task_runner.h"
#include "chrome/browser/web_applications/web_app_constants.h"

namespace web_app {

namespace internals {

// On Chrome OS, we do not have platform shortcuts, so these operation are
// no-ops. We instead integrate with the Launcher and the Shelf through the App
// Service.

void CreatePlatformShortcuts(const base::FilePath& web_app_path,
                             const ShortcutLocations& creation_locations,
                             ShortcutCreationReason creation_reason,
                             const ShortcutInfo& shortcut_info,
                             CreateShortcutsCallback callback) {
  return;
}
void DeletePlatformShortcuts(const base::FilePath& web_app_path,
                             const ShortcutInfo& shortcut_info,
                             scoped_refptr<base::TaskRunner> result_runner,
                             DeleteShortcutsCallback callback) {
  result_runner->PostTask(FROM_HERE, base::BindOnce(std::move(callback),
                                                    /*shortcut_deleted=*/true));
}

void UpdatePlatformShortcuts(
    const base::FilePath& shortcut_data_path,
    const std::u16string& old_app_title,
    std::optional<ShortcutLocations> user_specified_locations,
    ResultCallback callback,
    const ShortcutInfo& shortcut_info) {
}

ShortcutLocations GetAppExistingShortCutLocationImpl(
    const ShortcutInfo& shortcut_info) {
  return ShortcutLocations();
}

std::vector<base::FilePath> GetShortcutLocations(
    const ShortcutLocations& locations,
    const base::FilePath& profile_path,
    const std::string& app_id) {
  return std::vector<base::FilePath>();
}

void DeleteAllShortcutsForProfile(const base::FilePath& profile_path) {}

}  // namespace internals

}  // namespace web_app