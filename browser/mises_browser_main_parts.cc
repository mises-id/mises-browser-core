/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_browser_main_parts.h"

#include "base/command_line.h"
#include "build/build_config.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/common/chrome_features.h"
#include "components/prefs/pref_service.h"
#include "content/public/browser/render_frame_host.h"

#if BUILDFLAG(IS_ANDROID)
#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"
#include "mises/components/constants/pref_names.h"
#include "mises/browser/android/preferences/features.h"
#endif

#include "media/base/media_switches.h"

#include "mises/browser/extensions/mises_component_loader.h"
#include "chrome/browser/extensions/extension_service.h"
#include "extensions/browser/extension_system.h"

void MisesBrowserMainParts::PostBrowserStart() {
  ChromeBrowserMainParts::PostBrowserStart();
#if BUILDFLAG(IS_ANDROID)
  ChromeBrowserMainExtraPartsProfiles::EnsureBrowserContextKeyedServiceFactoriesBuilt();
#endif

}



void MisesBrowserMainParts::PostProfileInit(Profile* profile,
                                            bool is_initial_profile) {
  ChromeBrowserMainParts::PostProfileInit(profile, is_initial_profile);

#if BUILDFLAG(IS_ANDROID)
  if (base::FeatureList::IsEnabled(
          preferences::features::kMisesBackgroundVideoPlayback) ||
      profile->GetPrefs()->GetBoolean(kBackgroundVideoPlaybackEnabled)) {
    content::RenderFrameHost::AllowInjectingJavaScript();
    auto* command_line = base::CommandLine::ForCurrentProcess();
    command_line->AppendSwitch(switches::kDisableBackgroundMediaSuspend);
  }
#endif
  // extensions::ExtensionService* service =
  //     extensions::ExtensionSystem::Get(profile)->extension_service();
  // if (service) {
  //   extensions::ComponentLoader* loader = service->component_loader();
  //   static_cast<extensions::MisesComponentLoader*>(loader)
  //       ->PreInstallExtensionOnStartup();
  // }
}
