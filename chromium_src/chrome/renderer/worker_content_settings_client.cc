/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <optional>

#include "chrome/renderer/worker_content_settings_client.h"
#include "components/content_settings/renderer/content_settings_agent_impl.h"
#include "net/base/features.h"
#include "net/base/registry_controlled_domains/registry_controlled_domain.h"


blink::WebSecurityOrigin
WorkerContentSettingsClient::GetEphemeralStorageOriginSync() {
  if (!base::FeatureList::IsEnabled(net::features::kMisesEphemeralStorage))
    return {};

  if (is_unique_origin_)
    return {};

  // If first party ephemeral storage is enabled, we should always ask the
  // browser if a worker should use ephemeral storage or not.
  if (!base::FeatureList::IsEnabled(
          net::features::kMisesFirstPartyEphemeralStorage) &&
      net::registry_controlled_domains::SameDomainOrHost(
          top_frame_origin_, document_origin_,
          net::registry_controlled_domains::INCLUDE_PRIVATE_REGISTRIES)) {
    return {};
  }

  EnsureContentSettingsManager();

  std::optional<url::Origin> optional_ephemeral_storage_origin;
  content_settings_manager_->AllowEphemeralStorageAccess(
      render_frame_id_, document_origin_, site_for_cookies_, top_frame_origin_,
      &optional_ephemeral_storage_origin);
  // Don't cache the value intentionally as other WorkerContentSettingsClient
  // methods do.
  return blink::WebSecurityOrigin(
      optional_ephemeral_storage_origin
          ? blink::WebSecurityOrigin(*optional_ephemeral_storage_origin)
          : blink::WebSecurityOrigin());
}

bool WorkerContentSettingsClient::HasContentSettingsRules() const {
  return content_setting_rules_.get();
}

#include "src/chrome/renderer/worker_content_settings_client.cc"
