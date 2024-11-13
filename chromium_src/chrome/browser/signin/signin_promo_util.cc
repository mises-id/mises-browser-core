#include "src/chrome/browser/signin/signin_promo_util.cc"



namespace signin {

#if BUILDFLAG(IS_ANDROID)
bool ShouldShowSyncPromo(Profile& profile) {
  return false;
}
#endif  // !BUILDFLAG(IS_ANDROID)
}