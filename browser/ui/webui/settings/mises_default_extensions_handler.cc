/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/webui/settings/mises_default_extensions_handler.h"

#include <memory>
#include <string>

#include "base/bind.h"
#include "base/strings/utf_string_conversions.h"
#include "base/values.h"
#include "mises/browser/extensions/mises_component_loader.h"
#include "mises/components/constants/pref_names.h"
#include "mises/components/decentralized_dns/core/constants.h"
#include "mises/components/decentralized_dns/core/utils.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/components/l10n/common/localization_util.h"
#include "chrome/browser/about_flags.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/extensions/component_loader.h"
#include "chrome/browser/extensions/extension_service.h"
#include "chrome/browser/extensions/webstore_install_with_prompt.h"
#include "chrome/browser/lifetime/application_lifetime.h"
#include "chrome/browser/media/router/media_router_feature.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/ui/browser.h"
#include "chrome/browser/ui/browser_finder.h"
#include "chrome/browser/ui/browser_window.h"
#include "chrome/browser/ui/chrome_select_file_policy.h"
#include "chrome/common/chrome_switches.h"
#include "chrome/common/pref_names.h"
#include "components/flags_ui/flags_ui_constants.h"
#include "components/flags_ui/pref_service_flags_storage.h"
#include "components/grit/mises_components_strings.h"
#include "components/prefs/pref_service.h"
#include "content/public/browser/web_ui.h"
#include "extensions/browser/extension_registry.h"
#include "extensions/browser/extension_system.h"
#include "extensions/common/constants.h"
#include "extensions/common/feature_switch.h"

#if BUILDFLAG(ENABLE_IPFS)
#include "mises/browser/ipfs/ipfs_service_factory.h"
#include "mises/components/ipfs/ipfs_service.h"
#include "mises/components/ipfs/keys/ipns_keys_manager.h"
#include "mises/components/ipfs/pref_names.h"
#endif

using decentralized_dns::EnsOffchainResolveMethod;
using decentralized_dns::ResolveMethodTypes;

namespace {
 const char ipfs_companion_extension_id[] = "nibjojkomfdiaoajekhjakgkdhaomnch";


template <typename T>
base::Value::Dict MakeSelectValue(T value, const std::u16string& name) {
  base::Value::Dict item;
  item.Set("value", base::Value(static_cast<int>(value)));
  item.Set("name", base::Value(name));
  return item;
}

base::Value::List GetResolveMethodList() {
  base::Value::List list;
  list.Append(MakeSelectValue(ResolveMethodTypes::ASK,
                              brave_l10n::GetLocalizedResourceUTF16String(
                                  IDS_DECENTRALIZED_DNS_RESOLVE_OPTION_ASK)));
  list.Append(
      MakeSelectValue(ResolveMethodTypes::DISABLED,
                      brave_l10n::GetLocalizedResourceUTF16String(
                          IDS_DECENTRALIZED_DNS_RESOLVE_OPTION_DISABLED)));
  list.Append(
      MakeSelectValue(ResolveMethodTypes::ETHEREUM,
                      brave_l10n::GetLocalizedResourceUTF16String(
                          IDS_DECENTRALIZED_DNS_RESOLVE_OPTION_ETHEREUM)));

  return list;
}

base::Value::List GetEnsOffchainResolveMethodList() {
  base::Value::List list;
  list.Append(MakeSelectValue(
      EnsOffchainResolveMethod::kAsk,
      brave_l10n::GetLocalizedResourceUTF16String(
          IDS_DECENTRALIZED_DNS_ENS_OFFCHAIN_RESOLVE_OPTION_ASK)));
  list.Append(MakeSelectValue(
      EnsOffchainResolveMethod::kDisabled,
      brave_l10n::GetLocalizedResourceUTF16String(
          IDS_DECENTRALIZED_DNS_ENS_OFFCHAIN_RESOLVE_OPTION_DISABLED)));
  list.Append(MakeSelectValue(
      EnsOffchainResolveMethod::kEnabled,
      brave_l10n::GetLocalizedResourceUTF16String(
          IDS_DECENTRALIZED_DNS_ENS_OFFCHAIN_RESOLVE_OPTION_ENABLED)));

  return list;
}
}  // namespace

MisesDefaultExtensionsHandler::MisesDefaultExtensionsHandler()
    : weak_ptr_factory_(this) {
}

