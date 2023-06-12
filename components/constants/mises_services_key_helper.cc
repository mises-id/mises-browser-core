/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "mises/components/constants/mises_services_key_helper.h"

#include "mises/components/constants/network_constants.h"
#include "extensions/common/url_pattern.h"
#include "url/gurl.h"

namespace mises {

bool ShouldAddMisesServicesKeyHeader(const GURL& url) {
  static URLPattern mises_proxy_pattern(URLPattern::SCHEME_HTTPS,
                                        kMisesProxyPattern);
  return mises_proxy_pattern.MatchesURL(url);
}

}  // namespace brave
