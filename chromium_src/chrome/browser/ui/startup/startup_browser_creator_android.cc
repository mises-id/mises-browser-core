#include "chrome/browser/ui/startup/startup_browser_creator.h"
#include "chrome/browser/profiles/profile.h"

#if BUILDFLAG(IS_ANDROID)

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