MisesDefaultExtensionsHandler::~MisesDefaultExtensionsHandler() = default;

void MisesDefaultExtensionsHandler::RegisterMessages() {
  profile_ = Profile::FromWebUI(web_ui());
#if BUILDFLAG(ENABLE_IPFS)
  ipfs::IpfsService* service =
      ipfs::IpfsServiceFactory::GetForContext(profile_);
  if (service) {
    ipfs_service_observer_.Observe(service);
  }
  web_ui()->RegisterMessageCallback(
      "notifyIpfsNodeStatus",
      base::BindRepeating(&MisesDefaultExtensionsHandler::CheckIpfsNodeStatus,
                          base::Unretained(this)));
  web_ui()->RegisterMessageCallback(
      "setIPFSStorageMax",
      base::BindRepeating(&MisesDefaultExtensionsHandler::SetIPFSStorageMax,
                          base::Unretained(this)));
  web_ui()->RegisterMessageCallback(
      "importIpnsKey",
      base::BindRepeating(&MisesDefaultExtensionsHandler::ImportIpnsKey,
                          base::Unretained(this)));
  web_ui()->RegisterMessageCallback(
      "launchIPFSService",
      base::BindRepeating(&MisesDefaultExtensionsHandler::LaunchIPFSService,
                          base::Unretained(this)));
  web_ui()->RegisterMessageCallback(
      "exportIPNSKey",
      base::BindRepeating(&MisesDefaultExtensionsHandler::ExportIPNSKey,
                          base::Unretained(this)));
#endif

  web_ui()->RegisterMessageCallback(
      "setIPFSCompanionEnabled",
      base::BindRepeating(
          &MisesDefaultExtensionsHandler::SetIPFSCompanionEnabled,
          base::Unretained(this)));
  // TODO(petemill): If anything outside this handler is responsible for causing
  // restart-neccessary actions, then this should be moved to a generic handler
  // and the flag should be moved to somewhere more static / singleton-like.
  web_ui()->RegisterMessageCallback(
      "getRestartNeeded",
      base::BindRepeating(&MisesDefaultExtensionsHandler::GetRestartNeeded,
                          base::Unretained(this)));

  web_ui()->RegisterMessageCallback(
      "getDecentralizedDnsResolveMethodList",
      base::BindRepeating(
          &MisesDefaultExtensionsHandler::GetDecentralizedDnsResolveMethodList,
          base::Unretained(this)));
  web_ui()->RegisterMessageCallback(
      "getEnsOffchainResolveMethodList",
      base::BindRepeating(
          &MisesDefaultExtensionsHandler::GetEnsOffchainResolveMethodList,
          base::Unretained(this)));

  // Can't call this in ctor because it needs to access web_ui().
  InitializePrefCallbacks();
}

void MisesDefaultExtensionsHandler::InitializePrefCallbacks() {

  pref_change_registrar_.Init(profile_->GetPrefs());
}

bool MisesDefaultExtensionsHandler::IsRestartNeeded() {


  return false;
}

void MisesDefaultExtensionsHandler::GetRestartNeeded(
    const base::Value::List& args) {
  CHECK_EQ(args.size(), 1U);

  AllowJavascript();
  ResolveJavascriptCallback(args[0], base::Value(IsRestartNeeded()));
}


bool MisesDefaultExtensionsHandler::IsExtensionInstalled(
    const std::string& extension_id) const {
  extensions::ExtensionRegistry* registry = extensions::ExtensionRegistry::Get(
      static_cast<content::BrowserContext*>(profile_));
  return registry && registry->GetInstalledExtension(extension_id);
}

void MisesDefaultExtensionsHandler::OnInstallResult(
    const std::string& pref_name,
    bool success,
    const std::string& error,
    extensions::webstore_install::Result result) {
  if (result != extensions::webstore_install::Result::SUCCESS &&
      result != extensions::webstore_install::Result::LAUNCH_IN_PROGRESS) {
    profile_->GetPrefs()->SetBoolean(pref_name, false);
  }
}

void MisesDefaultExtensionsHandler::OnRestartNeededChanged() {
  if (IsJavascriptAllowed()) {
    FireWebUIListener("mises-needs-restart-changed",
                      base::Value(IsRestartNeeded()));
  }
}


