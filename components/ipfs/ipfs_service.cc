/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/ipfs/ipfs_service.h"

#include <utility>

#include "base/command_line.h"
#include "base/files/file_util.h"
#include "base/hash/hash.h"
#include "base/memory/raw_ref.h"
#include "base/json/json_reader.h"
#include "base/process/launch.h"
#include "base/process/process.h"
#include "base/rand_util.h"
#include "base/strings/strcat.h"
#include "base/strings/string_util.h"
#include "base/strings/stringprintf.h"
#include "base/task/thread_pool.h"
#include "mises/base/process/process_launcher.h"
#include "mises/components/ipfs/blob_context_getter_factory.h"
#include "mises/components/ipfs/buildflags/buildflags.h"
#include "mises/components/ipfs/ipfs_constants.h"
#include "mises/components/ipfs/ipfs_json_parser.h"
#include "mises/components/ipfs/ipfs_network_utils.h"
#include "mises/components/ipfs/ipfs_ports.h"
#include "mises/components/ipfs/ipfs_service_observer.h"
#include "mises/components/ipfs/ipfs_utils.h"
#include "mises/components/ipfs/pref_names.h"
#include "mises/components/ipfs/service_sandbox_type.h"
#include "build/build_config.h"
#include "components/grit/mises_components_strings.h"
#include "components/prefs/pref_registry_simple.h"
#include "components/prefs/pref_service.h"
#include "components/user_prefs/user_prefs.h"
#include "net/base/url_util.h"
#include "net/http/http_request_headers.h"
#include "net/http/http_response_headers.h"
#include "net/http/http_status_code.h"
#include "services/network/public/cpp/shared_url_loader_factory.h"
#include "services/network/public/cpp/simple_url_loader.h"
#include "services/network/public/mojom/url_response_head.mojom.h"
#include "url/gurl.h"

#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
#include "base/threading/thread_restrictions.h"
#include "mises/components/ipfs/import/ipfs_import_worker_base.h"
#include "mises/components/ipfs/import/ipfs_link_import_worker.h"
#include "mises/components/ipfs/keys/ipns_keys_manager.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/service_process_host.h"
#include "content/public/browser/storage_partition.h"
#endif

namespace {
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
// Works similarly to base::AutoReset but checks for access from the wrong
// thread as well as ensuring that the previous value of the re-entrancy guard
// variable was false.
class ReentrancyCheck {
 public:
  explicit ReentrancyCheck(bool& guard_flag) : guard_flag_(guard_flag) {
    DCHECK_CURRENTLY_ON(content::BrowserThread::UI);
    DCHECK(!*guard_flag_);
    *guard_flag_ = true;
  }

  ~ReentrancyCheck() { *guard_flag_ = false; }

 private:
  const raw_ref<bool> guard_flag_;
};
#endif
// Used to retry request if we got zero peers from ipfs service
// Actual value will be generated randomly in range
// (kMinimalPeersRetryIntervalMs, kPeersRetryRate*kMinimalPeersRetryIntervalMs)
const int kMinimalPeersRetryIntervalMs = 350;
const int kPeersRetryRate = 3;

const char kGatewayValidationCID[] = "bafkqae2xmvwgg33nmuqhi3zajfiemuzahiwss";
const char kGatewayValidationResult[] = "Welcome to IPFS :-)";

std::pair<bool, std::string> LoadConfigFileOnFileTaskRunner(
    const base::FilePath& path) {
  std::string data;
  bool success = base::ReadFileToString(path, &data);
  std::pair<bool, std::string> result;
  result.first = success;
  if (success) {
    result.second = data;
  }
  return result;
}

base::flat_map<std::string, std::string> GetHeaders(const GURL& url) {
  return {
      {net::HttpRequestHeaders::kOrigin, url::Origin::Create(url).Serialize()}};
}

}  // namespace

