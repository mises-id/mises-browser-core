/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/extensions/api/ipfs_api.h"

#include <memory>
#include <string>
#include <utility>
#include <vector>

#include "base/files/file_util.h"
#include "base/json/json_writer.h"
#include "base/task/thread_pool.h"
#include "base/values.h"
#include "mises/browser/ipfs/ipfs_service_factory.h"
#include "mises/common/extensions/api/ipfs.h"
#include "mises/components/ipfs/ipfs_constants.h"
#include "mises/components/ipfs/ipfs_json_parser.h"
#include "mises/components/ipfs/ipfs_service.h"
#include "mises/components/ipfs/ipfs_utils.h"
#include "mises/components/ipfs/keys/ipns_keys_manager.h"
#include "mises/components/l10n/common/localization_util.h"
#include "mises/grit/mises_generated_resources.h"
#include "chrome/common/channel_info.h"
#include "components/prefs/pref_service.h"
#include "components/user_prefs/user_prefs.h"
#include "content/public/browser/browser_context.h"
#include "content/public/browser/browser_task_traits.h"
#include "content/public/browser/browser_thread.h"

using ipfs::IPFSResolveMethodTypes;

namespace {

ipfs::IpfsService* GetIpfsService(content::BrowserContext* context) {
  return ipfs::IpfsServiceFactory::GetInstance()->GetForContext(context);
}

base::Value::Dict MakeSelectValue(const std::u16string& name,
                                  IPFSResolveMethodTypes value) {
  base::Value::Dict item;
  item.Set("value", base::Value(static_cast<int>(value)));
  item.Set("name", base::Value(name));
  return item;
}

base::Value::Dict MakeValue(const std::string& name, const std::string& value) {
  base::Value::Dict item;
  item.Set("value", base::Value(value));
  item.Set("name", base::Value(name));
  return item;
}

base::Value MakeResponseFromMap(const ipfs::IpnsKeysManager::KeysMap& keys) {
  base::Value::List list;
  for (const auto& key : keys) {
    list.Append(MakeValue(key.first, key.second));
  }
  std::string json_string;
  base::JSONWriter::Write(list, &json_string);
  return base::Value(json_string);
}

base::Value MakePeersResponseFromVector(
    const std::vector<std::string>& source) {
  base::Value::List list;
  for (const auto& item : source) {
    std::string id;
    std::string address;
    if (!ipfs::ParsePeerConnectionString(item, &id, &address))
      continue;
    list.Append(MakeValue(id, address));
  }
  std::string json_string;
  base::JSONWriter::Write(list, &json_string);
  return base::Value(json_string);
}

bool WriteFileOnFileThread(const base::FilePath& path,
                           const std::string& value) {
  return base::WriteFile(path, value);
}

}  // namespace

namespace extensions {
namespace api {

ExtensionFunction::ResponseAction IpfsRemoveIpfsPeerFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context()))
    return RespondNow(Error("IPFS not enabled"));
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }
  std::optional<ipfs::RemoveIpfsPeer::Params> params(
      ipfs::RemoveIpfsPeer::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  ipfs_service->GetConfig(
      base::BindOnce(&IpfsRemoveIpfsPeerFunction::OnConfigLoaded,
                     base::RetainedRef(this), params->id, params->address));
  return RespondLater();
}

void IpfsRemoveIpfsPeerFunction::OnConfigLoaded(const std::string& peer_id,
                                                const std::string& address,
                                                bool success,
                                                const std::string& config) {
  if (!success) {
    return Respond(Error("Unable to load config"));
  }
  std::string new_config =
      IPFSJSONParser::RemovePeerFromConfigJSON(config, peer_id, address);
  if (new_config.empty()) {
    VLOG(1) << "New config is empty, probably passed incorrect values";
    return Respond(WithArguments(false));
  }
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return Respond(Error("Could not obtain IPFS service"));
  }
  auto config_path = ipfs_service->GetConfigFilePath();
  auto write_callback =
      base::BindOnce(&WriteFileOnFileThread, config_path, new_config);
  base::ThreadPool::PostTaskAndReplyWithResult(
      FROM_HERE, {base::MayBlock()}, std::move(write_callback),
      base::BindOnce(&IpfsRemoveIpfsPeerFunction::OnConfigUpdated,
                     base::RetainedRef(this)));
}

