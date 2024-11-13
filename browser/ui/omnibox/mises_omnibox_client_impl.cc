/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "mises/browser/ui/omnibox/mises_omnibox_client_impl.h"

#include "base/values.h"
#include "mises/browser/autocomplete/mises_autocomplete_scheme_classifier.h"
#include "mises/components/constants/pref_names.h"
#include "chrome/browser/browser_process.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/ui/omnibox/chrome_omnibox_client.h"
#include "components/omnibox/browser/autocomplete_match.h"
#include "components/omnibox/browser/autocomplete_result.h"
#include "components/omnibox/browser/omnibox_log.h"
#include "components/prefs/pref_registry_simple.h"
#include "components/prefs/pref_service.h"

namespace {

// using brave_search_conversion::ConversionType;
// using brave_search_conversion::GetConversionType;

// constexpr char kSearchCountPrefName[] = "brave.weekly_storage.search_count";

// bool IsSearchEvent(const AutocompleteMatch& match) {
//   switch (match.type) {
//     case AutocompleteMatchType::SEARCH_WHAT_YOU_TYPED:
//     case AutocompleteMatchType::SEARCH_HISTORY:
//     case AutocompleteMatchType::SEARCH_SUGGEST:
//     case AutocompleteMatchType::SEARCH_SUGGEST_ENTITY:
//     case AutocompleteMatchType::SEARCH_SUGGEST_TAIL:
//     case AutocompleteMatchType::SEARCH_SUGGEST_PERSONALIZED:
//     case AutocompleteMatchType::SEARCH_SUGGEST_PROFILE:
//     case AutocompleteMatchType::SEARCH_OTHER_ENGINE:
//       return true;
//     default:
//       return false;
//   }
// }

// void RecordSearchEventP3A(uint64_t number_of_searches) {
//   p3a_utils::RecordToHistogramBucket("Brave.Omnibox.SearchCount",
//                                      {0, 5, 10, 20, 50, 100, 500},
//                                      number_of_searches);
// }

}  // namespace

MisesOmniboxClientImpl::MisesOmniboxClientImpl(LocationBar* location_bar,
                                               Browser* browser,
                                               Profile* profile)
    : ChromeOmniboxClient(location_bar, browser, profile),
      profile_(profile),
      scheme_classifier_(profile){
}

MisesOmniboxClientImpl::~MisesOmniboxClientImpl() = default;

void MisesOmniboxClientImpl::RegisterProfilePrefs(
    PrefRegistrySimple* registry) {
  //registry->RegisterListPref(kSearchCountPrefName);
}

const AutocompleteSchemeClassifier&
MisesOmniboxClientImpl::GetSchemeClassifier() const {
  return scheme_classifier_;
}



void MisesOmniboxClientImpl::OnURLOpenedFromOmnibox(OmniboxLog* log) {
  // const auto match = log->result.match_at(log->selected_index);
  // if (IsBraveSearchPromotionMatch(match)) {
  //   brave_search_conversion::p3a::RecordPromoTrigger(
  //       g_browser_process->local_state(), GetConversionTypeFromMatch(match));
  // }
}
