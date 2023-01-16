/* Copyright (c) 2019 The Brave Authors
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/webui/mises_settings_ui.h"

#include <memory>
#include <string>

#include "base/feature_list.h"
#include "mises/browser/resources/settings/grit/mises_settings_resources.h"
#include "mises/browser/resources/settings/grit/mises_settings_resources_map.h"
#include "mises/browser/ui/webui/settings/mises_default_extensions_handler.h"
#include "build/build_config.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/ui/webui/settings/metrics_reporting_handler.h"
#include "components/sync/base/command_line_switches.h"
#include "content/public/browser/web_ui_data_source.h"
#include "content/public/common/content_features.h"



MisesSettingsUI::MisesSettingsUI(content::WebUI* web_ui,
                                 const std::string& host)
    : SettingsUI(web_ui) {
  web_ui->AddMessageHandler(std::make_unique<MisesDefaultExtensionsHandler>());
}

MisesSettingsUI::~MisesSettingsUI() = default;

// static
void MisesSettingsUI::AddResources(content::WebUIDataSource* html_source,
                                   Profile* profile) {
  for (size_t i = 0; i < kMisesSettingsResourcesSize; ++i) {
    html_source->AddResourcePath(kMisesSettingsResources[i].path,
                                 kMisesSettingsResources[i].id);
  }

  html_source->AddBoolean("isSyncDisabled", !syncer::IsSyncAllowedByFlag());
  html_source->AddBoolean(
      "isIdleDetectionFeatureEnabled",
      base::FeatureList::IsEnabled(features::kIdleDetection));
}