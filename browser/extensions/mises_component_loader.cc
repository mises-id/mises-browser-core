/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/extensions/mises_component_loader.h"

#include <string>

#include "base/functional/bind.h"
#include "base/command_line.h"
#include "base/feature_list.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/extensions/extension_service.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/common/pref_names.h"
#include "mises/components/constants/pref_names.h"
#include "components/grit/mises_components_resources.h"
#include "components/prefs/pref_change_registrar.h"
#include "components/prefs/pref_service.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"
#include "extensions/browser/extension_prefs.h"
#include "extensions/browser/extension_registry.h"
#include "extensions/browser/extension_system.h"
#include "extensions/common/constants.h"
#include "extensions/common/mojom/manifest.mojom.h"

#include "mises/components/mises_extension/grit/mises_wallet.h"
#include "extensions/browser/api/storage/storage_frontend.h"
#include "extensions/browser/api/storage/settings_namespace.h"
#include "extensions/browser/extension_registry.h"
#include "extensions/common/constants.h"

#if BUILDFLAG(IS_ANDROID)
#include "base/android/sys_utils.h"
#include "chrome/browser/android/tab_android.h"
#include "chrome/browser/ui/android/tab_model/tab_model.h"
#include "chrome/browser/ui/android/tab_model/tab_model_list.h"
#include "content/public/browser/web_contents.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/android/app_menu_bridge.h" 
#include "components/messages/android/message_dispatcher_bridge.h"
#include "components/messages/android/message_enums.h"
#include "components/messages/android/message_wrapper.h"
#endif

#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "chrome/browser/extensions/webstore_install_with_prompt.h"
#include "chrome/common/extensions/webstore_install_result.h"
#include "extensions/browser/extension_file_task_runner.h"
#include "content/public/browser/web_contents.h"
#include "ui/base/l10n/l10n_util.h"
#include "chrome/grit/generated_resources.h"
#include "chrome/browser/android/android_theme_resources.h"
#include "chrome/browser/android/resource_mapper.h"
#endif

#include "base/strings/strcat.h"
#include "base/strings/utf_string_conversions.h"
#include "chrome/browser/notifications/notification_display_service.h"
#include "chrome/browser/notifications/notification_display_service_factory.h"
#include "ui/message_center/public/cpp/notification.h"
#include "ui/message_center/public/cpp/notification_types.h"
#include "ui/message_center/public/cpp/notifier_id.h"
#include "components/grit/mises_components_strings.h"

namespace {

#if BUILDFLAG(ENABLE_EXTENSIONS)

// Silent installer via websotre w/o any prompt or bubble.
class WebstoreInstallerForImporting
    : public extensions::WebstoreInstallWithPrompt {
 public:
  using WebstoreInstallWithPrompt::WebstoreInstallWithPrompt;

 private:
  ~WebstoreInstallerForImporting() override = default;

  std::unique_ptr<ExtensionInstallPrompt::Prompt>
      CreateInstallPrompt() const override {
    return nullptr;
  }
  bool ShouldShowPostInstallUI() const override { return true; }
};

#endif

#if BUILDFLAG(IS_ANDROID)

content::WebContents* GetWebContentsForProfile(Profile* profile) {
  for (const TabModel* tab_model : TabModelList::models()) {
    if (tab_model->GetProfile() != profile)
      continue;

    int tab_count = tab_model->GetTabCount();
    for (int i = 0; i < tab_count; i++) {
      content::WebContents* web_contents = tab_model->GetWebContentsAt(i);
      if (web_contents)
        return web_contents;
    }
  }
  return nullptr;
}
#else

std::unique_ptr<message_center::Notification> CreateMessageCenterNotification(
    const std::u16string& title,
    const std::u16string& body,
    const std::string& uuid,
    const GURL& link) {
  message_center::RichNotificationData notification_data;
  // hack to prevent origin from showing in the notification
  notification_data.context_message = u" ";
  auto notification = std::make_unique<message_center::Notification>(
      message_center::NOTIFICATION_TYPE_SIMPLE, uuid, title, body,
      ui::ImageModel(), std::u16string(), link,
      message_center::NotifierId(message_center::NotifierType::SYSTEM_COMPONENT,
                                 "service.mises"),
      notification_data, nullptr);

  return notification;
}


#endif

const static int kPreinstallMaxTry = 2;


}  // namespace

