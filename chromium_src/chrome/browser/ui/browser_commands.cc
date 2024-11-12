#include "src/chrome/browser/ui/browser_commands.cc"

#include "base/observer_list.h"
#include "chrome/browser/ui/autofill/payments/webauthn_dialog_model.h"
#include "chrome/browser/ui/autofill/payments/webauthn_dialog_model_observer.h"
#include "chrome/browser/ui/autofill/payments/webauthn_dialog_state.h"
#include "chrome/browser/ui/autofill/payments/save_payment_icon_controller.h"

#if BUILDFLAG(IS_ANDROID)
namespace autofill {
  void ManageMigrationUiController::OnUserClickedCreditCardIcon() {
  }
  WEB_CONTENTS_USER_DATA_KEY_IMPL(ManageMigrationUiController);

  void IbanBubbleControllerImpl::ReshowBubble() {
  }
  WEB_CONTENTS_USER_DATA_KEY_IMPL(IbanBubbleControllerImpl);

  void SaveCardBubbleControllerImpl::ReshowBubble(
    bool is_triggered_by_user_gesture) {
  }
  WEB_CONTENTS_USER_DATA_KEY_IMPL(SaveCardBubbleControllerImpl);


  OfferNotificationBubbleController*
  OfferNotificationBubbleController::Get(
    content::WebContents* web_contents) {
      return nullptr;
  }
  void OfferNotificationBubbleControllerImpl::ReshowBubble() {
  }
  WEB_CONTENTS_USER_DATA_KEY_IMPL(OfferNotificationBubbleControllerImpl);


  VirtualCardManualFallbackBubbleController*
  VirtualCardManualFallbackBubbleController::Get(
    content::WebContents* web_contents) {
      return nullptr;
  }

  void VirtualCardManualFallbackBubbleControllerImpl::ReshowBubble() {
  }
  WEB_CONTENTS_USER_DATA_KEY_IMPL(VirtualCardManualFallbackBubbleControllerImpl);


  WebauthnDialogModel::WebauthnDialogModel(WebauthnDialogState dialog_state)
      : state_(dialog_state) {
  }
  WebauthnDialogModel::~WebauthnDialogModel() = default;
  void WebauthnDialogModel::AddObserver(WebauthnDialogModelObserver* observer) {
    observers_.AddObserver(observer);
  }

  void WebauthnDialogModel::RemoveObserver(
      WebauthnDialogModelObserver* observer) {
    observers_.RemoveObserver(observer);
  }


bool WebauthnDialogModel::IsActivityIndicatorVisible() const {
  return false;
}

bool WebauthnDialogModel::IsCancelButtonVisible() const {
  return false;
}

std::u16string WebauthnDialogModel::GetCancelButtonLabel() const {
  return std::u16string();
}

bool WebauthnDialogModel::IsAcceptButtonVisible() const {
  return false;
}

bool WebauthnDialogModel::IsAcceptButtonEnabled() const {
  return false;
}

std::u16string WebauthnDialogModel::GetAcceptButtonLabel() const {
  return std::u16string();
}

std::u16string WebauthnDialogModel::GetStepTitle() const {
  return std::u16string();
}

std::u16string WebauthnDialogModel::GetStepDescription() const {
  return std::u16string();
}

void WebauthnDialogModel::SetIllustrationsFromState() {

}

  SavePaymentIconController* SavePaymentIconController::Get(content::WebContents*, int) {
    return nullptr;
  }

}

#include "chrome/browser/apps/link_capturing/web_apps_intent_picker_delegate.h"
namespace apps {
  void EnableLinkCapturingInfoBarDelegate::RemoveInfoBar(
    content::WebContents* web_contents) {
  }
  std::unique_ptr<EnableLinkCapturingInfoBarDelegate>
    EnableLinkCapturingInfoBarDelegate::MaybeCreate(
    content::WebContents* web_contents,
    const std::string& app_id) {
      return nullptr;
    }

WebAppsIntentPickerDelegate::WebAppsIntentPickerDelegate(Profile* profile)
    : profile_(*profile),
      provider_(*web_app::WebAppProvider::GetForWebApps(profile)) {}
WebAppsIntentPickerDelegate::~WebAppsIntentPickerDelegate() = default;

bool WebAppsIntentPickerDelegate::ShouldShowIntentPickerWithApps() {
  return false;
}

void WebAppsIntentPickerDelegate::FindAllAppsForUrl(
    const GURL& url,
    IntentPickerAppsCallback apps_callback) {
  std::vector<apps::IntentPickerAppInfo> apps;
  base::SequencedTaskRunner::GetCurrentDefault()->PostTask(
      FROM_HERE, base::BindOnce(std::move(apps_callback), std::move(apps)));
}

bool WebAppsIntentPickerDelegate::IsPreferredAppForSupportedLinks(
    const webapps::AppId& app_id) {
  return false;
}

void WebAppsIntentPickerDelegate::LoadSingleAppIcon(
    PickerEntryType entry_type,
    const std::string& app_id,
    int size_in_dep,
    IconLoadedCallback icon_loaded_callback) {
}

void WebAppsIntentPickerDelegate::RecordIntentPickerIconEvent(
    apps::IntentPickerIconEvent event) {
}

bool WebAppsIntentPickerDelegate::ShouldLaunchAppDirectly(
    const GURL& url,
    const std::string& app_id,
    PickerEntryType entry_type) {
  return false;
}

void WebAppsIntentPickerDelegate::RecordOutputMetrics(
    PickerEntryType entry_type,
    IntentPickerCloseReason close_reason,
    bool should_persist,
    bool should_launch_app) {
}

// Persisting intent preferences for an app is a no-op, since the checkbox in
// the intent picker bubble view does not show up for non-CrOS.
void WebAppsIntentPickerDelegate::PersistIntentPreferencesForApp(
    PickerEntryType entry_type,
    const std::string& app_id) {

}

void WebAppsIntentPickerDelegate::LaunchApp(content::WebContents* web_contents,
                                            const GURL& url,
                                            const std::string& launch_name,
                                            PickerEntryType entry_type) {
}
}
WEB_CONTENTS_USER_DATA_KEY_IMPL(ManagePasswordsUIController);
#endif
