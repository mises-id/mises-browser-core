#include "chrome/browser/ui/startup/startup_browser_creator.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/ui/startup/launch_mode_recorder.h"
#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/ui/startup/startup_browser_creator_impl.h"
#include "chrome/browser/ui/startup/infobar_utils.h"

void AddInfoBarsIfNecessary(Browser* browser,
                            Profile* profile,
                            const base::CommandLine& startup_command_line,
                            chrome::startup::IsFirstRun is_first_run,
                            bool is_web_app) {
}
// static
void StartupBrowserCreatorImpl::MaybeToggleFullscreen(Browser* browser) {

}

StartupBrowserCreator::StartupBrowserCreator() = default;

StartupBrowserCreator::~StartupBrowserCreator() {

}
void StartupBrowserCreator::LaunchBrowser(
    const base::CommandLine& command_line,
    Profile* profile,
    const base::FilePath& cur_dir,
    chrome::startup::IsProcessStartup process_startup,
    chrome::startup::IsFirstRun is_first_run,
    bool restore_tabbed_browser) {
}


// static
bool StartupBrowserCreator::WasRestarted() {
  return false;
}
void StartupBrowserCreator::OpenStartupPages(Browser*, chrome::startup::IsProcessStartup) {

}

bool HasPendingUncleanExit(Profile* profile) {
  return false;
}

bool StartupBrowserCreator::InSynchronousProfileLaunch() {
  return false;
}
SessionStartupPref StartupBrowserCreator::GetSessionStartupPref(
    const base::CommandLine& command_line,
    const Profile* profile) {
  DCHECK(profile);
  const PrefService* prefs = profile->GetPrefs();
  SessionStartupPref pref = SessionStartupPref::GetStartupPref(prefs);
  pref.type = SessionStartupPref::DEFAULT;
  return pref;
}

#endif