namespace ipfs {

IpfsService::IpfsService(
    PrefService* prefs,
    scoped_refptr<network::SharedURLLoaderFactory> url_loader_factory,
    BlobContextGetterFactoryPtr blob_context_getter_factory,
    ipfs::MisesIpfsClientUpdater* ipfs_client_updater,
    const base::FilePath& user_data_dir,
    version_info::Channel channel,
    std::unique_ptr<ipfs::IpfsDnsResolver> ipfs_dns_resover)
    : prefs_(prefs),
      url_loader_factory_(url_loader_factory),
      blob_context_getter_factory_(std::move(blob_context_getter_factory)),
      server_endpoint_(GetAPIServer(channel)),
      user_data_dir_(user_data_dir),
      ipfs_client_updater_(ipfs_client_updater),
      channel_(channel),
      ipfs_dns_resolver_(std::move(ipfs_dns_resover)),
      file_task_runner_(base::ThreadPool::CreateSequencedTaskRunner(
          {base::MayBlock(), base::TaskPriority::BEST_EFFORT,
           base::TaskShutdownBehavior::BLOCK_SHUTDOWN})),
      ipfs_p3a_(this, prefs),
      weak_factory_(this) {
  DCHECK(!user_data_dir.empty());

  // Return early since g_mises_browser_process and ipfs_client_updater are not
  // available in unit tests.
  if (ipfs_client_updater_) {
    ipfs_client_updater_->AddObserver(this);
    OnExecutableReady(ipfs_client_updater_->GetExecutablePath());
  }
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  ipns_keys_manager_ = std::make_unique<IpnsKeysManager>(
      blob_context_getter_factory_.get(), url_loader_factory, server_endpoint_);
  AddObserver(ipns_keys_manager_.get());
#endif

  ipfs_dns_resolver_subscription_ =
      ipfs_dns_resolver_->AddObserver(base::BindRepeating(
          &IpfsService::OnDnsConfigChanged, base::Unretained(this)));
}

IpfsService::~IpfsService() {
  if (ipfs_client_updater_) {
    ipfs_client_updater_->RemoveObserver(this);
  }
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  RemoveObserver(ipns_keys_manager_.get());
#endif
  Shutdown();
}

// static
void IpfsService::RegisterProfilePrefs(PrefRegistrySimple* registry) {
  registry->RegisterBooleanPref(kIPFSEnabled, true);
  registry->RegisterIntegerPref(
      kIPFSResolveMethod,
      static_cast<int>(ipfs::IPFSResolveMethodTypes::IPFS_GATEWAY));
  registry->RegisterBooleanPref(kIPFSAutoFallbackToGateway, false);
  registry->RegisterBooleanPref(kIPFSAutoRedirectGateway, false);
  registry->RegisterBooleanPref(kIPFSAutoRedirectDNSLink, false);
  registry->RegisterBooleanPref(kIPFSLocalNodeUsed, false);
  registry->RegisterIntegerPref(kIPFSInfobarCount, 0);
  registry->RegisterIntegerPref(kIpfsStorageMax, 1);
  registry->RegisterStringPref(kIPFSPublicGatewayAddress, kDefaultIPFSGateway);
  registry->RegisterStringPref(kIPFSPublicNFTGatewayAddress,
                               kDefaultIPFSNFTGateway);
  registry->RegisterFilePathPref(kIPFSBinaryPath, base::FilePath());
  registry->RegisterDictionaryPref(kIPFSPinnedCids);
}

base::FilePath IpfsService::GetIpfsExecutablePath() const {
  return prefs_->GetFilePath(kIPFSBinaryPath);
}

void IpfsService::OnInstallationEvent(ComponentUpdaterEvents event) {
  for (auto& observer : observers_) {
    observer.OnInstallationEvent(event);
  }
}

void IpfsService::OnExecutableReady(const base::FilePath& path) {
  if (path.empty())
    return;

  prefs_->SetFilePath(kIPFSBinaryPath, path);

  LaunchIfNotRunning(path);
}

std::string IpfsService::GetStorageSize() {
  return std::to_string(prefs_->GetInteger(kIpfsStorageMax)) + "GB";
}

void IpfsService::LaunchIfNotRunning(const base::FilePath& executable_path) {
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  if (ipfs_service_.is_bound())
    return;

  content::ServiceProcessHost::Launch(
      ipfs_service_.BindNewPipeAndPassReceiver(),
      content::ServiceProcessHost::Options()
          .WithDisplayName(IDS_UTILITY_PROCESS_IPFS_NAME)
          .Pass());

  ipfs_service_.set_disconnect_handler(
      base::BindOnce(&IpfsService::OnIpfsCrashed, base::Unretained(this)));
  ipfs_service_->SetCrashHandler(base::BindOnce(
      &IpfsService::OnIpfsDaemonCrashed, base::Unretained(this)));

  auto config = mojom::IpfsConfig::New(
      executable_path, GetConfigFilePath(), GetDataPath(),
      GetGatewayPort(channel_), GetAPIPort(channel_), GetSwarmPort(channel_),
      GetStorageSize(), ipfs_dns_resolver_->GetFirstDnsOverHttpsServer());

  ipfs_service_->Launch(
      std::move(config),
      base::BindOnce(&IpfsService::OnIpfsLaunched, base::Unretained(this)));
#endif
}

void IpfsService::RestartDaemon() {
  if (!IsDaemonLaunched())
    return;
  auto launch_callback =
      base::BindOnce(&IpfsService::LaunchDaemon, base::Unretained(this));
  ShutdownDaemon(base::BindOnce(
      [](base::OnceCallback<void(BoolCallback)> launch_callback,
         const bool success) {
        if (!success) {
          VLOG(1) << "Unable to shutdown daemon";
          return;
        }
        if (launch_callback) {
          std::move(launch_callback).Run(base::NullCallback());
        }
      },
      std::move(launch_callback)));
}

void IpfsService::OnIpfsCrashed() {
  VLOG(0) << "IPFS utility process crashed";
  Shutdown();
}

void IpfsService::OnIpfsDaemonCrashed(int64_t pid) {
  VLOG(0) << "IPFS daemon crashed";
  Shutdown();
}

base::FilePath IpfsService::GetDataPath() const {
  return user_data_dir_.Append(FILE_PATH_LITERAL("brave_ipfs"));
}

base::FilePath IpfsService::GetConfigFilePath() const {
  base::FilePath config_path =
      GetDataPath().Append(FILE_PATH_LITERAL("config"));
  return config_path;
}

void IpfsService::NotifyDaemonLaunched(bool result, int64_t pid) {
  bool success = result && pid > 0;
#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
  if (success && ipns_keys_manager_) {
    ipns_keys_manager_->LoadKeys(base::BindOnce(
        &IpfsService::NotifyIpnsKeysLoaded, weak_factory_.GetWeakPtr()));
  }
#endif
  while (!pending_launch_callbacks_.empty()) {
    if (pending_launch_callbacks_.front())
      std::move(pending_launch_callbacks_.front()).Run(success);
    pending_launch_callbacks_.pop();
  }
  for (auto& observer : observers_) {
    observer.OnIpfsLaunched(result, pid);
  }
}

void IpfsService::OnIpfsLaunched(bool result, int64_t pid) {
  if (result) {
    ipfs_pid_ = pid;
  } else {
    VLOG(0) << "Failed to launch IPFS";
    Shutdown();
  }
  RegisterIpfsClientUpdater();
  NotifyDaemonLaunched(result, pid);
}

void IpfsService::Shutdown() {
  if (ipfs_service_.is_bound()) {
    ipfs_service_->Shutdown();
  }
  ipfs_service_.reset();
  ipfs_pid_ = -1;
}

void IpfsService::OnDnsConfigChanged(std::optional<std::string> dns_server) {
  RestartDaemon();
}

#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
// static
std::optional<std::string> IpfsService::WaitUntilExecutionFinished(
    base::FilePath data_path,
    base::CommandLine command_line) {
  base::LaunchOptions options;
#if BUILDFLAG(IS_WIN)
  options.environment[L"IPFS_PATH"] = data_path.value();
#else
  options.environment["IPFS_PATH"] = data_path.value();
#endif

#if BUILDFLAG(IS_LINUX)
  options.kill_on_parent_death = true;
#endif
#if BUILDFLAG(IS_WIN)
  options.start_hidden = true;
#endif
  return mises::ProcessLauncher::ReadAppOutput(command_line, options, 10);
}
void IpfsService::RotateKey(const std::string& oldkey, BoolCallback callback) {
  auto executable_path = GetIpfsExecutablePath();
  if (IsDaemonLaunched() || executable_path.empty()) {
    if (callback)
      std::move(callback).Run(false);
    return;
  }
  base::CommandLine cmdline(executable_path);
  cmdline.AppendArg("key");
  cmdline.AppendArg("rotate");
  cmdline.AppendArg("--oldkey=" + oldkey);
  ExecuteNodeCommand(
      cmdline, GetDataPath(),
      base::BindOnce(
          [](BoolCallback callback, std::optional<std::string> result) {
            std::move(callback).Run(result.has_value());
          },
          std::move(callback)));
}

void IpfsService::ExportKey(const std::string& key,
                            const base::FilePath& target_path,
                            BoolCallback callback) {
  base::FilePath path = GetIpfsExecutablePath();
  if (path.empty())
    return;

  base::CommandLine cmdline(path);
  cmdline.AppendArg("key");
  cmdline.AppendArg("export");
  cmdline.AppendArg("-o=" + target_path.MaybeAsASCII());
  cmdline.AppendArg(key);
  ExecuteNodeCommand(
      cmdline, GetDataPath(),
      base::BindOnce(
          [](BoolCallback callback, std::optional<std::string> result) {
            std::move(callback).Run(result.has_value());
          },
          std::move(callback)));
}
void IpfsService::ExecuteNodeCommand(const base::CommandLine& command_line,
                                     const base::FilePath& data,
                                     NodeCallback callback) {
  base::ThreadPool::PostTaskAndReplyWithResult(
    FROM_HERE,
    {base::MayBlock(), base::TaskShutdownBehavior::CONTINUE_ON_SHUTDOWN,
      base::TaskPriority::BEST_EFFORT},
    base::BindOnce(&IpfsService::WaitUntilExecutionFinished, GetDataPath(),
                    command_line),
    std::move(callback));
}

void IpfsService::NotifyIpnsKeysLoaded(bool result) {
  for (auto& observer : observers_) {
    observer.OnIpnsKeysLoaded(result);
  }
}


// Local pinning
void IpfsService::AddPin(const std::vector<std::string>& cids,
                         bool recursive,
                         AddPinCallback callback) {
  if (!IsDaemonLaunched()) {
    std::move(callback).Run(std::nullopt);
    return;
  }

  if (cids.empty()) {
    AddPinResult result;
    result.recursive = recursive;
    std::move(callback).Run(result);
    return;
  }

  GURL gurl = server_endpoint_.Resolve(kAddPinPath);
  for (const auto& cid : cids) {
    gurl = net::AppendQueryParameter(gurl, kArgQueryParam, cid);
  }
  gurl = net::AppendQueryParameter(gurl, "recursive",
                                   recursive ? "true" : "false");

  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);
  auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));

  iter->get()->Request(
      "POST", gurl, std::string(), std::string(),
      base::BindOnce(&IpfsService::OnPinAddResult, base::Unretained(this),
                     cids.size(), recursive, iter, std::move(callback)),
      api_request_helper::APIRequestOptions{.timeout = base::Minutes(2)},
      GetHeaders(gurl));
}

