#include "chrome/browser/signin/signin_ui_delegate.h"

namespace signin_ui_util {
namespace {


#if BUILDFLAG(IS_ANDROID) 

// SigninUiDelegate implementation for DICE platforms.
class SigninUiDelegateImplAndroid : public SigninUiDelegate {
 public:
  // SigninUiDelegate:
  void ShowSigninUI(Profile* profile,
                    bool enable_sync,
                    signin_metrics::AccessPoint access_point,
                    signin_metrics::PromoAction promo_action) override{}
  void ShowReauthUI(Profile* profile,
                    const std::string& email,
                    bool enable_sync,
                    signin_metrics::AccessPoint access_point,
                    signin_metrics::PromoAction promo_action) override{}
};


SigninUiDelegate* GetSigninUiDelegate() {

  static SigninUiDelegateImplAndroid delegate;
  return &delegate;
}

#endif 

}  // namespace
}
#include "src/chrome/browser/signin/signin_ui_util.cc"