void MisesDefaultExtensionsHandler::ExportIPNSKey(
    const base::Value::List& args) {
  CHECK_EQ(args.size(), 1U);
  CHECK(profile_);
  std::string key_name = args[0].GetString();
  DCHECK(!key_name.empty());
  auto* web_contents = web_ui()->GetWebContents();
  select_file_dialog_ = ui::SelectFileDialog::Create(
      this, std::make_unique<ChromeSelectFilePolicy>(web_contents));
  if (!select_file_dialog_) {
    VLOG(1) << "Export already in progress";
    return;
  }
  Profile* profile =
      Profile::FromBrowserContext(web_contents->GetBrowserContext());
  const base::FilePath directory = profile->last_selected_directory();
  gfx::NativeWindow parent_window = web_contents->GetTopLevelNativeWindow();
  ui::SelectFileDialog::FileTypeInfo file_types;
  file_types.allowed_paths = ui::SelectFileDialog::FileTypeInfo::NATIVE_PATH;
  dialog_key_ = key_name;
  auto suggested_directory = directory.AppendASCII(key_name);
  dialog_type_ = ui::SelectFileDialog::SELECT_SAVEAS_FILE;
  select_file_dialog_->SelectFile(
      ui::SelectFileDialog::SELECT_SAVEAS_FILE, base::UTF8ToUTF16(key_name),
      suggested_directory, &file_types, 0, FILE_PATH_LITERAL("key"),
      parent_window, nullptr);
}

void MisesDefaultExtensionsHandler::SetIPFSCompanionEnabled(
    const base::Value::List& args) {
  CHECK_EQ(args.size(), 1U);
  CHECK(profile_);
  bool enabled = args[0].GetBool();

  extensions::ExtensionService* service =
      extensions::ExtensionSystem::Get(profile_)->extension_service();
  if (enabled) {
    if (!IsExtensionInstalled(ipfs_companion_extension_id)) {
      // Using FindLastActiveWithProfile() here will be fine. Of course, it can
      // return NULL but only return NULL when there was no activated window
      // with |profile_| so far. But, it's impossible at here because user can't
      // request ipfs install request w/o activating browser.
      scoped_refptr<extensions::WebstoreInstallWithPrompt> installer =
          new extensions::WebstoreInstallWithPrompt(
              ipfs_companion_extension_id, profile_,
              chrome::FindLastActiveWithProfile(profile_)
                  ->window()
                  ->GetNativeWindow(),
              base::BindOnce(&MisesDefaultExtensionsHandler::OnInstallResult,
                             weak_ptr_factory_.GetWeakPtr(),
                             kIPFSCompanionEnabled));
      installer->BeginInstall();
    }
    service->EnableExtension(ipfs_companion_extension_id);
  } else {
    service->DisableExtension(
        ipfs_companion_extension_id,
        extensions::disable_reason::DisableReason::DISABLE_USER_ACTION);
  }
}


void MisesDefaultExtensionsHandler::GetDecentralizedDnsResolveMethodList(
    const base::Value::List& args) {
  CHECK_EQ(args.size(), 1U);
  AllowJavascript();

  ResolveJavascriptCallback(args[0], base::Value(::GetResolveMethodList()));
}

void MisesDefaultExtensionsHandler::GetEnsOffchainResolveMethodList(
    const base::Value::List& args) {
  CHECK_EQ(args.size(), 1U);
  AllowJavascript();

  ResolveJavascriptCallback(args[0],
                            base::Value(::GetEnsOffchainResolveMethodList()));
}

#if BUILDFLAG(ENABLE_IPFS)
void MisesDefaultExtensionsHandler::LaunchIPFSService(
    const base::Value::List& args) {
  ipfs::IpfsService* service =
      ipfs::IpfsServiceFactory::GetForContext(profile_);
  if (!service) {
    return;
  }
  if (!service->IsDaemonLaunched())
    service->LaunchDaemon(base::NullCallback());
}

void MisesDefaultExtensionsHandler::SetIPFSStorageMax(
    const base::Value::List& args) {
  CHECK_EQ(args.size(), 1U);
  CHECK(args[0].is_int());
  CHECK(profile_);
  int storage_max_gb = args[0].GetInt();
  PrefService* prefs = Profile::FromWebUI(web_ui())->GetPrefs();
  prefs->SetInteger(kIpfsStorageMax, storage_max_gb);
  ipfs::IpfsService* service =
      ipfs::IpfsServiceFactory::GetForContext(profile_);
  if (!service) {
    return;
  }
  if (service->IsDaemonLaunched()) {
    service->RestartDaemon();
  }
}