void IpfsService::RemovePin(const std::vector<std::string>& cids,
                            RemovePinCallback callback) {
  if (!IsDaemonLaunched()) {
    std::move(callback).Run(std::nullopt);
    return;
  }

  GURL gurl = server_endpoint_.Resolve(kRemovePinPath);
  for (const auto& cid : cids) {
    gurl = net::AppendQueryParameter(gurl, kArgQueryParam, cid);
  }

  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);
  auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));

  iter->get()->Request(
      "POST", gurl, std::string(), std::string(), false,
      base::BindOnce(&IpfsService::OnPinRemoveResult, base::Unretained(this),
                     iter, std::move(callback)),
      GetHeaders(gurl));
}

void IpfsService::RemovePinCli(std::set<std::string> cids,
                               BoolCallback callback) {
  if (cids.empty()) {
    std::move(callback).Run(true);
    return;
  }

  base::FilePath path = GetIpfsExecutablePath();
  if (path.empty()) {
    std::move(callback).Run(false);
    return;
  }

  auto cid = *(cids.begin());

  if (!IsValidCID(cid)) {
    std::move(callback).Run(false);
    return;
  }

  base::CommandLine cmdline(path);
  cmdline.AppendArg("pin");
  cmdline.AppendArg("rm");
  cmdline.AppendArg("-r=true");

  cmdline.AppendArg(cid);
  ExecuteNodeCommand(
      cmdline, GetDataPath(),
      base::BindOnce(&IpfsService::OnRemovePinCli, weak_factory_.GetWeakPtr(),
                     std::move(callback), std::move(cids)));
}

