/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "chrome/browser/chrome_resource_bundle_helper.h"

#define LoadLocalState LoadLocalState_ChromiumImpl
#include "src/chrome/browser/chrome_resource_bundle_helper.cc"
#undef LoadLocalState
#include "mises/common/resource_bundle_helper.h"

std::string LoadLocalState(
    ChromeFeatureListCreator* chrome_feature_list_creator,
    bool is_running_tests) {
  std::string ret = LoadLocalState_ChromiumImpl(chrome_feature_list_creator,
                                                is_running_tests);
  mises::InitializeResourceBundle();
  return ret;
}
