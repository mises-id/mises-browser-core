/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/components/l10n/common/ofac_sanction_util.h"

#include "base/containers/contains.h"
#include <string_view>
#include "base/strings/string_util.h"
#include "mises/components/l10n/common/ofac_sanctioned_iso_3166_1_country_code_constants.h"
#include "mises/components/l10n/common/ofac_sanctioned_un_m49_code_constants.h"

namespace brave_l10n {

bool IsISOCountryCodeOFACSanctioned(const std::string_view country_code) {
  return base::Contains(kOFACSactionedISO31661CountryCodes,
                        base::ToUpperASCII(country_code));
}

bool IsUNM49CodeOFACSanctioned(const std::string_view code) {
  return base::Contains(kOFACSactionedUnM49Codes, code);
}

}  // namespace brave_l10n
