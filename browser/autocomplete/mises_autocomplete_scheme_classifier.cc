/* Copyright 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/autocomplete/mises_autocomplete_scheme_classifier.h"

#include <string>

#include "base/strings/string_util.h"
#include "mises/components/constants/url_constants.h"
#include "chrome/browser/profiles/profile.h"


MisesAutocompleteSchemeClassifier::MisesAutocompleteSchemeClassifier(
    Profile* profile)
    : ChromeAutocompleteSchemeClassifier(profile) {

}

MisesAutocompleteSchemeClassifier::~MisesAutocompleteSchemeClassifier() =
    default;

// Without this override, typing in brave:// URLs will search Google
metrics::OmniboxInputType
MisesAutocompleteSchemeClassifier::GetInputTypeForScheme(
    const std::string& scheme) const {
  if (scheme.empty()) {
    return metrics::OmniboxInputType::EMPTY;
  }
  if (base::IsStringASCII(scheme) &&
      base::EqualsCaseInsensitiveASCII(scheme, kMisesUIScheme)) {
    return metrics::OmniboxInputType::URL;
  }
  return ChromeAutocompleteSchemeClassifier::GetInputTypeForScheme(scheme);
}