void IpfsRemoveIpfsPeerFunction::OnConfigUpdated(bool success) {
  Respond(WithArguments(success));
}

ExtensionFunction::ResponseAction IpfsAddIpfsPeerFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context()))
    return RespondNow(Error("IPFS not enabled"));
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }
  std::optional<ipfs::AddIpfsPeer::Params> params(
      ipfs::AddIpfsPeer::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  ipfs_service->GetConfig(
      base::BindOnce(&IpfsAddIpfsPeerFunction::OnConfigLoaded,
                     base::RetainedRef(this), params->value));
  return RespondLater();
}

void IpfsAddIpfsPeerFunction::OnConfigLoaded(const std::string& peer,
                                             bool success,
                                             const std::string& config) {
  if (!success) {
    return Respond(Error("Unable to load config"));
  }
  std::string new_config = IPFSJSONParser::PutNewPeerToConfigJSON(config, peer);
  if (new_config.empty()) {
    VLOG(1) << "New config is empty, probably passed incorrect values";
    return Respond(WithArguments(false));
  }
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return Respond(Error("Could not obtain IPFS service"));
  }
  auto config_path = ipfs_service->GetConfigFilePath();
  auto write_callback =
      base::BindOnce(&WriteFileOnFileThread, config_path, new_config);
  base::ThreadPool::PostTaskAndReplyWithResult(
      FROM_HERE, {base::MayBlock()}, std::move(write_callback),
      base::BindOnce(&IpfsAddIpfsPeerFunction::OnConfigUpdated,
                     base::RetainedRef(this)));
}

void IpfsAddIpfsPeerFunction::OnConfigUpdated(bool success) {
  Respond(WithArguments(success));
}

ExtensionFunction::ResponseAction IpfsGetIpfsPeersListFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context()))
    return RespondNow(Error("IPFS not enabled"));
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }
  if (!ipfs_service->IsIPFSExecutableAvailable()) {
    return RespondNow(Error("Could not obtain IPFS executable"));
  }
  ipfs_service->GetConfig(base::BindOnce(
      &IpfsGetIpfsPeersListFunction::OnConfigLoaded, base::RetainedRef(this)));
  return RespondLater();
}

void IpfsGetIpfsPeersListFunction::OnConfigLoaded(bool success,
                                                  const std::string& config) {
  if (!success) {
    return Respond(Error("Unable to load config"));
  }
  std::vector<std::string> peers;
  if (!IPFSJSONParser::GetPeersFromConfigJSON(config, &peers)) {
    VLOG(1) << "Unable to parse peers in config";
  }
  Respond(WithArguments(MakePeersResponseFromVector(peers)));
}

ExtensionFunction::ResponseAction IpfsRemoveIpnsKeyFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context()))
    return RespondNow(Error("IPFS not enabled"));
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  ::ipfs::IpnsKeysManager* key_manager = ipfs_service->GetIpnsKeysManager();
  if (!ipfs_service->IsDaemonLaunched() || !key_manager) {
    return RespondNow(Error("IPFS node is not launched"));
  }

  std::optional<ipfs::RemoveIpnsKey::Params> params(
      ipfs::RemoveIpnsKey::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  key_manager->RemoveKey(
      params->name, base::BindOnce(&IpfsRemoveIpnsKeyFunction::OnKeyRemoved,
                                   base::RetainedRef(this), key_manager));
#endif
  return did_respond() ? AlreadyResponded() : RespondLater();

}

void IpfsRemoveIpnsKeyFunction::OnKeyRemoved(::ipfs::IpnsKeysManager* manager,
                                             const std::string& name,
                                             bool success) {
  DCHECK(manager);
  if (!success) {
    return Respond(Error("Unable to remove key"));
  }
  return Respond(WithArguments(name));
}

ExtensionFunction::ResponseAction IpfsRotateKeyFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context()))
    return RespondNow(Error("IPFS not enabled"));
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  std::optional<ipfs::RotateKey::Params> params(
      ipfs::RotateKey::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  ipfs_service->RotateKey(params->name,
                          base::BindOnce(&IpfsRotateKeyFunction::OnKeyRotated,
                                         base::RetainedRef(this)));
#endif
  return did_respond() ? AlreadyResponded() : RespondLater();
}

