#include "build/build_config.h"
#include "chrome/browser/ui/views/frame/browser_view.h"
#include "chrome/browser/ui/views/autofill/autofill_bubble_handler_impl.h"
#include "chrome/browser/ui/views/profiles/profile_menu_view_base.h"
#include "chrome/browser/ui/views/hats/hats_next_web_dialog.h"
#include "chrome/browser/ui/views/profiles/profile_menu_coordinator.h"
#include "chrome/browser/ui/browser_window.h"
#include "components/user_education/common/feature_promo_controller.h"
#include "components/user_education/common/new_badge_controller.h"
#include "chrome/browser/ui/autofill/save_address_bubble_controller.h"
#include "chrome/browser/ui/autofill/update_address_bubble_controller.h"
#include "chrome/browser/ui/autofill/add_new_address_bubble_controller.h"

#if BUILDFLAG(IS_ANDROID)

#include "components/autofill/core/browser/ui/payments/payments_bubble_closed_reasons.h"

namespace autofill {

PaymentsBubbleClosedReason GetPaymentsBubbleClosedReasonFromWidget(
    const views::Widget* widget) {
    return PaymentsBubbleClosedReason::kUnknown;
}

class AutofillBubbleHandlerImpl_Mises :public AutofillBubbleHandler{
public:
  AutofillBubbleHandlerImpl_Mises(
      Browser* browser,
      ToolbarButtonProvider* toolbar_button_provider) {
  }


  // AutofillBubbleHandler:
  AutofillBubbleBase* ShowSaveCreditCardBubble(
      content::WebContents* web_contents,
      SaveCardBubbleController* controller,
      bool is_user_gesture) override {return nullptr;}

  AutofillBubbleBase* ShowLocalCardMigrationBubble(
      content::WebContents* web_contents,
      LocalCardMigrationBubbleController* controller,
      bool is_user_gesture) override {return nullptr;}

  AutofillBubbleBase* ShowIbanBubble(
    content::WebContents* web_contents,
    IbanBubbleController* controller,
    bool is_user_gesture,
    IbanBubbleType bubble_type) override {return nullptr;}

  AutofillBubbleBase* ShowOfferNotificationBubble(
      content::WebContents* contents,
      OfferNotificationBubbleController* controller,
      bool is_user_gesture) override {return nullptr;}
  AutofillBubbleBase* ShowSaveAddressProfileBubble(
      content::WebContents* web_contents,
      std::unique_ptr<SaveAddressBubbleController> controller,
      bool is_user_gesture) override {return nullptr;}
  AutofillBubbleBase* ShowUpdateAddressProfileBubble(
      content::WebContents* web_contents,
      std::unique_ptr<UpdateAddressBubbleController> controller,
      bool is_user_gesture) override {return nullptr;}
  AutofillBubbleBase* ShowAddNewAddressProfileBubble(
      content::WebContents* web_contents,
      std::unique_ptr<AddNewAddressBubbleController> controller,
      bool is_user_gesture) override {return nullptr;}
  AutofillBubbleBase* ShowVirtualCardManualFallbackBubble(
      content::WebContents* web_contents,
      VirtualCardManualFallbackBubbleController* controller,
      bool is_user_gesture) override {return nullptr;}
  AutofillBubbleBase* ShowVirtualCardEnrollBubble(
      content::WebContents* web_contents,
      VirtualCardEnrollBubbleController* controller,
      bool is_user_gesture) override {return nullptr;}
  AutofillBubbleBase* ShowVirtualCardEnrollConfirmationBubble(
      content::WebContents* web_contents,
      VirtualCardEnrollBubbleController* controller) override {return nullptr;}
  AutofillBubbleBase* ShowMandatoryReauthBubble(
      content::WebContents* web_contents,
      MandatoryReauthBubbleController* controller,
      bool is_user_gesture,
      MandatoryReauthBubbleType bubble_type) override {return nullptr;}
  AutofillBubbleBase* ShowSaveCardConfirmationBubble(
      content::WebContents* web_contents,
      SaveCardBubbleController* controller) override {return nullptr;}
  AutofillBubbleBase* ShowSaveIbanConfirmationBubble(
      content::WebContents* web_contents,
      IbanBubbleController* controller) override {return nullptr;}
};


}

class HatsNextWebDialog_Mises {
  public:
   HatsNextWebDialog_Mises(
    Browser* browser,
    const std::string& trigger_id,
    const std::optional<std::string>& hats_histogram_name,
    base::OnceClosure success_callback,
    base::OnceClosure failure_callback,
    const SurveyBitsData& product_specific_bits_data,
    const SurveyStringData& product_specific_string_data) {}
};

class ProfileMenuCoordinator_Mises {
public: 
static ProfileMenuCoordinator_Mises* GetOrCreateForBrowser(Browser* browser) {
    static ProfileMenuCoordinator_Mises obj;
    return &obj;
}
 void Show(bool) {

 }
};

class HighEfficiencyOptInIPHController_Mises {
  public:
   HighEfficiencyOptInIPHController_Mises(Browser* browser) {}
};


#define AutofillBubbleHandlerImpl AutofillBubbleHandlerImpl_Mises
#define HatsNextWebDialog HatsNextWebDialog_Mises
#define ProfileMenuCoordinator ProfileMenuCoordinator_Mises
#define HighEfficiencyOptInIPHController HighEfficiencyOptInIPHController_Mises
#define GetDownloadBubbleUIController GetDownloadBubbleUIController_Chromium
#define ShouldHideUIForFullscreen ShouldHideUIForFullscreen_Chromium
#define NotifyUsedEvent ShouldTriggerHelpUIWithSnooze
#endif


#include "src/chrome/browser/ui/views/frame/browser_view.cc"

#if BUILDFLAG(IS_ANDROID)
#undef GetDownloadBubbleUIController
#undef ShouldHideUIForFullscreen
#undef NotifyUsedEvent

DownloadBubbleUIController* BrowserView::GetDownloadBubbleUIController() {
  if (!toolbar_button_provider_)
    return nullptr;
  return GetDownloadBubbleUIController_Chromium();
}
bool BrowserView::ShouldHideUIForFullscreen() const {
    return false;
}
#endif