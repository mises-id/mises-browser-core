/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_UI_OMNIBOX_BRAVE_OMNIBOX_CLIENT_IMPL_H_
#define BRAVE_BROWSER_UI_OMNIBOX_BRAVE_OMNIBOX_CLIENT_IMPL_H_

#include "base/memory/raw_ptr.h"
#include "mises/browser/autocomplete/mises_autocomplete_scheme_classifier.h"
#include "chrome/browser/ui/omnibox/chrome_omnibox_client.h"

class OmniboxEditController;
class PrefRegistrySimple;
class Profile;

class MisesOmniboxClientImpl : public OmniboxClient  {
 public:
  MisesOmniboxClientImpl(LocationBar* location_bar,
                         Browser* browser,
                         Profile* profile);
  MisesOmniboxClientImpl(const MisesOmniboxClientImpl&) = delete;
  MisesOmniboxClientImpl& operator=(const MisesOmniboxClientImpl&) = delete;
  ~MisesOmniboxClientImpl() override;

  static void RegisterProfilePrefs(PrefRegistrySimple* prefs);

  const AutocompleteSchemeClassifier& GetSchemeClassifier() const override;


  void OnURLOpenedFromOmnibox(OmniboxLog* log) override;

 private:
  raw_ptr<Profile> profile_ = nullptr;
  MisesAutocompleteSchemeClassifier scheme_classifier_;
};

#endif  // BRAVE_BROWSER_UI_OMNIBOX_BRAVE_OMNIBOX_CLIENT_IMPL_H_
