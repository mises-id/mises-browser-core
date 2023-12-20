/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "chrome/browser/permissions/permission_manager_factory.h"

#include "mises/browser/permissions/permission_lifetime_manager_factory.h"
#include "mises/components/permissions/mises_permission_manager.h"
#include "mises/components/permissions/contexts/mises_wallet_permission_context.h"
#include "mises/components/permissions/permission_lifetime_manager.h"
#include "components/permissions/features.h"

// #define GeolocationPermissionContextDelegate \
//   BraveGeolocationPermissionContextDelegate

#define BuildServiceInstanceForBrowserContext BuildServiceInstanceForBrowserContext_ChromiumImpl

#include "src/chrome/browser/permissions/permission_manager_factory.cc"

//#undef GeolocationPermissionContextDelegate
#undef BuildServiceInstanceForBrowserContext

std::unique_ptr<KeyedService>
PermissionManagerFactory::BuildServiceInstanceForBrowserContext(
    content::BrowserContext* context) const {
  Profile* profile = Profile::FromBrowserContext(context);
  auto permission_contexts = CreatePermissionContexts(profile);

  permission_contexts[ContentSettingsType::MISES_ETHEREUM] =
      std::make_unique<permissions::BraveWalletPermissionContext>(
          profile, ContentSettingsType::MISES_ETHEREUM);
  permission_contexts[ContentSettingsType::MISES_SOLANA] =
      std::make_unique<permissions::BraveWalletPermissionContext>(
          profile, ContentSettingsType::MISES_SOLANA);
  // permission_contexts[ContentSettingsType::BRAVE_GOOGLE_SIGN_IN] =
  //     std::make_unique<permissions::BraveGoogleSignInPermissionContext>(
  //         profile);

  if (base::FeatureList::IsEnabled(
          permissions::features::kPermissionLifetime)) {
    auto factory =
        base::BindRepeating(&PermissionLifetimeManagerFactory::GetForProfile);
    for (auto& permission_context : permission_contexts) {
      permission_context.second->SetPermissionLifetimeManagerFactory(factory);
    }
  }

  return std::make_unique<permissions::MisesPermissionManager>(
      profile, std::move(permission_contexts));
}
