#include "src/chrome/browser/signin/account_consistency_mode_manager.cc"

#if BUILDFLAG(IS_ANDROID)
bool AccountConsistencyModeManager::IsDiceSignInAllowed() {
  return false;
}
#endif 