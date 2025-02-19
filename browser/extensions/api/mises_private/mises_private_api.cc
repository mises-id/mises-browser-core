#include "mises/browser/extensions/api/mises_private/mises_private_api.h"
#include "mises/common/extensions/api/mises_private.h"
#include "mises/components/constants/url_constants.h"
#include "mises/components/constants/pref_names.h"
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
#include "mises/browser/extensions/mises_webstore_installer.h"


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
  std::optional<api::mises_private::SetMisesId::Params> params(
      api::mises_private::SetMisesId::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  LOG(INFO) << "MisesPrivate set mises id :" << params->id;
#if BUILDFLAG(IS_ANDROID)
  chrome::android::MisesController::GetInstance()->setMisesUserInfo(params->id);
#endif
  Profile* profile = Profile::FromBrowserContext(browser_context());
  PrefService* prefs = profile->GetPrefs();
  if (prefs->FindPreference(kMisesWalletAuthCache)) {
    prefs->SetString(kMisesWalletAuthCache, params->id);
  }
  return RespondNow(NoArguments());
}

MisesPrivateInstallExtensionByIdFunction::MisesPrivateInstallExtensionByIdFunction() {
}
MisesPrivateInstallExtensionByIdFunction::~MisesPrivateInstallExtensionByIdFunction() {
}


ExtensionFunction::ResponseAction MisesPrivateInstallExtensionByIdFunction::Run() {
  std::optional<api::mises_private::InstallExtensionById::Params> params(
    api::mises_private::InstallExtensionById::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  LOG(INFO) << "MisesPrivate InstallExtensionById :" << params->id;
  Profile* profile = Profile::FromBrowserContext(browser_context());
  scoped_refptr<WebstoreInstallerForImporting> installer =
  new WebstoreInstallerForImporting(
    params->id, profile,
      base::BindOnce(
          &MisesPrivateInstallExtensionByIdFunction::OnWebstoreInstallResult,
          weak_ptr_factory_.GetWeakPtr()));
  installer->StartInstaller();
  AddRef();
  return RespondLater();
}

void MisesPrivateInstallExtensionByIdFunction::OnWebstoreInstallResult(
  bool success,
  const std::string& error,
  extensions::webstore_install::Result result) {

  Respond(ArgumentList(api::mises_private::InstallExtensionById::Results::Create(error)));
  Release();
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
  api::mises_private::AppState state = api::mises_private::AppState::kNone;
#if BUILDFLAG(IS_ANDROID)
  switch (base::android::ApplicationStatusListener::GetState()) {
    case base::android::ApplicationState::APPLICATION_STATE_UNKNOWN :{
      state = api::mises_private::AppState::kUnknown;
      break;
    }
    case base::android::ApplicationState::APPLICATION_STATE_HAS_RUNNING_ACTIVITIES :{
      state = api::mises_private::AppState::kRunning;
      break;
    }
    case base::android::ApplicationState::APPLICATION_STATE_HAS_PAUSED_ACTIVITIES :{
      state = api::mises_private::AppState::kPaused;
      break;
    }
    case base::android::ApplicationState::APPLICATION_STATE_HAS_STOPPED_ACTIVITIES :{
      state = api::mises_private::AppState::kStopped;
      break;
    }
    case base::android::ApplicationState::APPLICATION_STATE_HAS_DESTROYED_ACTIVITIES :{
      state = api::mises_private::AppState::kDestroyed;
      break;
    }
  }
#endif
  state = api::mises_private::AppState::kRunning;
  return RespondNow(ArgumentList(
    api::mises_private::GetAppState::Results::Create(state)));
}



ExtensionFunction::ResponseAction MisesPrivateNotifyPhishingDetectedFunction::Run() {

#if BUILDFLAG(IS_ANDROID)
  std::optional<api::mises_private::NotifyPhishingDetected::Params> params(
      api::mises_private::NotifyPhishingDetected::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  LOG(INFO) << "MisesPrivate notify phishing address :" << params->address;
  chrome::android::MisesController::GetInstance()->showNotifyDialog(
    chrome::android::MisesControllerDialogType::kPhishingDetected,
    params->address, base::BindOnce(
      &MisesPrivateNotifyPhishingDetectedFunction::OnNotificationHandled, base::RetainedRef(this)
    )
  );

  return RespondLater();
#else
  return RespondNow(ArgumentList(
    api::mises_private::NotifyPhishingDetected::Results::Create(api::mises_private::Web3SafeAction::kIgnor)));
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
  std::optional<api::mises_private::RecordEvent::Params> params(
      api::mises_private::RecordEvent::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  LOG(INFO) << "MisesPrivate set log event params :" << params->data;
  chrome::android::MisesController::GetInstance()->recordEvent(
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
    std::optional<api::mises_private::FetchJson::Params> params(
      api::mises_private::FetchJson::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  const GURL& json_url = GURL(params->json_url);
  if (!json_url.is_valid() || json_url.is_empty()) {
    return RespondNow(Error("Invalid json url"));
  }
  if (!json_url.host().ends_with(kMisesHost)) {
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
  std::optional<api::mises_private::SetDefaultEVMWallet::Params> params(
    api::mises_private::SetDefaultEVMWallet::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);

  SetDefaultEVMWalletForBrowserContext(browser_context(),
                            params->id, params->key_property);


  return RespondNow(NoArguments());
}


ExtensionFunction::ResponseAction MisesPrivateGetDefaultEVMWalletFunction::Run() {

  std::string id = GetDefaultEVMWalletForBrowserContext(browser_context());

  return RespondNow(ArgumentList(
    api::mises_private::GetDefaultEVMWallet::Results::Create(id)));
}
}  // namespace api
}  // namespace extensions
