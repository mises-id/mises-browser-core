/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_CONSTANTS_BRAVE_SERVICES_KEY_HELPER_H_
#define BRAVE_COMPONENTS_CONSTANTS_BRAVE_SERVICES_KEY_HELPER_H_

class GURL;

namespace mises {

bool ShouldAddMisesServicesKeyHeader(const GURL& url);

}  // namespace mises

#endif  // BRAVE_COMPONENTS_CONSTANTS_BRAVE_SERVICES_KEY_HELPER_H_
