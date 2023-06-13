/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "components/content_settings/core/common/content_settings.h"

// Leave a gap between Chromium values and our values in the kHistogramValue
// array so that we don't have to renumber when new content settings types are
// added upstream.
namespace {

// Do not change the value arbitrarily. This variable is only used for the
// DCHECK in ContentSettingTypeToHistogramValue function below.
constexpr int kBraveValuesStart = 1000;

constexpr int brave_value(int incr) {
  return kBraveValuesStart + incr;
}

}  // namespace

// clang-format off
#define MISES_HISTOGRAM_VALUE_LIST                                        \
  {ContentSettingsType::MISES_ETHEREUM, brave_value(9)},                  \
  {ContentSettingsType::MISES_SOLANA, brave_value(10)},                   
// clang-format on

#define ContentSettingTypeToHistogramValue \
  ContentSettingTypeToHistogramValue_ChromiumImpl

#include "src/components/content_settings/core/common/content_settings.cc"

#undef ContentSettingTypeToHistogramValue
#undef BRAVE_HISTOGRAM_VALUE_LIST

int ContentSettingTypeToHistogramValue(ContentSettingsType content_setting,
                                       size_t* num_values) {
  DCHECK(static_cast<int>(ContentSettingsType::NUM_TYPES) < kBraveValuesStart);
  return ContentSettingTypeToHistogramValue_ChromiumImpl(content_setting,
                                                         num_values);
}

namespace content_settings {
namespace {

bool IsExplicitSetting(const ContentSettingsPattern& primary_pattern,
                       const ContentSettingsPattern& secondary_pattern) {
  return !primary_pattern.MatchesAllHosts() ||
         !secondary_pattern.MatchesAllHosts();
}

}  // namespace

bool IsExplicitSetting(const ContentSettingPatternSource& setting) {
  return IsExplicitSetting(setting.primary_pattern, setting.secondary_pattern);
}

bool IsExplicitSetting(const SettingInfo& setting) {
  return IsExplicitSetting(setting.primary_pattern, setting.secondary_pattern);
}

}  // namespace content_settings

