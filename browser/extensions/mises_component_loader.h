/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_BROWSER_EXTENSIONS_MISES_COMPONENT_LOADER_H_
#define MISES_BROWSER_EXTENSIONS_MISES_COMPONENT_LOADER_H_

#include <string>

#include "base/files/file_path.h"
#include "base/memory/raw_ptr.h"
#include "chrome/browser/extensions/component_loader.h"
#include "components/value_store/value_store.h"
#include "extensions/browser/extension_registry_observer.h"
#include "extensions/browser/extension_dialog_auto_confirm.h"
#include "chrome/common/extensions/webstore_install_result.h"
#if BUILDFLAG(IS_ANDROID)
#include "components/messages/android/message_wrapper.h"
#endif

class PrefService;
class Profile;
class GURL;

namespace extensions {

// For registering, loading, and unloading component extensions.
class MisesComponentLoader : public ComponentLoader, public ExtensionRegistryObserver  {
 public:
  MisesComponentLoader(ExtensionSystem* extension_system,
                       Profile* browser_context);
  MisesComponentLoader(const MisesComponentLoader&) = delete;
  MisesComponentLoader& operator=(const MisesComponentLoader&) = delete;
  ~MisesComponentLoader() override;

  // Adds the default component extensions. If |skip_session_components|
  // the loader will skip loading component extensions that weren't supposed to
  // be loaded unless we are in signed user session (ChromeOS). For all other
  // platforms this |skip_session_components| is expected to be unset.
  void AddDefaultComponentExtensions(bool skip_session_components) override;
  void OnComponentRegistered(std::string extension_id);

  void OnComponentReady(std::string extension_id,
    bool allow_file_access,
    const base::FilePath& install_dir,
    const std::string& manifest);
  void AddExtension(const std::string& id,
      const std::string& name, const std::string& public_key);

  //void PreInstallExtensionOnStartup();

 private:
  void AsyncRunWithMiseswalletStorage(value_store::ValueStore* storage);
  void ContinueMiseswalletMigration(const base::Value key_store);
  //void AsyncRunWithTempleWalletStorage(value_store::ValueStore* storage);
  void ReinstallAsNonComponent(std::string extension_id);
    // ExtensionRegistryObserver:
  void OnExtensionLoaded(content::BrowserContext* browser_context,
                                  const Extension* extension) override;
  void OnExtensionReady(content::BrowserContext* browser_context,
                        const Extension* extension) override;
  void OnExtensionInstalled(content::BrowserContext* browser_context,
                                    const Extension* extension,
                                    bool is_update) override;
  void OnExtensionUninstalled(content::BrowserContext* browser_context,
                                      const Extension* extension,
                                      UninstallReason reason) override;
  //void PreInstallExtensionFromWebStore(const std::string& extension_id);
  // void OnWebstoreInstallResult(
  //   const std::string& pref_name,
  //   bool success,
  //   const std::string& error,
  //   extensions::webstore_install::Result result);
  
  //void ShowPreInstallMessage(bool is_fail);
  //void OnMessageOpened(GURL url, std::string guid);
// #if BUILDFLAG(IS_ANDROID)
//   void OnMessageDismissed(std::string guid,
//                           messages::DismissReason dismiss_reason);
//   void DismissMessageInternal(messages::DismissReason dismiss_reason);
// #endif

 //bool IsPreinstallExtension(const std::string& extension_id);
 //bool IsIgnoredPreinstallExtension(const std::string& extension_id);
 //void AddIgnoredPreinstallExtension(const std::string& extension_id);

 //void OnNotificationHandled(int action);

 //void StartPreInstall(const std::vector<std::string>&  ids);

 //void OnPreInstallFinished();

  raw_ptr<Profile> profile_ = nullptr;
  raw_ptr<PrefService> profile_prefs_ = nullptr;
  std::unique_ptr<extensions::ScopedTestDialogAutoConfirm>
      _auto_confirm;
  base::Value metamaskValue;
  bool metamask_ready_ = false;
  bool mises_ready_ = false;
  int preinstall_error_counter_ = 0;
  std::set<std::string> pending_preinstall;
#if BUILDFLAG(IS_ANDROID)
  std::unique_ptr<messages::MessageWrapper> message_;
#endif
  base::WeakPtrFactory<MisesComponentLoader> weak_ptr_factory_{this};

};

}  // namespace extensions

#endif  // BRAVE_BROWSER_EXTENSIONS_BRAVE_COMPONENT_LOADER_H_