using extensions::mojom::ManifestLocation;

namespace extensions {

MisesComponentLoader::MisesComponentLoader(ExtensionSystem* extension_system,
                                           Profile* profile)
    : ComponentLoader(extension_system, profile),
      profile_(profile),
      profile_prefs_(profile->GetPrefs()) {

#if BUILDFLAG(IS_ANDROID)
  _auto_confirm = std::make_unique<extensions::ScopedTestDialogAutoConfirm>(
          extensions::ScopedTestDialogAutoConfirm::ACCEPT);
#endif
}

MisesComponentLoader::~MisesComponentLoader() = default;

void MisesComponentLoader::OnComponentRegistered(std::string extension_id) {

}

void MisesComponentLoader::OnComponentReady(std::string extension_id,
                                            bool allow_file_access,
                                            const base::FilePath& install_dir,
                                            const std::string& manifest) {
  Add(manifest, install_dir);
  if (allow_file_access) {
    ExtensionPrefs::Get(profile_)->SetAllowFileAccess(extension_id, true);
  }

}

void MisesComponentLoader::ReinstallAsNonComponent(
    const std::string extension_id) {
  extensions::ExtensionService* service =
      extensions::ExtensionSystem::Get(profile_)->extension_service();
  extensions::ExtensionRegistry* registry =
      extensions::ExtensionRegistry::Get(profile_);
  const Extension* extension = registry->GetInstalledExtension(extension_id);
  DCHECK(extension);
  if (extension->location() == ManifestLocation::kComponent) {
    service->RemoveComponentExtension(extension_id);
    std::string error;
    scoped_refptr<Extension> normal_extension = Extension::Create(
        extension->path(), ManifestLocation::kExternalPref,
        *extension->manifest()->value(), extension->creation_flags(), &error);
    service->AddExtension(normal_extension.get());
  }
}

void MisesComponentLoader::AddExtension(const std::string& extension_id,
                                        const std::string& name,
                                        const std::string& public_key) {
  // mises::RegisterComponent(
  //     g_browser_process->component_updater(), name, public_key,
  //     base::BindOnce(&MisesComponentLoader::OnComponentRegistered,
  //                    base::Unretained(this), extension_id),
  //     base::BindRepeating(&MisesComponentLoader::OnComponentReady,
  //                         base::Unretained(this), extension_id, true));
}


void MisesComponentLoader::AddDefaultComponentExtensions(
    bool skip_session_components) {
  ComponentLoader::AddDefaultComponentExtensions(skip_session_components);

}

void MisesComponentLoader::OnExtensionLoaded(content::BrowserContext* browser_context,
                                  const Extension* extension) {

    LOG(INFO) << "[Mises] MisesComponentLoader::OnExtensionLoaded " << extension->id();

}

void MisesComponentLoader::OnExtensionReady(content::BrowserContext* browser_context,
                                     const Extension* extension) {
  if (extension->id() == metamask_extension_id) {
    metamask_ready_ = true;
    StorageFrontend* frontend = StorageFrontend::Get(profile_);
      frontend->RunWithStorage(
        extension, settings_namespace::LOCAL,
      base::BindOnce(&MisesComponentLoader::AsyncRunWithMetamaskStorage, base::Unretained(this))
    );
    DismissMessageInternal(messages::DismissReason::DISMISSED_BY_FEATURE);
  }
  if (extension->id() == mises_extension_id) {
    mises_ready_ = true;
  }
  if (mises_ready_ && metamask_ready_) {
    if (profile_prefs_->FindPreference(kMisesDidMigrated) && !profile_prefs_->GetBoolean(kMisesDidMigrated)) {
      profile_prefs_->SetBoolean(kMisesDidMigrated, true);
      StorageFrontend* frontend = StorageFrontend::Get(profile_);
      frontend->RunWithStorage(
        extension, settings_namespace::LOCAL,
      base::BindOnce(&MisesComponentLoader::AsyncRunWithMiseswalletStorage, base::Unretained(this))
      );
    }
  }

#if BUILDFLAG(IS_ANDROID)
  //refresh extension menu icon
  AppMenuBridge::Factory::GetForProfile(profile_)->GetRunningExtensionsInternal(nullptr);
  content::WebContents* web_contents = GetWebContentsForProfile(profile_);
  if (web_contents) {
    AppMenuBridge::Factory::GetForProfile(profile_)->GetRunningExtensionsInternal(web_contents);
  }
#endif

}
void MisesComponentLoader::AsyncRunWithMetamaskStorage(value_store::ValueStore* storage) {
  LOG(INFO) << "[Mises] MisesComponentLoader::AsyncRunWithMetamaskStorage";
  metamaskValue = base::Value(storage->Get().PassSettings());
  LOG(INFO) << "[Mises] Got Metamask Storage";
  base::Value::Dict *data = metamaskValue.GetDict().FindDict("data");
  if (data) {
    base::Value::Dict *NetworkController = data->FindDict("NetworkController");
    if (NetworkController) {
      base::Value::Dict *provider = NetworkController->FindDict("provider");
      if (provider) {
        LOG(INFO) << "[Mises] Got Metamask Storage provider" << *provider;
        std::string *provider_type = provider->FindString("type");
        if (provider_type && *provider_type == "MisesTestNet") {
          provider->Set("chainId", "0x1");
          provider->Set("nickname", "");
          provider->Set("rpcUrl", "");
          provider->Set("ticker", "ETH");
          provider->Set("type", "mainnet");
          storage->Set(value_store::ValueStore::WriteOptionsValues::DEFAULTS, metamaskValue.GetDict());
        }

      }
    }
  }

  content::GetUIThreadTaskRunner({})->PostTask(
    FROM_HERE,
    base::BindOnce(&MisesComponentLoader::MetamaskMigrationDone, base::Unretained(this)));


}
void MisesComponentLoader::MetamaskMigrationDone() {

}
void MisesComponentLoader::AsyncRunWithMiseswalletStorage(value_store::ValueStore* storage) {
  LOG(INFO) << "[Mises] MisesComponentLoader::AsyncRunWithMiseswalletStorage";
  if (storage->GetBytesInUse("migrated") == 0){
    LOG(INFO) << "[Mises] DoMigrate";
    storage->Set(value_store::ValueStore::WriteOptionsValues::DEFAULTS, "migrated", metamaskValue);
  }



}

void MisesComponentLoader::OnExtensionInstalled(content::BrowserContext* browser_context,
                                    const Extension* extension,
                                    bool is_update) {

  if(extension && extension->location() != ManifestLocation::kComponent) {
#if BUILDFLAG(IS_ANDROID)
    base::android::MisesSysUtils::LogEventFromJni("install_extension", "id", extension->id(), "is_update", is_update?"1":"0");
#endif
    LOG(INFO) << "[Mises] MisesComponentLoader::OnExtensionInstalled";
  }

  if(extension && extension->location() == ManifestLocation::kComponent) {
    LOG(INFO) << "[Mises] MisesComponentLoader::OnExtensionInstalled " << extension->id();
    if (extension->id() == mises_extension_id ) {
      extensions::ExtensionSystem* system = extensions::ExtensionSystem::Get(profile_);
      if (system) {
        extensions::ExtensionService* service = system->extension_service();
        if (service) {
          //reload mises extension after install, this fix the multi workservice bug when extension updated
          LOG(INFO) << "[Mises] mises extension reload";
          service->ReloadExtension(mises_extension_id);
        }
      }

    }
  }


}
void MisesComponentLoader::OnExtensionUninstalled(content::BrowserContext* browser_context,
                                      const Extension* extension,
                                      UninstallReason reason) {


  if(extension && extension->location() != ManifestLocation::kComponent) {
#if BUILDFLAG(IS_ANDROID)
    base::android::MisesSysUtils::LogEventFromJni("uninstall_extension", "id", extension->id());
#endif
    LOG(INFO) << "[Mises] MisesComponentLoader::OnExtensionUninstalled";
  }
  if(extension && extension->id() == metamask_extension_id) {
    //disable preinstall metamask
    if (profile_prefs_->FindPreference(kPreinstallMetamaskEnabled)) {
      profile_prefs_->SetBoolean(kPreinstallMetamaskEnabled, false);
    }
  }


}


void MisesComponentLoader::OnWebstoreInstallResult(
    const std::string& extension_id,
    bool success,
    const std::string& error,
    extensions::webstore_install::Result result) {
  LOG(INFO) << "[Mises] MisesComponentLoader::OnWebstoreInstallResult " << result;
  if (result != extensions::webstore_install::Result::SUCCESS &&
      result != extensions::webstore_install::Result::LAUNCH_IN_PROGRESS) {
    if (metamask_preinstall_try_counter_ < kPreinstallMaxTry) {
        base::SequencedTaskRunner::GetCurrentDefault()->PostDelayedTask(
          FROM_HERE,
          base::BindOnce(
            &MisesComponentLoader::PreInstallMetamaskFromWebStore,
            weak_ptr_factory_.GetWeakPtr()),
          base::Seconds(2 * metamask_preinstall_try_counter_ + 1 ));

    } else {
#if BUILDFLAG(IS_ANDROID)
      base::android::MisesSysUtils::LogEventFromJni("preinstall_extension_fail", "id", extension_id);
#endif
      DismissMessageInternal(messages::DismissReason::DISMISSED_BY_FEATURE);
      base::SequencedTaskRunner::GetCurrentDefault()->PostDelayedTask(
        FROM_HERE,
        base::BindOnce(
          &MisesComponentLoader::ShowPreInstallMessage,
          weak_ptr_factory_.GetWeakPtr(), true), 
        base::Seconds(1));
    }
  }

 if (result == extensions::webstore_install::Result::SUCCESS) {
#if BUILDFLAG(IS_ANDROID)
    base::android::MisesSysUtils::LogEventFromJni("preinstall_extension", "id", extension_id);
#endif
 }
}


void MisesComponentLoader::ShowPreInstallMessage(bool is_fail) {
  LOG(INFO) << "[Mises] MisesComponentLoader::ShowPreInstallMessage " << is_fail;
  std::u16string title = l10n_util::GetStringUTF16(IDS_EXTENSIONS_MESSAGE_TITLE);
  std::u16string description;
  if (!is_fail) {
    description = l10n_util::GetStringUTF16(IDS_EXTENSIONS_MESSAGE_DESC_PREINSTALL);
  } else {
    description = l10n_util::GetStringUTF16(IDS_EXTENSIONS_MESSAGE_DESC_PREINSTALL_FAIL);
  }
  GURL link =  GURL(base::StrCat(
        {"https://chrome.google.com/webstore/detail/", metamask_extension_id}));
  std::string guid = base::GenerateGUID();
#if !BUILDFLAG(IS_ANDROID)
  auto notification = CreateMessageCenterNotification(
    title, description, guid,link
  );
  NotificationDisplayServiceFactory::GetForProfile(profile_)->Display(
      NotificationHandler::Type::SEND_TAB_TO_SELF, *notification, nullptr);
#else
  base::WeakPtr<content::WebContents> web_contents;
  if (profile_ != nullptr &&
          GetWebContentsForProfile(profile_) != nullptr) {
    web_contents = GetWebContentsForProfile(profile_)->GetWeakPtr();
  } else {
    web_contents = nullptr;
  }
  std::unique_ptr<messages::MessageWrapper> message = std::make_unique<messages::MessageWrapper>(
      messages::MessageIdentifier::SEND_TAB_TO_SELF);
  message->SetTitle(title);
  message->SetDescription(description);
  message->SetPrimaryButtonText(
      l10n_util::GetStringUTF16(IDS_EXTENSIONS_MESSAGE_OPEN));
  message->SetIconResourceId(ResourceMapper::MapToJavaDrawableId(IDR_EXTENSIONS));
  message->SetActionClick(base::BindOnce(
      &MisesComponentLoader::OnMessageOpened,
      weak_ptr_factory_.GetWeakPtr(), link, guid));
  message->SetDismissCallback(base::BindOnce(
      &MisesComponentLoader::OnMessageDismissed,
      weak_ptr_factory_.GetWeakPtr(), guid));

  if (web_contents) {
    messages::MessageDispatcherBridge::Get()->EnqueueWindowScopedMessage(
        message.get(), web_contents->GetTopLevelNativeWindow(),
        messages::MessagePriority::kNormal);
  }
  message_ = std::move(message);
#endif
  
}

void MisesComponentLoader::OnMessageOpened(GURL url, std::string guid) {
  LOG(INFO) << "[Mises] MisesComponentLoader::OnMessageOpened";
  content::OpenURLParams params(url, content::Referrer(),
                                WindowOpenDisposition::NEW_FOREGROUND_TAB,
                                ui::PAGE_TRANSITION_AUTO_TOPLEVEL, false);
  params.should_replace_current_entry = false;
  content::WebContents* web_contents = GetWebContentsForProfile(profile_);
  if (web_contents) {
      web_contents->OpenURL(params);
  }
  
  DismissMessageInternal(messages::DismissReason::PRIMARY_ACTION);
}
void MisesComponentLoader::OnMessageDismissed(
  std::string guid, messages::DismissReason dismiss_reason) {    
  LOG(INFO) << "[Mises] MisesComponentLoader::OnMessageDismissed";                                    
  message_.reset();
}

void MisesComponentLoader::DismissMessageInternal(
    messages::DismissReason dismiss_reason) {
#if BUILDFLAG(IS_ANDROID)
  if (!message_)
    return;
  messages::MessageDispatcherBridge::Get()->DismissMessage(message_.get(),
                                                           dismiss_reason);
#endif
}

void MisesComponentLoader::PreInstallMetamaskFromWebStore() {
  LOG(INFO) << "[Mises] MisesComponentLoader::PreInstallMetamaskFromWebStore";
  if (!message_) {
    ShowPreInstallMessage(false);
  }
  metamask_preinstall_try_counter_ ++;

  scoped_refptr<WebstoreInstallerForImporting> installer =
      new WebstoreInstallerForImporting(
          metamask_extension_id, profile_,
          base::BindOnce(
              &MisesComponentLoader::OnWebstoreInstallResult,
              weak_ptr_factory_.GetWeakPtr(), metamask_extension_id));
  installer->BeginInstall();
}
void MisesComponentLoader::AddMetamaskExtensionOnStartup() {
  LOG(INFO) << "[Mises] MisesComponentLoader::AddMetamaskExtensionOnStartup";

  ExtensionRegistry::Get(profile_)->AddObserver(this);

  extensions::ExtensionRegistry* registry =
      extensions::ExtensionRegistry::Get(profile_);
  const Extension* metamask_extension = registry->GetInstalledExtension(metamask_extension_id);
  if (!metamask_extension) {
      if (!profile_prefs_->FindPreference(kPreinstallMetamaskEnabled) || 
        profile_prefs_->GetBoolean(kPreinstallMetamaskEnabled)) {

        base::SequencedTaskRunner::GetCurrentDefault()->PostDelayedTask(
          FROM_HERE,
          base::BindOnce(
            &MisesComponentLoader::PreInstallMetamaskFromWebStore,
            weak_ptr_factory_.GetWeakPtr()),
        base::Seconds(1));


       
      }
  }

  const Extension* mises_extension = registry->GetInstalledExtension(mises_extension_id);
  if (!mises_extension) {
    base::FilePath miseswallet_extension_path(FILE_PATH_LITERAL(""));
    miseswallet_extension_path =
        miseswallet_extension_path.Append(FILE_PATH_LITERAL("mises_wallet"));
    Add(IDR_MISES_WALLET_MANIFEST_JSON, miseswallet_extension_path);
  }


}

}  // namespace extensions
