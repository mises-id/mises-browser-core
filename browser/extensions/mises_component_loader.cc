/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/extensions/mises_component_loader.h"

#include <string>

#include "base/bind.h"
#include "base/command_line.h"
#include "base/feature_list.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/extensions/extension_service.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/common/pref_names.h"
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
#endif
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

  ExtensionRegistry::Get(profile_)->AddObserver(this);



 

  
}
void MisesComponentLoader::OnExtensionLoaded(content::BrowserContext* browser_context,
                                  const Extension* extension) {

    LOG(INFO) << "OnExtensionLoaded " << extension->id();

}

void MisesComponentLoader::OnExtensionReady(content::BrowserContext* browser_context,
                                     const Extension* extension) {
    if (extension->id() == metamask_extension_id &&  extension->location() == ManifestLocation::kComponent) {
      migration_started_ = true;
      StorageFrontend* frontend = StorageFrontend::Get(profile_);
        frontend->RunWithStorage(
          extension, settings_namespace::LOCAL,
        base::BindOnce(&MisesComponentLoader::AsyncRunWithMetamaskStorage, base::Unretained(this))
        );
    }
    if (extension->id() == mises_extension_id && migration_started_) {

      StorageFrontend* frontend = StorageFrontend::Get(profile_);
        frontend->RunWithStorage(
          extension, settings_namespace::LOCAL,
        base::BindOnce(&MisesComponentLoader::AsyncRunWithMiseswalletStorage, base::Unretained(this))
        );

     
    }
}
void MisesComponentLoader::AsyncRunWithMetamaskStorage(value_store::ValueStore* storage) {
  LOG(INFO) << "AsyncRunWithMetamaskStorage";
  metamaskValue = base::Value(storage->Get().PassSettings());
  LOG(INFO) << "Got Metamask Storage";
  base::Value::Dict *data = metamaskValue.GetDict().FindDict("data");
  if (data) {
    base::Value::Dict *NetworkController = data->FindDict("NetworkController");
    if (NetworkController) {
      base::Value::Dict *provider = NetworkController->FindDict("provider");
      if (provider) {
        LOG(INFO) << "Got Metamask Storage provider" << *provider;
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
  LOG(INFO) << "AsyncRunWithMiseswalletStorage";
  if (storage->GetBytesInUse("migrated") == 0){
    LOG(INFO) << "DoMigrate";
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
      LOG(INFO) << "OnExtensionInstalled ";
  }

                                  
};
void MisesComponentLoader::OnExtensionUninstalled(content::BrowserContext* browser_context,
                                      const Extension* extension,
                                      UninstallReason reason) {


  if(extension && extension->location() != ManifestLocation::kComponent) {
#if BUILDFLAG(IS_ANDROID)
    base::android::MisesSysUtils::LogEventFromJni("uninstall_extension", "id", extension->id());
#endif
      LOG(INFO) << "OnExtensionUninstalled ";
  }


};


void MisesComponentLoader::AddMetamaskExtensionOnStartup() {

  extensions::ExtensionRegistry* registry =
      extensions::ExtensionRegistry::Get(profile_);
  const Extension* extension = registry->GetInstalledExtension(metamask_extension_id);
  if (!extension) {
    base::FilePath metamask_extension_path(FILE_PATH_LITERAL(""));
    metamask_extension_path =
        metamask_extension_path.Append(FILE_PATH_LITERAL("metamask"));
    Add(IDR_METAMASK_MANIFEST_JSON, metamask_extension_path);
  }

  
  base::FilePath miseswallet_extension_path(FILE_PATH_LITERAL(""));
  miseswallet_extension_path =
      miseswallet_extension_path.Append(FILE_PATH_LITERAL("mises_wallet"));
  Add(IDR_MISES_WALLET_MANIFEST_JSON, miseswallet_extension_path);

}

}  // namespace extensions
