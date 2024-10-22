/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_UI_WEBUI_SETTINGS_BRAVE_DEFAULT_EXTENSIONS_HANDLER_H_
#define BRAVE_BROWSER_UI_WEBUI_SETTINGS_BRAVE_DEFAULT_EXTENSIONS_HANDLER_H_

#include <string>

#include "base/memory/weak_ptr.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "chrome/browser/ui/webui/settings/settings_page_ui_handler.h"
#include "chrome/common/extensions/webstore_install_result.h"
#include "components/prefs/pref_change_registrar.h"
#include "third_party/widevine/cdm/buildflags.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/components/ipfs/ipfs_service.h"
#include "mises/components/ipfs/ipfs_service_observer.h"
#include "ui/shell_dialogs/select_file_dialog.h"
#endif

class Profile;

class MisesDefaultExtensionsHandler : public settings::SettingsPageUIHandler
#if BUILDFLAG(ENABLE_IPFS)
                                      ,ipfs::IpfsServiceObserver,
                                      public ui::SelectFileDialog::Listener
#endif
{
 public:
  MisesDefaultExtensionsHandler();
  MisesDefaultExtensionsHandler(const MisesDefaultExtensionsHandler&) = delete;
  MisesDefaultExtensionsHandler& operator=(
      const MisesDefaultExtensionsHandler&) = delete;
  ~MisesDefaultExtensionsHandler() override;

 private:
  // SettingsPageUIHandler overrides:
  void RegisterMessages() override;
  void OnJavascriptAllowed() override {}
  void OnJavascriptDisallowed() override {}

  void GetRestartNeeded(const base::Value::List& args);
  void SetIPFSCompanionEnabled(const base::Value::List& args);
  void GetDecentralizedDnsResolveMethodList(const base::Value::List& args);
  void GetEnsOffchainResolveMethodList(const base::Value::List& args);

  void InitializePrefCallbacks();

  bool IsExtensionInstalled(const std::string& extension_id) const;
  void OnInstallResult(const std::string& pref_name,
                       bool success,
                       const std::string& error,
                       extensions::webstore_install::Result result);
  void OnRestartNeededChanged();
  bool IsRestartNeeded();

#if BUILDFLAG(ENABLE_IPFS)
  void SetIPFSStorageMax(const base::Value::List& args);
  void ImportIpnsKey(const base::Value::List& args);
  void LaunchIPFSService(const base::Value::List& args);
  void ExportIPNSKey(const base::Value::List& args);

  // ui::SelectFileDialog::Listener
  void FileSelected(const ui::SelectedFileInfo& file, int indexs) override;
  void FileSelectionCanceled() override;

  void OnKeyImported(const std::string& key,
                     const std::string& value,
                     bool success);
  void OnKeyExported(const std::string& key, bool success);
  // ipfs::IpfsServiceObserver
  void OnIpfsLaunched(bool result, int64_t pid) override;
  void OnIpfsShutdown() override;
  void OnIpnsKeysLoaded(bool success) override;
  void CheckIpfsNodeStatus(const base::Value::List& args);
  void NotifyNodeStatus();

  std::string dialog_key_;
  ui::SelectFileDialog::Type dialog_type_ = ui::SelectFileDialog::SELECT_NONE;
  scoped_refptr<ui::SelectFileDialog> select_file_dialog_;
#endif

  Profile* profile_ = nullptr;
  PrefChangeRegistrar pref_change_registrar_;
#if BUILDFLAG(ENABLE_IPFS)
  base::ScopedObservation<ipfs::IpfsService, ipfs::IpfsServiceObserver>
      ipfs_service_observer_{this};
#endif
  base::WeakPtrFactory<MisesDefaultExtensionsHandler> weak_ptr_factory_;
};

#endif  // BRAVE_BROWSER_UI_WEBUI_SETTINGS_BRAVE_DEFAULT_EXTENSIONS_HANDLER_H_
