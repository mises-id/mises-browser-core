/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/common/extensions/mises_extensions_api_provider.h"

#include "mises/common/extensions/api/generated_includes.h"
#include "extensions/common/features/json_feature_provider_source.h"
#include "extensions/common/permissions/permissions_info.h"

namespace extensions {

MisesExtensionsAPIProvider::MisesExtensionsAPIProvider() = default;
MisesExtensionsAPIProvider::~MisesExtensionsAPIProvider() = default;

void MisesExtensionsAPIProvider::AddAPIFeatures(FeatureProvider* provider) {
  AddMisesAPIFeatures(provider);
}

void MisesExtensionsAPIProvider::AddManifestFeatures(
    FeatureProvider* provider) {
  AddMisesManifestFeatures(provider);
}

void MisesExtensionsAPIProvider::AddPermissionFeatures(
    FeatureProvider* provider) {
  AddMisesPermissionFeatures(provider);
}

void MisesExtensionsAPIProvider::AddBehaviorFeatures(
    FeatureProvider* provider) {
  // No brave-specific behavior features.
}

void MisesExtensionsAPIProvider::AddAPIJSONSources(
    JSONFeatureProviderSource* json_source) {
  json_source->LoadJSON(IDR_MISES_EXTENSION_API_FEATURES);
}

bool MisesExtensionsAPIProvider::IsAPISchemaGenerated(
    const std::string& name) {
  return api::MisesGeneratedSchemas::IsGenerated(name);
}

std::string_view MisesExtensionsAPIProvider::GetAPISchema(
    const std::string& name) {
  return api::MisesGeneratedSchemas::Get(name);
}

void MisesExtensionsAPIProvider::RegisterPermissions(
    PermissionsInfo* permissions_info) {
  // No brave-specific permissions.
}

void MisesExtensionsAPIProvider::RegisterManifestHandlers() {
  // No brave-specific manifest handlers.
}

}  // namespace extensions
