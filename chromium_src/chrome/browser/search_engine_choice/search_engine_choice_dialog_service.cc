#include "src/chrome/browser/search_engine_choice/search_engine_choice_dialog_service.cc"

#if BUILDFLAG(IS_ANDROID)
bool IsProfileCustomizationBubbleSyncControllerRunning(Browser* browser) {
  return false;
}
#endif