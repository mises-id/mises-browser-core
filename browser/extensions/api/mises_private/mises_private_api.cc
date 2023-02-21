#include "mises/browser/extensions/api/mises_private/mises_private_api.h"
#include "mises/common/extensions/api/mises_private.h"
#include "extensions/browser/extension_function_registry.h"
#include "extensions/common/extension.h"
#include "base/logging.h"
#if BUILDFLAG(IS_ANDROID)
#include "mises/browser/android/mises/mises_controller.h"
#include "base/android/sys_utils.h"
#include "base/android/application_status_listener.h"
#endif

namespace extensions {
namespace api {

MisesPrivateSetMisesIdFunction::~MisesPrivateSetMisesIdFunction() {}

ExtensionFunction::ResponseAction MisesPrivateSetMisesIdFunction::Run() {
  std::unique_ptr<api::mises_private::SetMisesId::Params> params(
      api::mises_private::SetMisesId::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params.get());
  LOG(INFO) << "MisesPrivate set mises id :" << params->id;
#if BUILDFLAG(IS_ANDROID)
  android::MisesController::GetInstance()->setMisesUserInfo(params->id);
#endif
  return RespondNow(NoArguments());
}


MisesPrivateGetInstallReferrerFunction::~MisesPrivateGetInstallReferrerFunction() {}
ExtensionFunction::ResponseAction MisesPrivateGetInstallReferrerFunction::Run() {
  std::string referrerString;
#if BUILDFLAG(IS_ANDROID)
  referrerString = base::android::MisesSysUtils::ReferrerStringFromJni();
#endif
  return RespondNow(ArgumentList(
    api::mises_private::GetInstallReferrer::Results::Create(referrerString)));
}

MisesPrivateGetAppStateFunction::~MisesPrivateGetAppStateFunction() {}
ExtensionFunction::ResponseAction MisesPrivateGetAppStateFunction::Run() {
  api::mises_private::AppState state = api::mises_private::AppState::APP_STATE_NONE;
#if BUILDFLAG(IS_ANDROID)
  switch (base::android::ApplicationStatusListener::GetState()) {
    case base::android::ApplicationState::APPLICATION_STATE_UNKNOWN :{
      state = api::mises_private::AppState::APP_STATE_UNKNOWN;
      break;
    }
    case base::android::ApplicationState::APPLICATION_STATE_HAS_RUNNING_ACTIVITIES :{
      state = api::mises_private::AppState::APP_STATE_RUNNING;
      break;
    }
    case base::android::ApplicationState::APPLICATION_STATE_HAS_PAUSED_ACTIVITIES :{
      state = api::mises_private::AppState::APP_STATE_PAUSED;
      break;
    }
    case base::android::ApplicationState::APPLICATION_STATE_HAS_STOPPED_ACTIVITIES :{
      state = api::mises_private::AppState::APP_STATE_STOPPED;
      break;
    }
    case base::android::ApplicationState::APPLICATION_STATE_HAS_DESTROYED_ACTIVITIES :{
      state = api::mises_private::AppState::APP_STATE_DESTROYED;
      break;
    }
  }
#endif
  return RespondNow(ArgumentList(
    api::mises_private::GetAppState::Results::Create(state)));
}




MisesPrivateNotifyPhishingDetectedFunction::~MisesPrivateNotifyPhishingDetectedFunction() {}
ExtensionFunction::ResponseAction MisesPrivateNotifyPhishingDetectedFunction::Run() {

#if BUILDFLAG(IS_ANDROID)
  std::unique_ptr<api::mises_private::NotifyPhishingDetected::Params> params(
      api::mises_private::NotifyPhishingDetected::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params.get());
  LOG(INFO) << "MisesPrivate notify phishing address :" << params->address;
  android::MisesController::GetInstance()->notifyPhishingDetected(
    params->address, base::BindOnce(
      &MisesPrivateNotifyPhishingDetectedFunction::OnNotificationHandled, base::RetainedRef(this)
    )
  );

  return RespondLater();
#else
  return RespondNow(ArgumentList(
    api::mises_private::NotifyPhishingDetected::Results::Create(api::mises_private::Web3SafeAction::WEB3_SAFE_ACTION_IGNOR)));
#endif
}


void MisesPrivateNotifyPhishingDetectedFunction::OnNotificationHandled(int action) {
  Respond(ArgumentList(
    api::mises_private::NotifyPhishingDetected::Results::Create((api::mises_private::Web3SafeAction)action)));
}


}  // namespace api
}  // namespace extensions
