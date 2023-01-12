

#include "src/chrome/browser/ui/views/payments/cvc_unmask_view_controller.cc"
namespace payments {

bool CvcUnmaskViewController::ShouldOfferFidoAuth() const  {
  return false;
}
bool CvcUnmaskViewController::UserOptedInToFidoFromSettingsPageOnMobile() const{
  return false;
}

}
