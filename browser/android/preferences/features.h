/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_BROWSER_ANDROID_PREFERENCES_FEATURES_H_
#define MISES_BROWSER_ANDROID_PREFERENCES_FEATURES_H_

#include "base/base_export.h"
#include "base/feature_list.h"

namespace preferences {
namespace features {
  
BASE_EXPORT BASE_DECLARE_FEATURE(kMisesBackgroundVideoPlayback);

BASE_EXPORT BASE_DECLARE_FEATURE(kMisesPreinstallExtension);



BASE_EXPORT std::vector<std::string> GetMisesPreinstallExtensionIds();
BASE_EXPORT std::string GetMisesPreinstallExtensionTOS();
BASE_EXPORT std::vector<std::string> GetMisesPreinstallExtensionWithTOSIds();
BASE_EXPORT std::string GetMisesPreinstallDefaultEVMExtension();
BASE_EXPORT std::string GetMisesPreinstallDefaultEVMExtensionKeyProperty();

BASE_EXPORT BASE_DECLARE_FEATURE(kMisesPriorityExtension);
BASE_EXPORT std::vector<std::string> GetMisesPriorityExtensionIds();

BASE_EXPORT BASE_DECLARE_FEATURE(kMisesAllowExtensionIsolation);
BASE_EXPORT bool IsMisesAllowExtensionIsolation();


}  // namespace features
}  // namespace preferences

#endif  // BRAVE_BROWSER_ANDROID_PREFERENCES_FEATURES_H_
