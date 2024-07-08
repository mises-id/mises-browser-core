/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
#include "mises/browser/android/preferences/features.h"

#include <vector>

#include "build/build_config.h"
#include "base/feature_list.h"
#include "base/strings/string_split.h"
#include "base/metrics/field_trial_params.h"

namespace preferences {
namespace features {
  
BASE_FEATURE(kMisesBackgroundVideoPlayback,
             "MisesBackgroundVideoPlayback",
             base::FEATURE_DISABLED_BY_DEFAULT);

BASE_FEATURE(kMisesPreinstallExtension,
             "MisesPreinstallExtension",
             base::FEATURE_DISABLED_BY_DEFAULT);


const base::FeatureParam<std::string> kMisesPreinstallExtensionList{
    &kMisesPreinstallExtension, "ExtensionList", ""};

std::vector<std::string> GetMisesPreinstallExtensionIds() {
   if (!base::FeatureList::IsEnabled(kMisesPreinstallExtension))
    return std::vector<std::string>();

   std::string list_str = kMisesPreinstallExtensionList.Get();
   return base::SplitString(
      list_str, ",", base::TRIM_WHITESPACE, base::SPLIT_WANT_NONEMPTY);
}
}  // namespace features
}  // namespace preferences
