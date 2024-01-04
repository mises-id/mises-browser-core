/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/profiles/mises_renderer_updater.h"

#include <utility>

#include "base/functional/bind.h"
#include "mises/browser/brave_wallet/brave_wallet_context_utils.h"
#include "mises/common/mises_renderer_configuration.mojom.h"
#include "mises/components/brave_wallet/browser/keyring_service.h"
#include "mises/components/brave_wallet/browser/pref_names.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom.h"
#include "mises/components/constants/pref_names.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/common/pref_names.h"
#include "components/prefs/pref_service.h"
#include "content/public/browser/browser_thread.h"
#include "content/public/browser/render_process_host.h"
#include "extensions/buildflags/buildflags.h"
#include "ipc/ipc_channel_proxy.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"
#include "third_party/widevine/cdm/buildflags.h"


#if BUILDFLAG(ENABLE_EXTENSIONS)
#include "extensions/browser/extension_registry.h"
#endif

MisesRendererUpdater::MisesRendererUpdater(
    Profile* profile,
    brave_wallet::KeyringService* keyring_service,
    PrefService* local_state)
    : profile_(profile),
      keyring_service_(keyring_service),
      local_state_(local_state) {
  PrefService* pref_service = profile->GetPrefs();
  brave_wallet_ethereum_provider_.Init(kDefaultEthereumWallet, pref_service);
  brave_wallet_solana_provider_.Init(kDefaultSolanaWallet, pref_service);
  //de_amp_enabled_.Init(de_amp::kDeAmpPrefEnabled, pref_service);
// #if BUILDFLAG(ENABLE_TOR)
//   onion_only_in_tor_windows_.Init(tor::prefs::kOnionOnlyInTorWindows,
//                                   pref_service);
// #endif

  CheckActiveWallet();

  pref_change_registrar_.Init(pref_service);
  pref_change_registrar_.Add(
      kDefaultEthereumWallet,
      base::BindRepeating(&MisesRendererUpdater::UpdateAllRenderers,
                          base::Unretained(this)));
  pref_change_registrar_.Add(
      kDefaultSolanaWallet,
      base::BindRepeating(&MisesRendererUpdater::UpdateAllRenderers,
                          base::Unretained(this)));
  // pref_change_registrar_.Add(
  //     de_amp::kDeAmpPrefEnabled,
  //     base::BindRepeating(&MisesRendererUpdater::UpdateAllRenderers,
  //                         base::Unretained(this)));
  pref_change_registrar_.Add(
      kBraveWalletKeyrings,
      base::BindRepeating(
          &MisesRendererUpdater::CheckActiveWalletAndMaybeUpdateRenderers,
          base::Unretained(this)));
// #if BUILDFLAG(ENABLE_TOR)
//   pref_change_registrar_.Add(
//       tor::prefs::kOnionOnlyInTorWindows,
//       base::BindRepeating(&MisesRendererUpdater::UpdateAllRenderers,
//                           base::Unretained(this)));
// #endif

#if BUILDFLAG(ENABLE_WIDEVINE)
  widevine_enabled_.Init(kWidevineEnabled, local_state);
  local_state_change_registrar_.Init(local_state);
  local_state_change_registrar_.Add(
      kWidevineEnabled,
      base::BindRepeating(&MisesRendererUpdater::UpdateAllRenderers,
                          base::Unretained(this)));
#endif
}

MisesRendererUpdater::~MisesRendererUpdater() = default;

void MisesRendererUpdater::InitializeRenderer(
    content::RenderProcessHost* render_process_host) {
  auto renderer_configuration = GetRendererConfiguration(render_process_host);
  Profile* profile =
      Profile::FromBrowserContext(render_process_host->GetBrowserContext());
  is_wallet_allowed_for_context_ = brave_wallet::IsAllowedForContext(profile);
  renderer_configuration->SetInitialConfiguration(/*profile->IsTor()*/ false);
  UpdateRenderer(&renderer_configuration);
}

std::vector<mojo::AssociatedRemote<mises::mojom::MisesRendererConfiguration>>
MisesRendererUpdater::GetRendererConfigurations() {
  std::vector<mojo::AssociatedRemote<mises::mojom::MisesRendererConfiguration>>
      rv;
  for (content::RenderProcessHost::iterator it(
           content::RenderProcessHost::AllHostsIterator());
       !it.IsAtEnd(); it.Advance()) {
    Profile* renderer_profile =
        static_cast<Profile*>(it.GetCurrentValue()->GetBrowserContext());
    if (renderer_profile == profile_ ||
        renderer_profile->GetOriginalProfile() == profile_) {
      auto renderer_configuration =
          GetRendererConfiguration(it.GetCurrentValue());
      if (renderer_configuration) {
        rv.push_back(std::move(renderer_configuration));
      }
    }
  }
  return rv;
}

