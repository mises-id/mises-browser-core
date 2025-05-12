/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
#include "mises/browser/android/preferences/features.h"

#include <vector>

#include "build/build_config.h"
#include "base/feature_list.h"
#include "base/system/sys_info.h"
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

const base::FeatureParam<std::string> kMisesPreinstallExtensionListWithTOS{
    &kMisesPreinstallExtension, "ExtensionListWithTOS", ""};
const base::FeatureParam<std::string> kMisesPreinstallExtensionTOS{
    &kMisesPreinstallExtension, "TOS", ""};

const base::FeatureParam<std::string> kMisesPreinstallDefaultEVMExtension{
    &kMisesPreinstallExtension, "DefaultEVMExtension", ""};

    

std::vector<std::string> GetMisesPreinstallExtensionIds() {
   if (!base::FeatureList::IsEnabled(kMisesPreinstallExtension))
    return std::vector<std::string>();

   std::string list_str = kMisesPreinstallExtensionList.Get();
   return base::SplitString(
      list_str, ",", base::TRIM_WHITESPACE, base::SPLIT_WANT_NONEMPTY);
}

std::vector<std::string> GetMisesPreinstallExtensionWithTOSIds() {
   if (!base::FeatureList::IsEnabled(kMisesPreinstallExtension))
    return std::vector<std::string>();

   std::string list_str = kMisesPreinstallExtensionListWithTOS.Get();
   return base::SplitString(
      list_str, ",", base::TRIM_WHITESPACE, base::SPLIT_WANT_NONEMPTY);
}

std::string GetMisesPreinstallExtensionTOS() {
   if (!base::FeatureList::IsEnabled(kMisesPreinstallExtension))
    return std::string();

   return kMisesPreinstallExtensionTOS.Get();
}

std::string GetMisesPreinstallDefaultEVMExtension() {
   if (!base::FeatureList::IsEnabled(kMisesPreinstallExtension))
    return std::string();

   std::vector<std::string> list = base::SplitString(
      kMisesPreinstallDefaultEVMExtension.Get(), ",", base::TRIM_WHITESPACE, base::SPLIT_WANT_NONEMPTY);
   if (list.size() >= 1) {
    return list[0];
   }
   return "";
}


std::string GetMisesPreinstallDefaultEVMExtensionKeyProperty() {
   if (!base::FeatureList::IsEnabled(kMisesPreinstallExtension))
    return std::string();

   std::vector<std::string> list = base::SplitString(
      kMisesPreinstallDefaultEVMExtension.Get(), ",", base::TRIM_WHITESPACE, base::SPLIT_WANT_NONEMPTY);
   if (list.size() >= 2) {
    return list[1];
   }
   return "";
}


BASE_FEATURE(kMisesPriorityExtension,
             "MisesPriorityExtension",
             base::FEATURE_DISABLED_BY_DEFAULT);


const base::FeatureParam<std::string> kMisesPriorityExtensionList{
    &kMisesPriorityExtension, "ExtensionList", ""};

std::vector<std::string> GetMisesPriorityExtensionIds() {
      if (!base::FeatureList::IsEnabled(kMisesPriorityExtension))
    return std::vector<std::string>();

   std::string list_str = kMisesPriorityExtensionList.Get();
   return base::SplitString(
      list_str, ",", base::TRIM_WHITESPACE, base::SPLIT_WANT_NONEMPTY);
}


BASE_FEATURE(kMisesAllowExtensionIsolation,
   "MisesAllowExtensionIsolation",
   base::FEATURE_DISABLED_BY_DEFAULT);
   
bool IsMisesAllowExtensionIsolation() {
   //enable isolation for 3GB and above
   if (base::SysInfo::AmountOfPhysicalMemoryMB() >= 3 * 1024) {
      return true;
   }
   return base::FeatureList::IsEnabled(kMisesAllowExtensionIsolation);
}


}  // namespace features
}  // namespace preferences