void IpfsRotateKeyFunction::OnKeyRotated(bool success) {
  return Respond(WithArguments(success));
}

ExtensionFunction::ResponseAction IpfsAddIpnsKeyFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context()))
    return RespondNow(Error("IPFS not enabled"));
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  ::ipfs::IpnsKeysManager* key_manager = ipfs_service->GetIpnsKeysManager();
  if (!ipfs_service->IsDaemonLaunched() || !key_manager) {
    return RespondNow(Error("IPFS node is not launched"));
  }

  std::optional<ipfs::AddIpnsKey::Params> params(
      ipfs::AddIpnsKey::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  key_manager->GenerateNewKey(
      params->name, base::BindOnce(&IpfsAddIpnsKeyFunction::OnKeyCreated,
                                   base::RetainedRef(this), key_manager));
#endif
  return did_respond() ? AlreadyResponded() : RespondLater();
}

void IpfsAddIpnsKeyFunction::OnKeyCreated(::ipfs::IpnsKeysManager* manager,
                                          bool success,
                                          const std::string& name,
                                          const std::string& value) {
  DCHECK(manager);
  if (!success) {
    return Respond(Error("Unable to create key"));
  }
  std::string json_string;
  base::JSONWriter::Write(MakeValue(name, value), &json_string);
  return Respond(WithArguments(json_string));
}

ExtensionFunction::ResponseAction IpfsGetIpnsKeysListFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context()))
    return RespondNow(Error("IPFS not enabled"));
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  ::ipfs::IpnsKeysManager* key_manager = ipfs_service->GetIpnsKeysManager();
  if (!ipfs_service->IsDaemonLaunched() || !key_manager) {
    return RespondNow(Error("IPFS node is not launched"));
  }
  const auto& keys = key_manager->GetKeys();
  if (!keys.size()) {
    key_manager->LoadKeys(
        base::BindOnce(&IpfsGetIpnsKeysListFunction::OnKeysLoaded,
                       base::RetainedRef(this), key_manager));
    return RespondLater();
  }
  return RespondNow(WithArguments(MakeResponseFromMap(keys)));
#else
  return RespondNow(Error("IPFS node is not enabled"));
#endif
}

void IpfsGetIpnsKeysListFunction::OnKeysLoaded(::ipfs::IpnsKeysManager* manager,
                                               bool success) {
  DCHECK(manager);
  if (!success) {
    return Respond(Error("Unable to load keys"));
  }
  return Respond(WithArguments(MakeResponseFromMap(manager->GetKeys())));
}

ExtensionFunction::ResponseAction IpfsGetResolveMethodListFunction::Run() {
  base::Value::List list;
  list.Append(MakeSelectValue(
      brave_l10n::GetLocalizedResourceUTF16String(IDS_IPFS_RESOLVE_OPTION_ASK),
      IPFSResolveMethodTypes::IPFS_ASK));
  list.Append(MakeSelectValue(brave_l10n::GetLocalizedResourceUTF16String(
                                  IDS_IPFS_RESOLVE_OPTION_GATEWAY),
                              IPFSResolveMethodTypes::IPFS_GATEWAY));

  list.Append(MakeSelectValue(brave_l10n::GetLocalizedResourceUTF16String(
                                  IDS_IPFS_RESOLVE_OPTION_LOCAL),
                              IPFSResolveMethodTypes::IPFS_LOCAL));

  list.Append(MakeSelectValue(brave_l10n::GetLocalizedResourceUTF16String(
                                  IDS_IPFS_RESOLVE_OPTION_DISABLED),
                              IPFSResolveMethodTypes::IPFS_DISABLED));
  std::string json_string;
  base::JSONWriter::Write(list, &json_string);
  return RespondNow(WithArguments(json_string));
}

ExtensionFunction::ResponseAction IpfsGetIPFSEnabledFunction::Run() {
  bool enabled = ::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context());
  return RespondNow(WithArguments(enabled));
}

