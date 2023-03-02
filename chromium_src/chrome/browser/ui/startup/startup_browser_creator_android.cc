#include "chrome/browser/ui/startup/startup_browser_creator.h"

#if BUILDFLAG(IS_ANDROID)

// static
bool StartupBrowserCreator::WasRestarted() {
  return false;
}
void StartupBrowserCreator::OpenStartupPages(Browser*, chrome::startup::IsProcessStartup) {

}

#endif