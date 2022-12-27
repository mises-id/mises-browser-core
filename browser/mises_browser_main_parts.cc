/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_browser_main_parts.h"


#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"
#endif


void MisesBrowserMainParts::PostBrowserStart() {
  ChromeBrowserMainParts::PostBrowserStart();
#if BUILDFLAG(IS_ANDROID)
  ChromeBrowserMainExtraPartsProfiles::
      EnsureBrowserContextKeyedServiceFactoriesBuilt();
#endif

}

