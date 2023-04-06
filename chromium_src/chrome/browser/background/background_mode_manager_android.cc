
#include "chrome/browser/background/background_mode_manager.h"

#include "base/task/sequenced_task_runner.h"

void BackgroundModeManager::EnableLaunchOnStartup(bool should_launch) {
  NOTIMPLEMENTED();
}

void BackgroundModeManager::DisplayClientInstalledNotification(
    const std::u16string& name) {
  NOTIMPLEMENTED();
}

// static
scoped_refptr<base::SequencedTaskRunner>
BackgroundModeManager::CreateTaskRunner() {
  return nullptr;
}