void MisesDefaultExtensionsHandler::FileSelected(const base::FilePath& path,
                                                 int index,
                                                 void* params) {
  ipfs::IpfsService* service =
      ipfs::IpfsServiceFactory::GetForContext(profile_);
  if (!service)
    return;
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  if (dialog_type_ == ui::SelectFileDialog::SELECT_OPEN_FILE) {
    service->GetIpnsKeysManager()->ImportKey(
        path, dialog_key_,
        base::BindOnce(&MisesDefaultExtensionsHandler::OnKeyImported,
                       weak_ptr_factory_.GetWeakPtr()));
  } else if (dialog_type_ == ui::SelectFileDialog::SELECT_SAVEAS_FILE) {
    service->ExportKey(
        dialog_key_, path,
        base::BindOnce(&MisesDefaultExtensionsHandler::OnKeyExported,
                       weak_ptr_factory_.GetWeakPtr(), dialog_key_));
  }
#endif
  dialog_type_ = ui::SelectFileDialog::SELECT_NONE;
  select_file_dialog_.reset();
  dialog_key_.clear();
}

void MisesDefaultExtensionsHandler::OnKeyExported(const std::string& key,
                                                  bool success) {
  if (!IsJavascriptAllowed())
    return;
  FireWebUIListener("mises-ipfs-key-exported", base::Value(key),
                    base::Value(success));
}

void MisesDefaultExtensionsHandler::OnKeyImported(const std::string& key,
                                                  const std::string& value,
                                                  bool success) {
  if (!IsJavascriptAllowed())
    return;
  FireWebUIListener("mises-ipfs-key-imported", base::Value(key),
                    base::Value(value), base::Value(success));
}

void MisesDefaultExtensionsHandler::FileSelectionCanceled(void* params) {
  select_file_dialog_.reset();
  dialog_key_.clear();
}

void MisesDefaultExtensionsHandler::ImportIpnsKey(
    const base::Value::List& args) {
  CHECK_EQ(args.size(), 1U);
  CHECK(profile_);
  std::string key_name = args[0].GetString();
  auto* web_contents = web_ui()->GetWebContents();
  select_file_dialog_ = ui::SelectFileDialog::Create(
      this, std::make_unique<ChromeSelectFilePolicy>(web_contents));
  if (!select_file_dialog_) {
    VLOG(1) << "Export already in progress";
    return;
  }
  Profile* profile =
      Profile::FromBrowserContext(web_contents->GetBrowserContext());
  const base::FilePath directory = profile->last_selected_directory();
  gfx::NativeWindow parent_window = web_contents->GetTopLevelNativeWindow();
  ui::SelectFileDialog::FileTypeInfo file_types;
  file_types.allowed_paths = ui::SelectFileDialog::FileTypeInfo::NATIVE_PATH;
  dialog_key_ = key_name;
  dialog_type_ = ui::SelectFileDialog::SELECT_OPEN_FILE;
  select_file_dialog_->SelectFile(
      ui::SelectFileDialog::SELECT_OPEN_FILE, std::u16string(), directory,
      &file_types, 0, FILE_PATH_LITERAL("key"), parent_window, nullptr);
}

void MisesDefaultExtensionsHandler::CheckIpfsNodeStatus(
    const base::Value::List& args) {
  NotifyNodeStatus();
}

void MisesDefaultExtensionsHandler::NotifyNodeStatus() {
  ipfs::IpfsService* service =
      ipfs::IpfsServiceFactory::GetForContext(profile_);
  if (!IsJavascriptAllowed())
    return;
  bool launched = service && service->IsDaemonLaunched();
  FireWebUIListener("mises-ipfs-node-status-changed", base::Value(launched));
}

void MisesDefaultExtensionsHandler::OnIpfsLaunched(bool result, int64_t pid) {
  if (!IsJavascriptAllowed())
    return;
  NotifyNodeStatus();
}

void MisesDefaultExtensionsHandler::OnIpfsShutdown() {
  if (!IsJavascriptAllowed())
    return;
  NotifyNodeStatus();
}
void MisesDefaultExtensionsHandler::OnIpnsKeysLoaded(bool success) {
  if (!IsJavascriptAllowed())
    return;
  FireWebUIListener("mises-ipfs-keys-loaded", base::Value(success));
}
#endif
