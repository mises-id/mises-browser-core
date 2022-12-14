/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef MISES_BROWSER_AUTOCOMPLETE_BRAVE_AUTOCOMPLETE_SCHEME_CLASSIFIER_H_
#define MISES_BROWSER_AUTOCOMPLETE_BRAVE_AUTOCOMPLETE_SCHEME_CLASSIFIER_H_

#include <string>

#include "chrome/browser/autocomplete/chrome_autocomplete_scheme_classifier.h"

class MisesAutocompleteSchemeClassifier
    : public ChromeAutocompleteSchemeClassifier {
 public:
  explicit MisesAutocompleteSchemeClassifier(Profile* profile);
  MisesAutocompleteSchemeClassifier(const MisesAutocompleteSchemeClassifier&) =
      delete;
  MisesAutocompleteSchemeClassifier& operator=(
      const MisesAutocompleteSchemeClassifier&) = delete;
  ~MisesAutocompleteSchemeClassifier() override;

  metrics::OmniboxInputType GetInputTypeForScheme(
      const std::string& scheme) const override;

 private:
};

#endif  // BRAVE_BROWSER_AUTOCOMPLETE_BRAVE_AUTOCOMPLETE_SCHEME_CLASSIFIER_H_

