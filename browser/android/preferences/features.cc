/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/android/preferences/features.h"

#include "build/build_config.h"
#include "base/feature_list.h"


namespace preferences {
namespace features {
  
BASE_FEATURE(kMisesBackgroundVideoPlayback,
             "MisesBackgroundVideoPlayback",
             base::FEATURE_DISABLED_BY_DEFAULT);

}  // namespace features
}  // namespace preferences