void IpfsService::LsPinCli(NodeCallback callback) {
  base::FilePath path = GetIpfsExecutablePath();
  if (path.empty()) {
    std::move(callback).Run(std::nullopt);
    return;
  }

  base::CommandLine cmdline(path);
  cmdline.AppendArg("pin");
  cmdline.AppendArg("ls");
  cmdline.AppendArg("--type=recursive");
  cmdline.AppendArg("--quiet=true");

  ExecuteNodeCommand(cmdline, GetDataPath(), std::move(callback));
}

void IpfsService::OnRemovePinCli(BoolCallback callback,
                                 std::set<std::string> cids,
                                 std::optional<std::string> result) {
  DCHECK(!cids.empty());
  if (!result || cids.empty()) {
    std::move(callback).Run(false);
    return;
  }

  cids.erase(cids.begin());

  if (cids.empty()) {
    std::move(callback).Run(true);
  } else {
    RemovePinCli(cids, std::move(callback));
  }
}

void IpfsService::GetPins(const std::optional<std::vector<std::string>>& cids,
                          const std::string& type,
                          bool quiet,
                          GetPinsCallback callback) {
  if (!IsDaemonLaunched()) {
    std::move(callback).Run(std::nullopt);
    return;
  }

  GURL gurl = server_endpoint_.Resolve(kGetPinsPath);
  if (cids) {
    for (const auto& cid : cids.value()) {
      gurl = net::AppendQueryParameter(gurl, kArgQueryParam, cid);
    }
  }
  gurl = net::AppendQueryParameter(gurl, "type", type);
  gurl = net::AppendQueryParameter(gurl, "quiet", quiet ? "true" : "false");

  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);
  auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));
  iter->get()->Request(
      "POST", gurl, std::string(), std::string(), false,
      base::BindOnce(&IpfsService::OnGetPinsResult, base::Unretained(this),
                     iter, std::move(callback)),
      GetHeaders(gurl));
}

void IpfsService::ImportFileToIpfs(const base::FilePath& path,
                                   const std::string& key,
                                   ipfs::ImportCompletedCallback callback) {
  if (path.empty()) {
    if (callback)
      std::move(callback).Run(ipfs::ImportedData());
    return;
  }
  ReentrancyCheck reentrancy_check(reentrancy_guard_);
  if (!IsDaemonLaunched()) {
    StartDaemonAndLaunch(base::BindOnce(&IpfsService::ImportFileToIpfs,
                                        weak_factory_.GetWeakPtr(), path, key,
                                        std::move(callback)));
    return;
  }
  size_t hash = base::FastHash(base::as_bytes(base::make_span(path.value())));
  if (importers_.count(hash))
    return;

  auto import_completed_callback =
      base::BindOnce(&IpfsService::OnImportFinished, weak_factory_.GetWeakPtr(),
                     std::move(callback), hash);
  importers_[hash] = std::make_unique<IpfsImportWorkerBase>(
      blob_context_getter_factory_.get(), url_loader_factory_.get(),
      server_endpoint_, std::move(import_completed_callback), key);
  importers_[hash]->ImportFile(path);
}

