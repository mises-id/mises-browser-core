/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/browser_context_keyed_service_factories.h"
#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"

namespace {

class MisesBrowserMainExtraPartsProfiles
    : public ChromeBrowserMainExtraPartsProfiles {
 public:
  MisesBrowserMainExtraPartsProfiles() = default;
  MisesBrowserMainExtraPartsProfiles(
      const MisesBrowserMainExtraPartsProfiles&) = delete;
  MisesBrowserMainExtraPartsProfiles& operator=(
      const MisesBrowserMainExtraPartsProfiles&) = delete;
  ~MisesBrowserMainExtraPartsProfiles() override = default;

  static void EnsureBrowserContextKeyedServiceFactoriesBuilt() {
    mises::EnsureBrowserContextKeyedServiceFactoriesBuilt();
  }
};

}  // namespace

#define ChromeBrowserMainExtraPartsProfiles MisesBrowserMainExtraPartsProfiles
#include "src/chrome/browser/startup_data.cc"
#undef ChromeBrowserMainExtraPartsProfiles
