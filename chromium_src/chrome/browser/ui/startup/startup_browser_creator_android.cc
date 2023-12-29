#include "chrome/browser/ui/startup/startup_browser_creator.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/ui/startup/launch_mode_recorder.h"
#if BUILDFLAG(IS_ANDROID)

StartupBrowserCreator::StartupBrowserCreator() = default;

StartupBrowserCreator::~StartupBrowserCreator() {

}
void StartupBrowserCreator::LaunchBrowser(
    const base::CommandLine& command_line,
    Profile* profile,
    const base::FilePath& cur_dir,
    chrome::startup::IsProcessStartup process_startup,
    chrome::startup::IsFirstRun is_first_run,
    std::unique_ptr<OldLaunchModeRecorder> launch_mode_recorder) {
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