void IpfsService::ImportLinkToIpfs(const GURL& url,
                                   ipfs::ImportCompletedCallback callback) {
  if (!url.is_valid()) {
    if (callback)
      std::move(callback).Run(ipfs::ImportedData());
    return;
  }

  ReentrancyCheck reentrancy_check(reentrancy_guard_);
  if (!IsDaemonLaunched()) {
    StartDaemonAndLaunch(base::BindOnce(&IpfsService::ImportLinkToIpfs,
                                        weak_factory_.GetWeakPtr(), url,
                                        std::move(callback)));
    return;
  }
  size_t hash = base::FastHash(base::as_bytes(base::make_span(url.spec())));
  if (importers_.count(hash))
    return;

  auto import_completed_callback =
      base::BindOnce(&IpfsService::OnImportFinished, weak_factory_.GetWeakPtr(),
                     std::move(callback), hash);
  importers_[hash] = std::make_unique<IpfsLinkImportWorker>(
      blob_context_getter_factory_.get(), url_loader_factory_.get(),
      server_endpoint_, std::move(import_completed_callback), url);
}

void IpfsService::ImportDirectoryToIpfs(const base::FilePath& folder,
                                        const std::string& key,
                                        ImportCompletedCallback callback) {
  if (folder.empty()) {
    if (callback)
      std::move(callback).Run(ipfs::ImportedData());
    return;
  }
  ReentrancyCheck reentrancy_check(reentrancy_guard_);
  if (!IsDaemonLaunched()) {
    StartDaemonAndLaunch(base::BindOnce(&IpfsService::ImportDirectoryToIpfs,
                                        weak_factory_.GetWeakPtr(), folder, key,
                                        std::move(callback)));
    return;
  }
  size_t hash =
      base::FastHash(base::as_bytes(base::make_span(folder.MaybeAsASCII())));
  if (importers_.count(hash))
    return;
  auto import_completed_callback =
      base::BindOnce(&IpfsService::OnImportFinished, weak_factory_.GetWeakPtr(),
                     std::move(callback), hash);
  importers_[hash] = std::make_unique<IpfsImportWorkerBase>(
      blob_context_getter_factory_.get(), url_loader_factory_.get(),
      server_endpoint_, std::move(import_completed_callback), key);
  importers_[hash]->ImportFolder(folder);
}

void IpfsService::ImportTextToIpfs(const std::string& text,
                                   const std::string& host,
                                   ipfs::ImportCompletedCallback callback) {
  if (text.empty()) {
    if (callback)
      std::move(callback).Run(ipfs::ImportedData());
    return;
  }
  ReentrancyCheck reentrancy_check(reentrancy_guard_);
  if (!IsDaemonLaunched()) {
    StartDaemonAndLaunch(base::BindOnce(&IpfsService::ImportTextToIpfs,
                                        weak_factory_.GetWeakPtr(), text, host,
                                        std::move(callback)));
    return;
  }
  size_t hash = base::FastHash(base::as_bytes(base::make_span(text)));
  if (importers_.count(hash))
    return;
  auto import_completed_callback =
      base::BindOnce(&IpfsService::OnImportFinished, weak_factory_.GetWeakPtr(),
                     std::move(callback), hash);
  importers_[hash] = std::make_unique<IpfsImportWorkerBase>(
      blob_context_getter_factory_.get(), url_loader_factory_.get(),
      server_endpoint_, std::move(import_completed_callback));

  importers_[hash]->ImportText(text, host);
}

void IpfsService::OnImportFinished(ipfs::ImportCompletedCallback callback,
                                   size_t key,
                                   const ipfs::ImportedData& data) {
  if (callback)
    std::move(callback).Run(data);

  importers_.erase(key);
}
#endif
void IpfsService::GetConnectedPeers(GetConnectedPeersCallback callback,
                                    std::optional<int> retries) {
  if (!IsDaemonLaunched()) {
    if (callback)
      std::move(callback).Run(false, std::vector<std::string>{});
    return;
  }

  if (skip_get_connected_peers_callback_for_test_) {
    // Early return for tests that wish to  manually run the callback with
    // desired values directly, could be useful in unit tests.
    connected_peers_function_called_ = true;
    return;
  }
  auto gurl = server_endpoint_.Resolve(kSwarmPeersPath);
  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);

 auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));
  iter->get()->Request(
      "POST", gurl, std::string(), std::string(), false,
      base::BindOnce(&IpfsService::OnGetConnectedPeers, base::Unretained(this),
                     iter, std::move(callback),
                     retries.value_or(kPeersDefaultRetries)),
      GetHeaders(gurl));
}

base::TimeDelta IpfsService::CalculatePeersRetryTime() {
  if (zero_peer_time_for_test_)
    return base::TimeDelta();
  return base::Milliseconds(
      base::RandInt(kMinimalPeersRetryIntervalMs,
                    kPeersRetryRate * kMinimalPeersRetryIntervalMs));
}

void IpfsService::OnGetConnectedPeers(
    APIRequestList::iterator iter,
    GetConnectedPeersCallback callback,
    int retry_number,
    api_request_helper::APIRequestResult response) {
  int response_code = response.response_code();
  requests_list_.erase(iter);

  bool success = response.Is2XXResponseCode();
  last_peers_retry_value_for_test_ = retry_number;
  if (response.error_code() == net::ERR_CONNECTION_REFUSED && retry_number) {
    base::SequencedTaskRunner::GetCurrentDefault()->PostDelayedTask(
        FROM_HERE,
        base::BindOnce(&IpfsService::GetConnectedPeers,
                       weak_factory_.GetWeakPtr(), std::move(callback),
                       retry_number - 1),
        CalculatePeersRetryTime());
    return;
  }

  std::vector<std::string> peers;
  if (!success) {
    VLOG(1) << "Fail to get connected peers, response_code = " << response_code;
  }

  if (success)
    success = IPFSJSONParser::GetPeersFromJSON(response.body(), &peers);

  if (callback)
    std::move(callback).Run(success, peers);

  for (auto& observer : observers_) {
    observer.OnGetConnectedPeers(success, peers);
  }
}

