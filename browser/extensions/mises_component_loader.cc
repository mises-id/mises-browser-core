/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/extensions/mises_component_loader.h"

#include <string>

#include "base/functional/bind.h"
#include "base/command_line.h"
#include "base/feature_list.h"
#include "base/strings/string_split.h"
#include "ui/base/l10n/l10n_util.h"
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

#include "mises/components/mises_extension/grit/mises_extension.h"
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
#include "chrome/browser/android/android_theme_resources.h"
#include "chrome/browser/android/resource_mapper.h"
#include "mises/browser/android/preferences/features.h"
#include "mises/browser/android/mises/mises_controller.h"
#endif

#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "mises/browser/extensions/mises_webstore_installer.h"
#include "extensions/common/features/feature_developer_mode_only.h"
#include "chrome/browser/extensions/updater/extension_updater.h"
#endif

#include "base/strings/strcat.h"
#include "base/strings/utf_string_conversions.h"
#include "chrome/browser/notifications/notification_display_service.h"
#include "chrome/browser/notifications/notification_display_service_factory.h"
#include "ui/message_center/public/cpp/notification.h"
#include "ui/message_center/public/cpp/notification_types.h"
#include "ui/message_center/public/cpp/notifier_id.h"
#include "components/grit/mises_components_strings.h"
#include "mises/browser/brave_wallet/keyring_service_factory.h"
#include "mises/components/brave_wallet/browser/keyring_service.h"

