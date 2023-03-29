/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "base/feature_override.h"
#include "src/chrome/browser/flags/android/chrome_feature_list.cc"

namespace chrome {
namespace android {

OVERRIDE_FEATURE_DEFAULT_STATES({{
    {kAddToHomescreenIPH, base::FEATURE_DISABLED_BY_DEFAULT},
    {kShowScrollableMVTOnNTPAndroid, base::FEATURE_ENABLED_BY_DEFAULT},
    {kStartSurfaceAndroid, base::FEATURE_DISABLED_BY_DEFAULT},
}});

}  // namespace android
}  // namespace chrome
