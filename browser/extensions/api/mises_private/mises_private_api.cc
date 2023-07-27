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

#include "content/public/browser/browser_context.h"
#include "net/http/http_request_headers.h"
#include "net/traffic_annotation/network_traffic_annotation.h"
#include "net/url_request/referrer_policy.h"
#include "services/network/public/cpp/simple_url_loader.h"
#include "services/network/public/mojom/fetch_api.mojom-forward.h"
#include "services/network/public/mojom/url_loader_factory.mojom-forward.h"
#include "content/public/browser/storage_partition.h"
#include "extensions/common/extension.h"
#include "net/base/load_flags.h"
#include "url/gurl.h"

#include "extensions/common/features/feature_developer_mode_only.h"
#include "extensions/browser/renderer_startup_helper.h"
#include "chrome/browser/profiles/profile.h"
#include "components/prefs/pref_service.h"
#include "chrome/common/pref_names.h"
#include "extensions/browser/extension_util.h"
#include "extensions/browser/api/storage/storage_frontend.h"
#include "extensions/browser/api/storage/settings_namespace.h"
#include "extensions/browser/extension_registry.h"
#include "extensions/common/constants.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"


namespace {

net::NetworkTrafficAnnotationTag GetNetworkTrafficAnnotationTag() {
  return net::DefineNetworkTrafficAnnotation("mises_private_api", R"(
      semantics {
        sender: "Mises Private Api"
        description:
          "This service is for private usage."
        trigger:
          "Triggered by uses of mises."
        data:
          "JSON RPC response bodies."
        destination: WEBSITE
      }
      policy {
        cookies_allowed: NO
        setting:
          "You can enable or disable this feature on chrome://flags."
        policy_exception_justification:
          "Not implemented."
      }
    )");
}
}


namespace extensions {
namespace api {

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

ExtensionFunction::ResponseAction MisesPrivateGetInstallReferrerFunction::Run() {
  std::string referrerString;
#if BUILDFLAG(IS_ANDROID)
  referrerString = base::android::MisesSysUtils::ReferrerStringFromJni();
#endif
  return RespondNow(ArgumentList(
    api::mises_private::GetInstallReferrer::Results::Create(referrerString)));
}

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
//----------------------------------------------------------------
//log event
ExtensionFunction::ResponseAction MisesPrivateRecordEventFunction::Run() {

#if BUILDFLAG(IS_ANDROID)
  std::unique_ptr<api::mises_private::RecordEvent::Params> params(
      api::mises_private::RecordEvent::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params.get());
  LOG(INFO) << "MisesPrivate set log event params :" << params->data;
  android::MisesController::GetInstance()->recordEvent(
    params->data
  );

#endif
  return RespondNow(NoArguments());
}




MisesPrivateFetchJsonFunction::
    MisesPrivateFetchJsonFunction() {
}
MisesPrivateFetchJsonFunction::
    ~MisesPrivateFetchJsonFunction() {
}


void MisesPrivateFetchJsonFunction::OnFetchJson(api_request_helper::APIRequestResult api_request_result) {

  if (!api_request_result.Is2XXResponseCode()) {
    Respond(Error("Fail to fetch json"));
    Release();
    return;
  }

  Respond(ArgumentList(api::mises_private::FetchJson::Results::Create(api_request_result.body())));
  Release();
}


ExtensionFunction::ResponseAction MisesPrivateFetchJsonFunction::Run() {
    std::unique_ptr<api::mises_private::FetchJson::Params> params(
      api::mises_private::FetchJson::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params.get());
  const GURL& json_url = GURL(params->json_url);
  if (!json_url.is_valid() || json_url.is_empty()) {
    return RespondNow(Error("Invalid json url"));
  }
  if (!json_url.host().ends_with(".mises.site")) {
    return RespondNow(Error("Only supports json from mises.site"));
  }
  auto loader_factory = browser_context()
                         ->GetDefaultStoragePartition()
                         ->GetURLLoaderFactoryForBrowserProcess();
  api_request_helper_ = std::make_unique<api_request_helper::APIRequestHelper>(
      GetNetworkTrafficAnnotationTag(), loader_factory);
  
  auto internal_callback =
      base::BindOnce(&MisesPrivateFetchJsonFunction::OnFetchJson,
                     weak_ptr_factory_.GetWeakPtr());
  api_request_helper_->Request("GET", json_url, "", "",
                               true, std::move(internal_callback));
  AddRef();
  return RespondLater();
}



//----------------------------------------------------------------
//setDefaultEvmWallet
ExtensionFunction::ResponseAction MisesPrivateSetDefaultEVMWalletFunction::Run() {
  std::unique_ptr<api::mises_private::SetDefaultEVMWallet::Params> params(
    api::mises_private::SetDefaultEVMWallet::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params.get());

  Profile* profile = Profile::FromBrowserContext(browser_context());

  PrefService* prefs = profile->GetPrefs();

  prefs->SetString(prefs::kExtensionsUIDefaultEVMWalletID,
                      params->id);
  prefs->SetString(prefs::kExtensionsUIDefaultEVMWalletKeyProperty,
                      params->key_property);
  SetDefaultEVMWallet(util::GetBrowserContextId(browser_context()),
                            params->id, params->key_property);
  RendererStartupHelperFactory::GetForBrowserContext(browser_context())
	            ->OnDefaultEVMWalletChanged(params->id, params->key_property);


  return RespondNow(NoArguments());
}


ExtensionFunction::ResponseAction MisesPrivateGetDefaultEVMWalletFunction::Run() {
  
  Profile* profile = Profile::FromBrowserContext(browser_context());

  PrefService* prefs = profile->GetPrefs();

  std::string id = prefs->GetString(prefs::kExtensionsUIDefaultEVMWalletID);

  return RespondNow(ArgumentList(
    api::mises_private::GetDefaultEVMWallet::Results::Create(id)));
}




}  // namespace api
}  // namespace extensions
