/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/brave_wallet/brave_wallet_provider_delegate_impl.h"

#include <string>
#include <utility>
#include <vector>

#include "base/functional/bind.h"
#include "mises/browser/brave_wallet/brave_wallet_provider_delegate_impl_helper.h"
#include "mises/browser/brave_wallet/brave_wallet_tab_helper.h"
#include "mises/components/brave_wallet/browser/brave_wallet_constants.h"
#include "mises/components/brave_wallet/browser/brave_wallet_utils.h"
#include "mises/components/brave_wallet/browser/permission_utils.h"
#include "mises/components/permissions/contexts/mises_wallet_permission_context.h"
#include "components/content_settings/core/common/content_settings.h"
#include "content/public/browser/render_frame_host.h"
#include "content/public/browser/visibility.h"
#include "content/public/browser/web_contents.h"

namespace brave_wallet {

namespace {

bool IsAccountAllowed(const std::vector<std::string>& allowed_accounts,
                      const std::string& account) {
  for (const auto& allowed_account : allowed_accounts) {
    if (base::CompareCaseInsensitiveASCII(account, allowed_account) == 0)
      return true;
  }
  return false;
}

void OnRequestPermissions(
    const std::vector<std::string>& accounts,
    BraveWalletProviderDelegate::RequestPermissionsCallback callback,
    const std::vector<blink::mojom::PermissionStatus>& responses) {
  DCHECK(responses.empty() || responses.size() == accounts.size());

  std::vector<std::string> granted_accounts;
  for (size_t i = 0; i < responses.size(); i++) {
    if (responses[i] == blink::mojom::PermissionStatus::GRANTED) {
      granted_accounts.push_back(accounts[i]);
    }
  }
  // The responses array will be empty if operation failed.
  if (responses.empty()) {
    std::move(callback).Run(mojom::RequestPermissionsError::kInternal,
                            std::nullopt);
  } else {
    std::move(callback).Run(mojom::RequestPermissionsError::kNone,
                            granted_accounts);
  }
}

void OnIsAccountAllowed(
    const std::string& account,
    BraveWalletProviderDelegate::IsAccountAllowedCallback callback,
    bool success,
    const std::vector<std::string>& allowed_accounts) {
  bool allowed = IsAccountAllowed(allowed_accounts, account);

  std::move(callback).Run(allowed);
}

std::optional<permissions::RequestType> CoinTypeToPermissionRequestType(
    mojom::CoinType coin_type) {
  switch (coin_type) {
    case mojom::CoinType::ETH:
      return permissions::RequestType::kMisesEthereum;
    case mojom::CoinType::SOL:
      return permissions::RequestType::kMisesSolana;
    default:
      return std::nullopt;
  }
}

std::optional<std::string> CoinTypeToKeyringId(mojom::CoinType coin_type) {
  switch (coin_type) {
    case mojom::CoinType::ETH:
      return mojom::kDefaultKeyringId;
    case mojom::CoinType::SOL:
      return mojom::kSolanaKeyringId;
    case mojom::CoinType::FIL:
      return mojom::kFilecoinKeyringId;
    default:
      return std::nullopt;
  }
}

}  // namespace

BraveWalletProviderDelegateImpl::BraveWalletProviderDelegateImpl(
    content::WebContents* web_contents,
    content::RenderFrameHost* const render_frame_host)
    : WebContentsObserver(web_contents),
      web_contents_(web_contents),
      host_id_(render_frame_host->GetGlobalId()),
      weak_ptr_factory_(this) {}

BraveWalletProviderDelegateImpl::~BraveWalletProviderDelegateImpl() = default;

url::Origin BraveWalletProviderDelegateImpl::GetOrigin() const {
  auto* rfh = content::RenderFrameHost::FromID(host_id_);
  return rfh ? rfh->GetLastCommittedOrigin() : url::Origin();
}

bool BraveWalletProviderDelegateImpl::IsTabVisible() {
#if !BUILDFLAG(IS_ANDROID)
  return web_contents_
             ? web_contents_->GetVisibility() == content::Visibility::VISIBLE
             : false;
#else
  if (web_contents_) {
    bool visible = web_contents_->GetVisibility() == content::Visibility::VISIBLE;
    return visible || brave_wallet::IsPanelShowing(web_contents_);
  } else {
    return false;
  }
#endif
}

void BraveWalletProviderDelegateImpl::ShowPanel() {
  ::brave_wallet::ShowPanel(web_contents_);
}

void BraveWalletProviderDelegateImpl::WalletInteractionDetected() {
  ::brave_wallet::WalletInteractionDetected(web_contents_);
}

void BraveWalletProviderDelegateImpl::ShowWalletOnboarding() {
  ::brave_wallet::ShowWalletOnboarding(web_contents_);
}

bool BraveWalletProviderDelegateImpl::IsPanelShowing() {
  return ::brave_wallet::IsPanelShowing(web_contents_);
}

void BraveWalletProviderDelegateImpl::ShowAccountCreation(
    mojom::CoinType type) {
  auto keyring_id = CoinTypeToKeyringId(type);
  if (keyring_id)
    ::brave_wallet::ShowAccountCreation(web_contents_, *keyring_id);
}

void BraveWalletProviderDelegateImpl::GetAllowedAccounts(
    mojom::CoinType type,
    const std::vector<std::string>& accounts,
    GetAllowedAccountsCallback callback) {
  if (IsPermissionDenied(type)) {
    std::move(callback).Run(true, std::vector<std::string>());
    return;
  }
  auto permission = CoinTypeToPermissionType(type);
  if (!permission) {
    std::move(callback).Run(false, std::vector<std::string>());
    return;
  }
  permissions::BraveWalletPermissionContext::GetAllowedAccounts(
      *permission, content::RenderFrameHost::FromID(host_id_), accounts,
      std::move(callback));
}

void BraveWalletProviderDelegateImpl::RequestPermissions(
    mojom::CoinType type,
    const std::vector<std::string>& accounts,
    RequestPermissionsCallback callback) {
  if (!IsWeb3NotificationAllowed()) {
    std::move(callback).Run(mojom::RequestPermissionsError::kNone,
                            std::vector<std::string>());
    return;
  }
  auto request_type = CoinTypeToPermissionRequestType(type);
  auto permission = CoinTypeToPermissionType(type);
  if (!request_type || !permission) {
    std::move(callback).Run(mojom::RequestPermissionsError::kInternal,
                            std::nullopt);
    return;
  }
  // Check if there's already a permission request in progress
  auto* rfh = content::RenderFrameHost::FromID(host_id_);
  if (rfh && permissions::BraveWalletPermissionContext::HasRequestsInProgress(
                 rfh, *request_type)) {
    std::move(callback).Run(mojom::RequestPermissionsError::kRequestInProgress,
                            std::nullopt);
    return;
  }

  permissions::BraveWalletPermissionContext::RequestPermissions(
      *permission, content::RenderFrameHost::FromID(host_id_), accounts,
      base::BindOnce(&OnRequestPermissions, accounts, std::move(callback)));
}

void BraveWalletProviderDelegateImpl::IsAccountAllowed(
    mojom::CoinType type,
    const std::string& account,
    IsAccountAllowedCallback callback) {
  auto permission = CoinTypeToPermissionType(type);
  if (!permission) {
    std::move(callback).Run(false);
    return;
  }

  permissions::BraveWalletPermissionContext::GetAllowedAccounts(
      *permission, content::RenderFrameHost::FromID(host_id_), {account},
      base::BindOnce(&OnIsAccountAllowed, account, std::move(callback)));
}

bool BraveWalletProviderDelegateImpl::IsPermissionDenied(mojom::CoinType type) {
  auto permission = CoinTypeToPermissionType(type);
  if (!permission) {
    return false;
  }

  auto* rfh = content::RenderFrameHost::FromID(host_id_);
  if (!rfh) {
    return false;
  }

  auto* web_contents = content::WebContents::FromRenderFrameHost(rfh);

  return permissions::BraveWalletPermissionContext::IsPermissionDenied(
      *permission, web_contents->GetBrowserContext(),
      url::Origin::Create(rfh->GetLastCommittedURL()));
}

void BraveWalletProviderDelegateImpl::AddSolanaConnectedAccount(
    const std::string& account) {
  if (!web_contents_)
    return;
  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents_);
  if (tab_helper)
    tab_helper->AddSolanaConnectedAccount(host_id_, account);
}