namespace {



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

const static int kPreinstallMaxError = 3;


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
  if (extension->id() == metamask_extension_id && !metamask_ready_) {
    metamask_ready_ = true;
#if BUILDFLAG(IS_ANDROID)
    if (extension->location() != ManifestLocation::kComponent) {
      DismissMessageInternal(messages::DismissReason::DISMISSED_BY_FEATURE);
    }
    
#endif
  }
  if (extension->id() == mises_extension_id) {
    mises_ready_ = true;
    if (profile_prefs_->FindPreference(kMisesWalletDidMigrated) && !profile_prefs_->GetBoolean(kMisesWalletDidMigrated)) {
      
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

// void MisesComponentLoader::AsyncRunWithTempleWalletStorage(value_store::ValueStore* storage) {
//   LOG(INFO) << "[Mises] MisesComponentLoader::AsyncRunWithTempleWalletStorage";
  
//   if (storage->GetBytesInUse("MISES_ACCEPT_TOS") == 0){
//     storage->Set(value_store::ValueStore::WriteOptionsValues::DEFAULTS, "MISES_ACCEPT_TOS", base::Value(true));
//   }
  

// }

void MisesComponentLoader::AsyncRunWithMiseswalletStorage(value_store::ValueStore* storage) {
  LOG(INFO) << "[Mises] MisesComponentLoader::AsyncRunWithMiseswalletStorage";
  
  base::Value wallet_store = base::Value(storage->Get().PassSettings());  
  if (wallet_store.is_dict()) {
    content::GetUIThreadTaskRunner({})->PostTask(
      FROM_HERE,
      base::BindOnce(
        &MisesComponentLoader::ContinueMiseswalletMigration, 
        base::Unretained(this), std::move(wallet_store))
    );
  } else {
     profile_prefs_->SetBoolean(kMisesWalletDidMigrated, true);
  }
  

}
void MisesComponentLoader::ContinueMiseswalletMigration(const base::Value wallet_store) {
  auto* keyring_service =
      brave_wallet::KeyringServiceFactory::GetServiceForContext(
          profile_);
  if (!keyring_service) {
    return;
  }
  const base::Value::List *multi = wallet_store.GetDict().FindList("keyring/key-multi-store");
  if (multi) {
    keyring_service->SetLegacyKeystore(*multi);
    profile_prefs_->SetBoolean(kMisesWalletDidMigrated, true);
  }
  
}

void MisesComponentLoader::OnExtensionInstalled(content::BrowserContext* browser_context,
                                    const Extension* extension,
                                    bool is_update) {

  if(extension && extension->location() != ManifestLocation::kComponent) {
#if BUILDFLAG(IS_ANDROID)
    base::android::MisesSysUtils::LogEventFromJni(is_update?"update_extension":"install_extension", "id", extension->id());
#endif
    LOG(INFO) << "[Mises] MisesComponentLoader::OnExtensionInstalled";

    // if (extension->id() == temple_extension_id) {
    //   StorageFrontend* frontend = StorageFrontend::Get(profile_);
    //   frontend->RunWithStorage(
    //     extension, settings_namespace::LOCAL,
    //     base::BindOnce(&MisesComponentLoader::AsyncRunWithTempleWalletStorage, base::Unretained(this))
    //   );
    // }
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

// bool MisesComponentLoader::IsPreinstallExtension(const std::string& extension_id) {
// #if BUILDFLAG(IS_ANDROID)
//   std::vector<std::string> preinstalls = preferences::features::GetMisesPreinstallExtensionIds();
//   std::vector<std::string> tos_preinstalls = preferences::features::GetMisesPreinstallExtensionWithTOSIds();
//   return base::Contains(preinstalls, extension_id) ||  base::Contains(tos_preinstalls, extension_id);
// #else
//   return false;
// #endif
// }

// bool  MisesComponentLoader::IsIgnoredPreinstallExtension(const std::string& extension_id) {
//   if (profile_prefs_->FindPreference(kIgnoredPreinstallExtensionIds)) {
//     std::string ignored_str = profile_prefs_->GetString(kIgnoredPreinstallExtensionIds);
//     std::vector<std::string> ignored = base::SplitString(
//       ignored_str, ",", base::TRIM_WHITESPACE, base::SPLIT_WANT_NONEMPTY);
//     return base::Contains(ignored, extension_id);
//   }
//   return false;
// }
// void  MisesComponentLoader::AddIgnoredPreinstallExtension(const std::string& extension_id) {
//   if (IsIgnoredPreinstallExtension(extension_id)) {
//     return;
//   }
//   //disable preinstall it
//   if (profile_prefs_->FindPreference(kIgnoredPreinstallExtensionIds)) {
//     std::string ignored_str = profile_prefs_->GetString(kIgnoredPreinstallExtensionIds);
//     profile_prefs_->SetString(kIgnoredPreinstallExtensionIds, ignored_str + "," + extension_id);
// #if BUILDFLAG(IS_ANDROID)
//     base::android::MisesSysUtils::LogEventFromJni("preinstall_extension", "step", "ignor", "id", extension_id);
// #endif
//   }
//   return ;
// }

void MisesComponentLoader::OnExtensionUninstalled(content::BrowserContext* browser_context,
                                      const Extension* extension,
                                      UninstallReason reason) {


  if(extension && extension->location() != ManifestLocation::kComponent) {
#if BUILDFLAG(IS_ANDROID)
    base::android::MisesSysUtils::LogEventFromJni("uninstall_extension", "id", extension->id());
#endif
    LOG(INFO) << "[Mises] MisesComponentLoader::OnExtensionUninstalled";
  }
  // if(extension && IsPreinstallExtension(extension->id())) {
  //   AddIgnoredPreinstallExtension(extension->id());
  // }


}


// void MisesComponentLoader::OnWebstoreInstallResult(
//     const std::string& extension_id,
//     bool success,
//     const std::string& error,
//     extensions::webstore_install::Result result) {
//   LOG(INFO) << "[Mises] MisesComponentLoader::OnWebstoreInstallResult " << result;
//   pending_preinstall.erase(extension_id);

//   if (result != extensions::webstore_install::Result::SUCCESS &&
//       result != extensions::webstore_install::Result::LAUNCH_IN_PROGRESS) {
//     preinstall_error_counter_ ++;
//     if (preinstall_error_counter_ < kPreinstallMaxError) {
// #if BUILDFLAG(IS_ANDROID)
//         base::android::MisesSysUtils::LogEventFromJni("preinstall_extension", "step", "retry", "id", extension_id);
// #endif
//         base::SequencedTaskRunner::GetCurrentDefault()->PostDelayedTask(
//           FROM_HERE,
//           base::BindOnce(
//             &MisesComponentLoader::PreInstallExtensionFromWebStore,
//             weak_ptr_factory_.GetWeakPtr(), extension_id),
//           base::Seconds(2 * preinstall_error_counter_ + 1 ));

//     } else {
// #if BUILDFLAG(IS_ANDROID)
//       base::android::MisesSysUtils::LogEventFromJni("preinstall_extension", "step", "fail", "id", extension_id);
//       //DismissMessageInternal(messages::DismissReason::DISMISSED_BY_FEATURE);
// #endif
      
//     // base::SequencedTaskRunner::GetCurrentDefault()->PostDelayedTask(
//     //     FROM_HERE,
//     //     base::BindOnce(
//     //       &MisesComponentLoader::ShowPreInstallMessage,
//     //       weak_ptr_factory_.GetWeakPtr(), true), 
//     //     base::Seconds(1));
//     }
//   }

//  if (result == extensions::webstore_install::Result::SUCCESS) {
// #if BUILDFLAG(IS_ANDROID)
//     AppMenuBridge::Factory::GetForProfile(profile_)->CloseExtensionTabs(extension_id);
//     AppMenuBridge::Factory::GetForProfile(profile_)->ReloadTabs();
//     base::android::MisesSysUtils::LogEventFromJni("preinstall_extension", "step", "finish", "id", extension_id);
// #endif
//  }

//  if (pending_preinstall.empty()) {
//     OnPreInstallFinished();
//  }
// }


// void MisesComponentLoader::ShowPreInstallMessage(bool is_fail) {
//   LOG(INFO) << "[Mises] MisesComponentLoader::ShowPreInstallMessage " << is_fail;
//   std::u16string title = l10n_util::GetStringUTF16(IDS_EXTENSIONS_MESSAGE_TITLE);
//   std::u16string description;
//   if (!is_fail) {
//     description = l10n_util::GetStringUTF16(IDS_EXTENSIONS_MESSAGE_DESC_PREINSTALL);
//   } else {
//     description = l10n_util::GetStringUTF16(IDS_EXTENSIONS_MESSAGE_DESC_PREINSTALL_FAIL);
//   }
//   GURL link =  GURL(base::StrCat(
//         {"https://chrome.google.com/webstore/detail/", metamask_extension_id}));
//   std::string guid = base::Uuid::GenerateRandomV4().AsLowercaseString();
// #if !BUILDFLAG(IS_ANDROID)
//   auto notification = CreateMessageCenterNotification(
//     title, description, guid,link
//   );
//   NotificationDisplayServiceFactory::GetForProfile(profile_)->Display(
//       NotificationHandler::Type::SEND_TAB_TO_SELF, *notification, nullptr);
// #else
//   base::WeakPtr<content::WebContents> web_contents;
//   if (profile_ != nullptr &&
//           GetWebContentsForProfile(profile_) != nullptr) {
//     web_contents = GetWebContentsForProfile(profile_)->GetWeakPtr();
//   } else {
//     web_contents = nullptr;
//   }
//   std::unique_ptr<messages::MessageWrapper> message = std::make_unique<messages::MessageWrapper>(
//       messages::MessageIdentifier::SEND_TAB_TO_SELF);
//   message->SetTitle(title);
//   message->SetDescription(description);
//   message->SetPrimaryButtonText(
//       l10n_util::GetStringUTF16(IDS_EXTENSIONS_MESSAGE_OPEN));
//   message->SetIconResourceId(ResourceMapper::MapToJavaDrawableId(IDR_EXTENSIONS));
//   message->SetActionClick(base::BindOnce(
//       &MisesComponentLoader::OnMessageOpened,
//       weak_ptr_factory_.GetWeakPtr(), link, guid));
//   message->SetDismissCallback(base::BindOnce(
//       &MisesComponentLoader::OnMessageDismissed,
//       weak_ptr_factory_.GetWeakPtr(), guid));

//   if (web_contents) {
//     messages::MessageDispatcherBridge::Get()->EnqueueWindowScopedMessage(
//         message.get(), web_contents->GetTopLevelNativeWindow(),
//         messages::MessagePriority::kNormal);
//   }
//   message_ = std::move(message);
// #endif
  
// }

// void MisesComponentLoader::OnMessageOpened(GURL url, std::string guid) {
//   LOG(INFO) << "[Mises] MisesComponentLoader::OnMessageOpened";
// #if BUILDFLAG(IS_ANDROID)
//   content::OpenURLParams params(url, content::Referrer(),
//                                 WindowOpenDisposition::NEW_FOREGROUND_TAB,
//                                 ui::PAGE_TRANSITION_AUTO_TOPLEVEL, false);
//   params.should_replace_current_entry = false;
//   content::WebContents* web_contents = GetWebContentsForProfile(profile_);
//   if (web_contents) {
//       web_contents->OpenURL(params, /*navigation_handle_callback=*/{});
//   }

//   DismissMessageInternal(messages::DismissReason::PRIMARY_ACTION);
// #endif
// }

// #if BUILDFLAG(IS_ANDROID)  
// void MisesComponentLoader::OnMessageDismissed(
//   std::string guid, messages::DismissReason dismiss_reason) {    
//   LOG(INFO) << "[Mises] MisesComponentLoader::OnMessageDismissed";
                                
//   message_.reset();
// }

// void MisesComponentLoader::DismissMessageInternal(
//     messages::DismissReason dismiss_reason) {
//   if (!message_)
//     return;
//   messages::MessageDispatcherBridge::Get()->DismissMessage(message_.get(),
//                                                            dismiss_reason);

// }
// #endif

// void MisesComponentLoader::PreInstallExtensionFromWebStore(const std::string& extension_id) {
//   LOG(INFO) << "[Mises] MisesComponentLoader::PreInstallExtensionFromWebStore:" + extension_id;
// #if BUILDFLAG(IS_ANDROID)
//   // if (!message_) {
//   //   ShowPreInstallMessage(false);
//   // }
// #endif
  
  
//   pending_preinstall.insert(extension_id);

//   scoped_refptr<WebstoreInstallerForImporting> installer =
//       new WebstoreInstallerForImporting(
//           extension_id, profile_,
//           base::BindOnce(
//               &MisesComponentLoader::OnWebstoreInstallResult,
//               weak_ptr_factory_.GetWeakPtr(), extension_id));
//   installer->StartInstaller();
// }

// void MisesComponentLoader::PreInstallExtensionOnStartup() {
//   LOG(INFO) << "[Mises] MisesComponentLoader::PreInstallExtensionOnStartup";

//   ExtensionRegistry::Get(profile_)->AddObserver(this);

//   #if BUILDFLAG(IS_ANDROID)
  
//   extensions::ExtensionRegistry* registry =
//       extensions::ExtensionRegistry::Get(profile_);
  

//   std::vector<std::string> preinstalls = preferences::features::GetMisesPreinstallExtensionIds();
//   StartPreInstall(preinstalls);

//   std::vector<std::string> tos_preinstalls = preferences::features::GetMisesPreinstallExtensionWithTOSIds();
//   std::string tos = preferences::features::GetMisesPreinstallExtensionTOS();
//   bool need_display_tos = false;
//   for (size_t i = 0; i < tos_preinstalls.size(); i++) {
//     std::string extension_id = tos_preinstalls[i];
//     if (!IsIgnoredPreinstallExtension(extension_id)) {
//       const Extension* extension = registry->GetInstalledExtension(extension_id);
//       if (!extension) {
//         need_display_tos = !tos.empty();
//       }
//     }
//   }
//   if (need_display_tos) {
//       LOG(INFO) << "[Mises] MisesComponentLoader::PreInstallExtensionOnStartup show TOS";
//       chrome::android::MisesController::GetInstance()->showNotifyDialog(
//         chrome::android::MisesControllerDialogType::kTOS,
//         tos, base::BindOnce(
//           &MisesComponentLoader::OnNotificationHandled, weak_ptr_factory_.GetWeakPtr()
//         )
//       );
//   }


//   const Extension* mises_extension = registry->GetInstalledExtension(mises_extension_id);
//   if (!mises_extension) {
//     base::FilePath mises_extension_path(FILE_PATH_LITERAL(""));
//     mises_extension_path = mises_extension_path.Append(FILE_PATH_LITERAL("mises_safe"));
//     Add(IDR_MISES_SAFE_MANIFEST_JSON, mises_extension_path);
//   }
// #endif

// }

// void MisesComponentLoader::StartPreInstall(const std::vector<std::string>&  ids) {
//    extensions::ExtensionRegistry* registry =
//       extensions::ExtensionRegistry::Get(profile_);
//   for (size_t i = 0; i < ids.size(); i++) {
//     std::string extension_id = ids[i];
//     LOG(INFO) << "[Mises] MisesComponentLoader::StartPreInstall:" + extension_id;
//     if (!IsIgnoredPreinstallExtension(extension_id)) {

//       const Extension* extension = registry->GetInstalledExtension(extension_id);
//       if (!extension) {
//     #if BUILDFLAG(IS_ANDROID)
//             base::android::MisesSysUtils::LogEventFromJni("preinstall_extension", "step", "start", "id", extension_id);
//     #endif
//             base::SequencedTaskRunner::GetCurrentDefault()->PostDelayedTask(
//               FROM_HERE,
//               base::BindOnce(
//                 &MisesComponentLoader::PreInstallExtensionFromWebStore,
//                 weak_ptr_factory_.GetWeakPtr(), extension_id),
//             base::Seconds(1));
//       }
//     } else {
//       LOG(INFO) << "[Mises] MisesComponentLoader::StartPreInstall, ignor:" + extension_id;
//     }
//   }
// }
 
// void MisesComponentLoader::OnNotificationHandled(int action) {
// #if BUILDFLAG(IS_ANDROID)
//   std::vector<std::string> tos_preinstalls = preferences::features::GetMisesPreinstallExtensionWithTOSIds();
//   if (action == 0) {
//     StartPreInstall(tos_preinstalls);
//   } else {
//       for (size_t i = 0; i < tos_preinstalls.size(); i++) {
//         std::string extension_id = tos_preinstalls[i];
//         AddIgnoredPreinstallExtension(extension_id);
//       }
//   }
// #endif

// }

// void MisesComponentLoader::OnPreInstallFinished() {
//   //no more pending_preinstall, do a update check now to report extension installed
//   extensions::ExtensionService* service =
//     extensions::ExtensionSystem::Get(profile_)->extension_service();
//   if (service) {
//     ExtensionUpdater* updater = service->updater();
//     if (updater) {
//       ExtensionUpdater::CheckParams params;
//       params.fetch_priority = DownloadFetchPriority::kBackground;
//       params.install_immediately = false;
//       updater->CheckNow(std::move(params));
//     }
//   }
// #if BUILDFLAG(IS_ANDROID)
//   std::string defaultEVMExtensionID = preferences::features::GetMisesPreinstallDefaultEVMExtension();
//   std::string defaultEVMExtensionKeyProperty = preferences::features::GetMisesPreinstallDefaultEVMExtensionKeyProperty();
//   if (GetDefaultEVMWalletForBrowserContext(profile_).size() == 0) {
//     SetDefaultEVMWalletForBrowserContext(profile_,
//       defaultEVMExtensionID, defaultEVMExtensionKeyProperty);
//   }
// #endif
  
// }

}  // namespace extensions