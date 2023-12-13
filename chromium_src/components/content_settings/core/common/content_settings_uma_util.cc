/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "components/content_settings/core/browser/content_settings_uma_util.h"

// Leave a gap between Chromium values and our values in the kHistogramValue
// array so that we don't have to renumber when new content settings types are
// added upstream.
namespace {

// Do not change the value arbitrarily. This is used to validate we have a gap
// between Chromium's and Brave's histograms. This value must be less than 1000
// as upstream performs a sanity check that the total number of buckets isn't
// unreasonably large.
constexpr int kBraveValuesStart = 900;

constexpr int brave_value(int incr) {
  return kBraveValuesStart + incr;
}

}  // namespace

static_assert(static_cast<int>(ContentSettingsType::NUM_TYPES) <
                  kBraveValuesStart,
              "There must a gap between the histograms used by Chromium, and "
              "the ones used by Brave.");

// clang-format off
#define MISES_HISTOGRAM_VALUE_LIST                                        \
  {ContentSettingsType::BRAVE_ETHEREUM, brave_value(9)},                  \
  {ContentSettingsType::BRAVE_SOLANA, brave_value(10)},                   
// clang-format on

#include "src/components/content_settings/core/browser/content_settings_uma_util.cc"

#undef MISES_HISTOGRAM_VALUE_LIST