void IpfsService::GetAddressesConfig(GetAddressesConfigCallback callback) {
  if (!IsDaemonLaunched()) {
    std::move(callback).Run(false, AddressesConfig());
    return;
  }

  GURL gurl = net::AppendQueryParameter(server_endpoint_.Resolve(kConfigPath),
                                        kArgQueryParam, kAddressesField);

  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);

  auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));
  iter->get()->Request(
      "POST", gurl, std::string(), std::string(), false,
      base::BindOnce(&IpfsService::OnGetAddressesConfig, base::Unretained(this),
                     iter, std::move(callback)),
      {{net::HttpRequestHeaders::kOrigin,
        url::Origin::Create(gurl).Serialize()}});
}

void IpfsService::OnGetAddressesConfig(
    APIRequestList::iterator iter,
    GetAddressesConfigCallback callback,
    api_request_helper::APIRequestResult response) {
  int response_code = response.response_code();
  bool success = response.Is2XXResponseCode();
  requests_list_.erase(iter);

  ipfs::AddressesConfig addresses_config;
  if (!success) {
    VLOG(1) << "Fail to get addresses config, response_code = "
            << response_code;
    std::move(callback).Run(false, addresses_config);
    return;
  }

  success = IPFSJSONParser::GetAddressesConfigFromJSON(response.body(),
                                                       &addresses_config);
  std::move(callback).Run(success, addresses_config);
}

bool IpfsService::IsDaemonLaunched() const {
  if (allow_ipfs_launch_for_test_) {
    return true;
  }
  return ipfs_pid_ > 0;
}

void IpfsService::StartDaemonAndLaunch(
    base::OnceCallback<void(void)> success_callback) {
  if (IsDaemonLaunched()) {
    std::move(success_callback).Run();
    return;
  }
  LaunchDaemon(base::BindOnce(
      [](base::OnceCallback<void(void)> launched_callback, bool success) {
        if (!success)
          return;
        if (launched_callback)
          std::move(launched_callback).Run();
      },
      std::move(success_callback)));
}

void IpfsService::LaunchDaemon(BoolCallback callback) {
  if (IsDaemonLaunched()) {
    if (callback)
      std::move(callback).Run(true);
    return;
  }

  // Wait if previous launch request in progress.
  if (!pending_launch_callbacks_.empty()) {
    if (callback)
      pending_launch_callbacks_.push(std::move(callback));
    return;
  }
  if (callback)
    pending_launch_callbacks_.push(std::move(callback));
  base::FilePath path(GetIpfsExecutablePath());
  if (path.empty()) {
    // Daemon will be launched later in OnExecutableReady.
    RegisterIpfsClientUpdater();
  } else {
    LaunchIfNotRunning(path);
  }
}

void IpfsService::ShutdownDaemon(BoolCallback callback) {
  if (IsDaemonLaunched()) {
    Shutdown();
  }

  for (auto& observer : observers_) {
    observer.OnIpfsShutdown();
  }

  if (callback)
    std::move(callback).Run(!IsDaemonLaunched());
}

void IpfsService::GetConfig(GetConfigCallback callback) {
  file_task_runner_->PostTaskAndReplyWithResult(
      FROM_HERE,
      base::BindOnce(&LoadConfigFileOnFileTaskRunner, GetConfigFilePath()),
      base::BindOnce(&IpfsService::OnConfigLoaded, weak_factory_.GetWeakPtr(),
                     std::move(callback)));
}

void IpfsService::OnConfigLoaded(GetConfigCallback callback,
                                 const std::pair<bool, std::string>& result) {
  if (callback)
    std::move(callback).Run(result.first, result.second);
}

bool IpfsService::IsIPFSExecutableAvailable() const {
  return !GetIpfsExecutablePath().empty();
}

void IpfsService::AddObserver(IpfsServiceObserver* observer) {
  observers_.AddObserver(observer);
}

void IpfsService::RemoveObserver(IpfsServiceObserver* observer) {
  observers_.RemoveObserver(observer);
}

void IpfsService::RegisterIpfsClientUpdater() {
  if (ipfs_client_updater_) {
    ipfs_client_updater_->Register();
  }
}

int IpfsService::GetLastPeersRetryForTest() const {
  return last_peers_retry_value_for_test_;
}

void IpfsService::SetZeroPeersDeltaForTest(bool value) {
  zero_peer_time_for_test_ = value;
}

void IpfsService::SetAllowIpfsLaunchForTest(bool launched) {
  allow_ipfs_launch_for_test_ = launched;
}

void IpfsService::SetServerEndpointForTest(const GURL& gurl) {
  server_endpoint_ = gurl;
}

void IpfsService::RunLaunchDaemonCallbackForTest(bool result) {
  NotifyDaemonLaunched(result, 1);
}