mojo::AssociatedRemote<mises::mojom::MisesRendererConfiguration>
MisesRendererUpdater::GetRendererConfiguration(
    content::RenderProcessHost* render_process_host) {
  IPC::ChannelProxy* channel = render_process_host->GetChannel();
  if (!channel) {
    return mojo::AssociatedRemote<mises::mojom::MisesRendererConfiguration>();
  }

  mojo::AssociatedRemote<mises::mojom::MisesRendererConfiguration>
      renderer_configuration;
  channel->GetRemoteAssociatedInterface(&renderer_configuration);

  return renderer_configuration;
}

void MisesRendererUpdater::CheckActiveWalletAndMaybeUpdateRenderers() {
  if (CheckActiveWallet()) {
    UpdateAllRenderers();
  }
}

bool MisesRendererUpdater::CheckActiveWallet() {
  if (!keyring_service_) {
    return false;
  }
  return false;
//   bool is_wallet_created = keyring_service_->IsWalletCreatedSync();
//   bool changed = is_wallet_created != is_wallet_created_;
//   is_wallet_created_ = is_wallet_created;
//   return changed;
// 
}

void MisesRendererUpdater::UpdateAllRenderers() {
  auto renderer_configurations = GetRendererConfigurations();
  for (auto& renderer_configuration : renderer_configurations) {
    UpdateRenderer(&renderer_configuration);
  }
}

void MisesRendererUpdater::UpdateRenderer(
    mojo::AssociatedRemote<mises::mojom::MisesRendererConfiguration>*
        renderer_configuration) {
// #if BUILDFLAG(ENABLE_EXTENSIONS)
//   extensions::ExtensionRegistry* registry =
//       extensions::ExtensionRegistry::Get(profile_);
//   bool has_installed_metamask =
//       registry && registry->enabled_extensions().Contains(kMetamaskExtensionId);
// #else
  bool has_installed_metamask = false;
//#endif

  bool should_ignore_brave_wallet_for_eth =
      !is_wallet_created_ || has_installed_metamask;
  bool should_ignore_brave_wallet_for_sol = !is_wallet_created_;

  auto default_ethereum_wallet =
      static_cast<brave_wallet::mojom::DefaultWallet>(
          brave_wallet_ethereum_provider_.GetValue());
  bool install_window_mises_ethereum_provider =
      is_wallet_allowed_for_context_ &&
      default_ethereum_wallet != brave_wallet::mojom::DefaultWallet::None;
  bool install_window_ethereum_provider =
      ((default_ethereum_wallet ==
            brave_wallet::mojom::DefaultWallet::BraveWalletPreferExtension &&
        !should_ignore_brave_wallet_for_eth) ||
       default_ethereum_wallet ==
           brave_wallet::mojom::DefaultWallet::BraveWallet) &&
      is_wallet_allowed_for_context_;
  bool allow_overwrite_window_ethereum_provider =
      default_ethereum_wallet ==
      brave_wallet::mojom::DefaultWallet::BraveWalletPreferExtension;

  auto default_solana_wallet = static_cast<brave_wallet::mojom::DefaultWallet>(
      brave_wallet_solana_provider_.GetValue());
  bool mises_use_native_solana_wallet =
      ((default_solana_wallet ==
            brave_wallet::mojom::DefaultWallet::BraveWalletPreferExtension &&
        !should_ignore_brave_wallet_for_sol) ||
       default_solana_wallet ==
           brave_wallet::mojom::DefaultWallet::BraveWallet) &&
      is_wallet_allowed_for_context_;
  bool allow_overwrite_window_solana_provider =
      default_solana_wallet ==
      brave_wallet::mojom::DefaultWallet::BraveWalletPreferExtension;

  //PrefService* pref_service = profile_->GetPrefs();
  bool de_amp_enabled = false;//de_amp::IsDeAmpEnabled(pref_service);
  bool onion_only_in_tor_windows = true;
// #if BUILDFLAG(ENABLE_TOR)
//   onion_only_in_tor_windows =
//       pref_service->GetBoolean(tor::prefs::kOnionOnlyInTorWindows);
// #endif
  bool widevine_enabled = false;
#if BUILDFLAG(ENABLE_WIDEVINE)
  widevine_enabled = local_state_->GetBoolean(kWidevineEnabled);
#endif

  (*renderer_configuration)
      ->SetConfiguration(mises::mojom::DynamicParams::New(
          install_window_mises_ethereum_provider,
          install_window_ethereum_provider,
          allow_overwrite_window_ethereum_provider,
          mises_use_native_solana_wallet,
          allow_overwrite_window_solana_provider, de_amp_enabled,
          onion_only_in_tor_windows, widevine_enabled));
}