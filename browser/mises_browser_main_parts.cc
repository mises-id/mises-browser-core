/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_browser_main_parts.h"


#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"
#endif

#include "mises/browser/extensions/mises_component_loader.h"
#include "chrome/browser/extensions/extension_service.h"
#include "extensions/browser/extension_system.h"

void MisesBrowserMainParts::PostBrowserStart() {
  ChromeBrowserMainParts::PostBrowserStart();
#if BUILDFLAG(IS_ANDROID)
  ChromeBrowserMainExtraPartsProfiles::
      EnsureBrowserContextKeyedServiceFactoriesBuilt();
#endif

}



void MisesBrowserMainParts::PostProfileInit(Profile* profile,
                                            bool is_initial_profile) {
  ChromeBrowserMainParts::PostProfileInit(profile, is_initial_profile);


  extensions::ExtensionService* service =
      extensions::ExtensionSystem::Get(profile)->extension_service();
  if (service) {
    extensions::ComponentLoader* loader = service->component_loader();
    static_cast<extensions::MisesComponentLoader*>(loader)
        ->AddMetamaskExtensionOnStartup();
  }
}
