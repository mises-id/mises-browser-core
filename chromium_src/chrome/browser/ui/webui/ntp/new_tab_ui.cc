#include "src/chrome/browser/ui/webui/ntp/new_tab_ui.cc"

#if BUILDFLAG(IS_ANDROID)
  // static
  void AppLauncherHandler::RegisterProfilePrefs(
      user_prefs::PrefRegistrySyncable* registry) {
  }
#endif
