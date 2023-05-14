/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/brave_wallet/brave_wallet_context_utils.h"
#include "mises/browser/profiles/profile_util.h"
#include "mises/components/brave_wallet/common/common_util.h"
#include "components/user_prefs/user_prefs.h"
#include "content/public/browser/browser_context.h"

namespace brave_wallet {

bool IsAllowedForContext(content::BrowserContext* context) {
  if (context && (!mises::IsRegularProfile(context) ||
                  !IsAllowed(user_prefs::UserPrefs::Get(context)))) {
    return false;
  }

  return true;
}

}  // namespace brave_wallet
