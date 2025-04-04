/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/version_info/version_info.h"

#include "mises/components/version_info/version_info_values.h"

namespace version_info {

std::string GetBraveVersionWithoutChromiumMajorVersion() {
  return constants::kBraveBrowserVersion;
}

std::string GetBraveVersionNumberForDisplay() {
  return constants::kBraveVersionNumberForDisplay;
}

std::string GetBraveChromiumVersionNumber() {
  return constants::kBraveChromiumVersion;
}

}  // namespace version_info
