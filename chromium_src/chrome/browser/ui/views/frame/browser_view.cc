#include "build/build_config.h"
#include "chrome/browser/ui/views/autofill/autofill_bubble_handler_impl.h"
#include "chrome/browser/ui/views/profiles/profile_menu_view_base.h"
#include "chrome/browser/ui/views/hats/hats_next_web_dialog.h"
#if BUILDFLAG(IS_ANDROID)

namespace autofill {

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
      bool is_user_gesture) override {return nullptr;};

  AutofillBubbleBase* ShowLocalCardMigrationBubble(
      content::WebContents* web_contents,
      LocalCardMigrationBubbleController* controller,
      bool is_user_gesture) override {return nullptr;};
  AutofillBubbleBase* ShowOfferNotificationBubble(
      content::WebContents* contents,
      OfferNotificationBubbleController* controller,
      bool is_user_gesture) override {return nullptr;};
  SaveUPIBubble* ShowSaveUPIBubble(
      content::WebContents* web_contents,
      SaveUPIBubbleController* controller) override {return nullptr;};
  AutofillBubbleBase* ShowSaveAddressProfileBubble(
      content::WebContents* web_contents,
      SaveUpdateAddressProfileBubbleController* controller,
      bool is_user_gesture) override {return nullptr;};
  AutofillBubbleBase* ShowUpdateAddressProfileBubble(
      content::WebContents* web_contents,
      SaveUpdateAddressProfileBubbleController* controller,
      bool is_user_gesture) override {return nullptr;};
  AutofillBubbleBase* ShowEditAddressProfileDialog(
      content::WebContents* web_contents,
      EditAddressProfileDialogController* controller) override {return nullptr;};
  AutofillBubbleBase* ShowVirtualCardManualFallbackBubble(
      content::WebContents* web_contents,
      VirtualCardManualFallbackBubbleController* controller,
      bool is_user_gesture) override {return nullptr;};
  AutofillBubbleBase* ShowVirtualCardEnrollBubble(
      content::WebContents* web_contents,
      VirtualCardEnrollBubbleController* controller,
      bool is_user_gesture) override {return nullptr;};
  void OnPasswordSaved() override {};
};


}

class HatsNextWebDialog_Mises {
  public:
   HatsNextWebDialog_Mises(Browser* browser,
                    const std::string& trigger_id,
                    base::OnceClosure success_callback,
                    base::OnceClosure failure_callback,
                    const SurveyBitsData& product_specific_bits_data,
                    const SurveyStringData& product_specific_string_data) {};
};

void ProfileMenuViewBase::ShowBubble(views::Button*, Browser*, bool) {

}

#define AutofillBubbleHandlerImpl AutofillBubbleHandlerImpl_Mises
#define HatsNextWebDialog HatsNextWebDialog_Mises
#endif

#include "src/chrome/browser/ui/views/frame/browser_view.cc"

