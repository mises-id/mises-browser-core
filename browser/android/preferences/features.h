/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_BROWSER_ANDROID_PREFERENCES_FEATURES_H_
#define MISES_BROWSER_ANDROID_PREFERENCES_FEATURES_H_

#include "base/feature_list.h"

namespace preferences {
namespace features {
  
BASE_DECLARE_FEATURE(kMisesBackgroundVideoPlayback);

BASE_DECLARE_FEATURE(kMisesPreinstallExtension);



std::vector<std::string> GetMisesPreinstallExtensionIds();
std::string GetMisesPreinstallExtensionTOS();
std::vector<std::string> GetMisesPreinstallExtensionWithTOSIds();
std::string GetMisesPreinstallDefaultEVMExtension();
std::string GetMisesPreinstallDefaultEVMExtensionKeyProperty();

BASE_DECLARE_FEATURE(kMisesPriorityExtension);
std::vector<std::string> GetMisesPriorityExtensionIds();

}  // namespace features
}  // namespace preferences

#endif  // BRAVE_BROWSER_ANDROID_PREFERENCES_FEATURES_H_