void IpfsService::SetSkipGetConnectedPeersCallbackForTest(bool skip) {
  skip_get_connected_peers_callback_for_test_ = skip;
}

void IpfsService::SetGetConnectedPeersCalledForTest(bool value) {
  connected_peers_function_called_ = value;
}

bool IpfsService::WasConnectedPeersCalledForTest() const {
  return connected_peers_function_called_;
}

IPFSResolveMethodTypes IpfsService::GetIPFSResolveMethodType() const {
  return static_cast<IPFSResolveMethodTypes>(
      prefs_->GetInteger(kIPFSResolveMethod));
}

void IpfsService::GetRepoStats(GetRepoStatsCallback callback) {
  if (!IsDaemonLaunched()) {
    std::move(callback).Run(false, RepoStats());
    return;
  }

  GURL gurl =
      net::AppendQueryParameter(server_endpoint_.Resolve(ipfs::kRepoStatsPath),
                                ipfs::kRepoStatsHumanReadableParamName,
                                ipfs::kRepoStatsHumanReadableParamValue);
  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);

  auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));
  iter->get()->Request(
      "POST", gurl, std::string(), std::string(), false,
      base::BindOnce(&IpfsService::OnRepoStats, base::Unretained(this), iter,
                     std::move(callback)),
      {{net::HttpRequestHeaders::kOrigin,
        url::Origin::Create(gurl).Serialize()}});
}

void IpfsService::OnRepoStats(APIRequestList::iterator iter,
                              GetRepoStatsCallback callback,
                              api_request_helper::APIRequestResult response) {
  int response_code = response.response_code();
  requests_list_.erase(iter);

  bool success = response.Is2XXResponseCode();

  ipfs::RepoStats repo_stats;
  if (!success) {
    VLOG(1) << "Fail to get repro stats, response_code = " << response_code;
    std::move(callback).Run(false, repo_stats);
    return;
  }

  success = IPFSJSONParser::GetRepoStatsFromJSON(response.body(), &repo_stats);
  std::move(callback).Run(success, repo_stats);
}

void IpfsService::GetNodeInfo(GetNodeInfoCallback callback) {
  if (!IsDaemonLaunched()) {
    std::move(callback).Run(false, NodeInfo());
    return;
  }

  GURL gurl = server_endpoint_.Resolve(ipfs::kNodeInfoPath);

  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);

  auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));
  iter->get()->Request(
      "POST", gurl, std::string(), std::string(), false,
      base::BindOnce(&IpfsService::OnNodeInfo, base::Unretained(this), iter,
                     std::move(callback)),
      {{net::HttpRequestHeaders::kOrigin,
        url::Origin::Create(gurl).Serialize()}});
}

void IpfsService::OnNodeInfo(APIRequestList::iterator iter,
                             GetNodeInfoCallback callback,
                             api_request_helper::APIRequestResult response) {
  int response_code = response.response_code();
  requests_list_.erase(iter);

  bool success = response.Is2XXResponseCode();

  ipfs::NodeInfo node_info;
  if (!success) {
    VLOG(1) << "Fail to get node info, response_code = " << response_code;
    std::move(callback).Run(false, node_info);
    return;
  }

  success = IPFSJSONParser::GetNodeInfoFromJSON(response.body(), &node_info);
  std::move(callback).Run(success, node_info);
}

void IpfsService::RunGarbageCollection(GarbageCollectionCallback callback) {
  if (!IsDaemonLaunched()) {
    std::move(callback).Run(false, std::string());
    return;
  }

  GURL gurl = server_endpoint_.Resolve(ipfs::kGarbageCollectionPath);

  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);

  auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));
  iter->get()->Request(
      "POST", gurl, std::string(), std::string(), false,
      base::BindOnce(&IpfsService::OnGarbageCollection, base::Unretained(this),
                     iter, std::move(callback)),
      {{net::HttpRequestHeaders::kOrigin,
        url::Origin::Create(gurl).Serialize()}});
}

void IpfsService::OnGarbageCollection(
    APIRequestList::iterator iter,
    GarbageCollectionCallback callback,
    api_request_helper::APIRequestResult response) {
  int response_code = response.response_code();
  requests_list_.erase(iter);

  bool success = response.Is2XXResponseCode();
  if (!success) {
    VLOG(1) << "Fail to run garbage collection, response_code = "
            << response_code;
  }

  std::string error;
  if (success) {
    const std::string& body = response.body();
    if (!body.empty())
      IPFSJSONParser::GetGarbageCollectionFromJSON(body, &error);
  }
  std::move(callback).Run(success && error.empty(), error);
}

void IpfsService::PreWarmShareableLink(const GURL& url) {
  auto url_loader = std::make_unique<api_request_helper::APIRequestHelper>(
      GetIpfsNetworkTrafficAnnotationTag(), url_loader_factory_);

  auto iter =
      requests_list_.insert(requests_list_.begin(), std::move(url_loader));
  iter->get()->Request("HEAD", url, std::string(), std::string(), false,
                       base::BindOnce(&IpfsService::OnPreWarmComplete,
                                      base::Unretained(this), iter),
                       {{net::HttpRequestHeaders::kOrigin,
                         url::Origin::Create(url).Serialize()}});
}