ExtensionFunction::ResponseAction IpfsGetResolveMethodTypeFunction::Run() {
  std::string value = "invalid";
  if (::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context())) {
    switch (GetIpfsService(browser_context())->GetIPFSResolveMethodType()) {
      case IPFSResolveMethodTypes::IPFS_ASK:
        value = "ask";
        break;
      case IPFSResolveMethodTypes::IPFS_GATEWAY:
        value = "gateway";
        break;
      case IPFSResolveMethodTypes::IPFS_LOCAL:
        value = "local";
        break;
      case IPFSResolveMethodTypes::IPFS_DISABLED:
        value = "disabled";
        break;
    }
  }
  return RespondNow(WithArguments(value));
}

ExtensionFunction::ResponseAction IpfsLaunchFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context())) {
    return RespondNow(Error("IPFS not enabled"));
  }

  if (!GetIpfsService(browser_context())) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }

  if (!GetIpfsService(browser_context())->IsIPFSExecutableAvailable()) {
    return RespondNow(WithArguments(false));
  }

  GetIpfsService(browser_context())
      ->LaunchDaemon(base::BindOnce(&IpfsLaunchFunction::OnLaunch,
                                    base::RetainedRef(this)));
  return did_respond() ? AlreadyResponded() : RespondLater();
}

void IpfsLaunchFunction::OnLaunch(bool launched) {
  Respond(WithArguments(launched));
}

ExtensionFunction::ResponseAction IpfsShutdownFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context())) {
    return RespondNow(Error("IPFS not enabled"));
  }
  GetIpfsService(browser_context())
      ->ShutdownDaemon(base::BindOnce(&IpfsShutdownFunction::OnShutdown,
                                      base::RetainedRef(this)));
  return did_respond() ? AlreadyResponded() : RespondLater();
}

void IpfsShutdownFunction::OnShutdown(bool shutdown) {
  Respond(WithArguments(shutdown));
}

ExtensionFunction::ResponseAction IpfsGetConfigFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context())) {
    return RespondNow(Error("IPFS not enabled"));
  }
  GetIpfsService(browser_context())
      ->GetConfig(base::BindOnce(&IpfsGetConfigFunction::OnGetConfig,
                                 base::RetainedRef(this)));
  return RespondLater();
}

void IpfsGetConfigFunction::OnGetConfig(bool success,
                                        const std::string& value) {
  Respond(WithArguments(success, value));
}

ExtensionFunction::ResponseAction IpfsGetExecutableAvailableFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context())) {
    return RespondNow(Error("IPFS not enabled"));
  }
  bool avail = GetIpfsService(browser_context())->IsIPFSExecutableAvailable();
  return RespondNow(WithArguments(avail));
}

ExtensionFunction::ResponseAction IpfsResolveIPFSURIFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context())) {
    return RespondNow(Error("IPFS not enabled"));
  }

  std::optional<ipfs::ResolveIPFSURI::Params> params(
      ipfs::ResolveIPFSURI::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);
  GURL uri(params->uri);
  GURL ipfs_gateway_url;
  PrefService* prefs = user_prefs::UserPrefs::Get(browser_context());
  if (!::ipfs::ResolveIPFSURI(prefs, chrome::GetChannel(), uri,
                              &ipfs_gateway_url) ||
      !ipfs_gateway_url.is_valid()) {
    return RespondNow(Error("Could not translate IPFS URI"));
  }

  return RespondNow(WithArguments(ipfs_gateway_url.spec()));
}

ExtensionFunction::ResponseAction IpfsValidateGatewayUrlFunction::Run() {
  if (!::ipfs::IpfsServiceFactory::IsIpfsEnabled(browser_context()))
    return RespondNow(Error("IPFS not enabled"));
  ::ipfs::IpfsService* ipfs_service = GetIpfsService(browser_context());
  if (!ipfs_service) {
    return RespondNow(Error("Could not obtain IPFS service"));
  }
  std::optional<ipfs::ValidateGatewayUrl::Params> params(
      ipfs::ValidateGatewayUrl::Params::Create(args()));
  EXTENSION_FUNCTION_VALIDATE(params);

  ipfs_service->ValidateGateway(
      GURL(params->url),
      base::BindOnce(&IpfsValidateGatewayUrlFunction::OnGatewayValidated,
                     base::RetainedRef(this)));
  return did_respond() ? AlreadyResponded() : RespondLater();
}

void IpfsValidateGatewayUrlFunction::OnGatewayValidated(bool success) {
  return Respond(WithArguments(success));
}

}  // namespace api
}  // namespace extensions
