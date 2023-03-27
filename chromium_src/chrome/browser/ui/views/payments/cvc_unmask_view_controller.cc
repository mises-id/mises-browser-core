#include "src/chrome/browser/ui/views/payments/cvc_unmask_view_controller.cc"
namespace payments {

#if BUILDFLAG(IS_ANDROID)
bool CvcUnmaskViewController::ShouldOfferFidoAuth() const  {
  return false;
}
bool CvcUnmaskViewController::UserOptedInToFidoFromSettingsPageOnMobile() const{
  return false;
}
#endif
}