void IpfsService::OnPreWarmComplete(
    APIRequestList::iterator iter,
    api_request_helper::APIRequestResult response) {
  requests_list_.erase(iter);
  if (prewarm_callback_for_testing_)
    std::move(prewarm_callback_for_testing_).Run();
}


#if BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)
//{
//  "PinLsList": {
//    "Keys": {
//      "<string>": {
//        "Type": "<string>"
//      }
//    }
//  },
//  "PinLsObject": {
//    "Cid": "<string>",
//    "Type": "<string>"
//  }
//}
void IpfsService::OnGetPinsResult(
    APIRequestList::iterator iter,
    GetPinsCallback callback,
    api_request_helper::APIRequestResult response) {
  int response_code = response.response_code();
  requests_list_.erase(iter);

  if (!response.Is2XXResponseCode()) {
    VLOG(1) << "Fail to get pins, response_code = " << response_code;
    std::move(callback).Run(std::nullopt);
    return;
  }

  auto parse_result =
      IPFSJSONParser::GetGetPinsResultFromJSON(response.value_body());
  if (!parse_result) {
    VLOG(1) << "Fail to get pins, wrong format";
    std::move(callback).Run(std::nullopt);
    return;
  }

  std::move(callback).Run(std::move(parse_result));
}

void IpfsService::OnPinAddResult(
    size_t cids_count_in_request,
    bool recursive,
    APIRequestList::iterator iter,
    AddPinCallback callback,
    api_request_helper::APIRequestResult response) {
  int response_code = response.response_code();
  requests_list_.erase(iter);

  if (!response.Is2XXResponseCode()) {
    VLOG(1) << "Fail to add pin, response_code = " << response_code;
    std::move(callback).Run(std::nullopt);
    return;
  }

  auto parse_result =
      IPFSJSONParser::GetAddPinsResultFromJSON(response.value_body());
  if (!parse_result) {
    VLOG(1) << "Fail to add pin service, wrong format";
    std::move(callback).Run(std::nullopt);
    return;
  }

  if (parse_result->pins.size() != cids_count_in_request) {
    VLOG(1) << "Not all CIDs were added";
    std::move(callback).Run(std::nullopt);
    return;
  }

  parse_result->recursive = recursive;

  std::move(callback).Run(std::move(parse_result));
}

void IpfsService::OnPinRemoveResult(
    APIRequestList::iterator iter,
    RemovePinCallback callback,
    api_request_helper::APIRequestResult response) {
  int response_code = response.response_code();
  requests_list_.erase(iter);

  if (!response.Is2XXResponseCode()) {
    VLOG(1) << "Fail to remove pin, response_code = " << response_code;
    std::move(callback).Run(std::nullopt);
    return;
  }

  auto parse_result =
      IPFSJSONParser::GetRemovePinsResultFromJSON(response.value_body());
  if (!parse_result) {
    VLOG(1) << "Fail to remove pin, wrong response format";
    std::move(callback).Run(std::nullopt);
    return;
  }

  std::move(callback).Run(std::move(parse_result));
}
#endif  // BUILDFLAG(ENABLE_IPFS_LOCAL_NODE)

void IpfsService::ValidateGateway(const GURL& url, BoolCallback callback) {
  GURL::Replacements replacements;
  std::string path = "/ipfs/";
  path += kGatewayValidationCID;
  replacements.SetPathStr(path);
  GURL validationUrl = url.ReplaceComponents(replacements);
  auto url_loader = CreateURLLoader(validationUrl, "GET");
  auto iter = url_loaders_.insert(url_loaders_.begin(), std::move(url_loader));
  iter->get()->DownloadToStringOfUnboundedSizeUntilCrashAndDie(
      url_loader_factory_.get(),
      base::BindOnce(&IpfsService::OnGatewayValidationComplete,
                     base::Unretained(this), iter, std::move(callback), url));
}

void IpfsService::OnGatewayValidationComplete(
    SimpleURLLoaderList::iterator iter,
    BoolCallback callback,
    const GURL& initial_url,
    std::unique_ptr<std::string> response_body) {
  auto* url_loader = iter->get();
  auto final_url = url_loader->GetFinalURL();

  int error_code = url_loader->NetError();
  int response_code = -1;
  if (url_loader->ResponseInfo() && url_loader->ResponseInfo()->headers)
    response_code = url_loader->ResponseInfo()->headers->response_code();
  url_loaders_.erase(iter);

  bool success = (error_code == net::OK && response_code == net::HTTP_OK);
  if (!success) {
    VLOG(1) << "Fail to validate gateway, error_code = " << error_code
            << " response_code = " << response_code;
  }

  if (success) {
    std::string valid_host = base::StringPrintf(
        "%s.ipfs.%s", kGatewayValidationCID, initial_url.host().c_str());
    success = (*response_body == kGatewayValidationResult) &&
              (initial_url.host() != final_url.host()) &&
              (initial_url.scheme() == final_url.scheme()) &&
              (final_url.host() == valid_host);
  }

  if (callback)
    std::move(callback).Run(success);
}

}  // namespace ipfs