void BraveWalletProviderDelegateImpl::RemoveSolanaConnectedAccount(
    const std::string& account) {
  if (!web_contents_)
    return;
  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents_);
  if (tab_helper)
    tab_helper->RemoveSolanaConnectedAccount(host_id_, account);
}

bool BraveWalletProviderDelegateImpl::IsSolanaAccountConnected(
    const std::string& account) {
  if (!web_contents_)
    return false;
  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents_);
  if (!tab_helper)
    return false;

  return tab_helper->IsSolanaAccountConnected(host_id_, account);
}

void BraveWalletProviderDelegateImpl::WebContentsDestroyed() {
  web_contents_ = nullptr;
}

// This is for dapp inside iframe navigates away.
void BraveWalletProviderDelegateImpl::RenderFrameHostChanged(
    content::RenderFrameHost* old_host,
    content::RenderFrameHost* new_host) {
  if (!old_host || old_host != content::RenderFrameHost::FromID(host_id_))
    return;
  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents_);
  if (tab_helper)
    tab_helper->ClearSolanaConnectedAccounts(host_id_);
}

void BraveWalletProviderDelegateImpl::PrimaryPageChanged(content::Page& page) {
  if (!web_contents_)
    return;
  auto* tab_helper =
      brave_wallet::BraveWalletTabHelper::FromWebContents(web_contents_);
  if (tab_helper)
    tab_helper->ClearSolanaConnectedAccounts(host_id_);
}

}  // namespace brave_wallet
