/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/l10n/browser/default_locale_util.h"

#import <Foundation/Foundation.h>

namespace brave_l10n {

std::optional<std::string> MaybeGetDefaultLocaleString() {
  const NSString* const locale = [[NSLocale preferredLanguages] firstObject];
  return locale.UTF8String;
}

}  // namespace brave_l10n
