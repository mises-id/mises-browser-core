#include "mises/browser/extensions/api/mises_private/mises_private_api.h"
#include "mises/common/extensions/api/mises_private.h"
#include "extensions/browser/extension_function_registry.h"
#include "extensions/common/extension.h"
#include "base/logging.h"
#include "mises/browser/android/mises/mises_controller.h"
#include "base/android/sys_utils.h"
#include "base/android/application_status_listener.h"

namespace extensions {
namespace api {

MisesPrivateSetMisesIdFunction::~MisesPrivateSetMisesIdFunction() {}
 
ExtensionFunction::ResponseAction MisesPrivateSetMisesIdFunction::Run() {
  std::unique_ptr<api::mises_private::SetMisesId::Params> params(
      api::mises_private::SetMisesId::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params.get());
  LOG(INFO) << "set mises id :" << params->id;
  android::MisesController::GetInstance()->setMisesUserInfo(params->id);
  return RespondNow(NoArguments());
}


MisesPrivateGetInstallReferrerFunction::~MisesPrivateGetInstallReferrerFunction() {}
ExtensionFunction::ResponseAction MisesPrivateGetInstallReferrerFunction::Run() {
  std::string referrerString = base::android::SysUtils::ReferrerStringFromJni();
  return RespondNow(ArgumentList(
    api::mises_private::GetInstallReferrer::Results::Create(referrerString)));
}

MisesPrivateGetAppStateFunction::~MisesPrivateGetAppStateFunction() {}
ExtensionFunction::ResponseAction MisesPrivateGetAppStateFunction::Run() {
  api::mises_private::AppState state = api::mises_private::AppState::APP_STATE_NONE;
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
  return RespondNow(ArgumentList(
    api::mises_private::GetAppState::Results::Create(state)));
}

}  // namespace api
}  // namespace extensions
