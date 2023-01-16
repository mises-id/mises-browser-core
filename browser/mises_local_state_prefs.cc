/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/mises_local_state_prefs.h"

#include "base/values.h"
#include "mises/components/constants/pref_names.h"
#include "mises/components/decentralized_dns/core/utils.h"
#include "build/build_config.h"
#include "chrome/common/pref_names.h"
#include "components/metrics/metrics_pref_names.h"
#include "components/prefs/pref_registry_simple.h"
#include "third_party/widevine/cdm/buildflags.h"


namespace mises {

void RegisterLocalStatePrefs(PrefRegistrySimple* registry) {
  

  decentralized_dns::RegisterLocalStatePrefs(registry);

}

}  // namespace brave
