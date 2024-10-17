/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "components/search_engines/template_url_prepopulate_data.h"

#include <map>
#include <vector>

#include "base/containers/fixed_flat_map.h"
#include "base/containers/flat_map.h"
#include "base/no_destructor.h"
#include "base/stl_util.h"
#include "base/strings/utf_string_conversions.h"
#include "mises/components/search_engines/mises_prepopulated_engines.h"
#include "mises/components/search_engines/features.h"
#include "build/build_config.h"
#include "components/country_codes/country_codes.h"
#include "components/search_engines/search_engines_pref_names.h"


namespace TemplateURLPrepopulateData {

// This redeclaration of the upstream prototype for `GetPrepopulatedEngines` is
// necessary, otherwise the translation unit fails to compile on calls for
// `GetPrepopulatedEngines` where there's an expectation for the use of the
// default value of the last two arguents.
std::vector<std::unique_ptr<TemplateURLData>> GetPrepopulatedEngines_Unused(
    PrefService* prefs,
    search_engines::SearchEngineChoiceService* search_engine_choice_service);

}  // namespace TemplateURLPrepopulateData

#define GetDataVersion GetDataVersion_ChromiumImpl
#if BUILDFLAG(IS_ANDROID)
#define GetLocalPrepopulatedEngines GetLocalPrepopulatedEngines_Unused
#endif
#define GetPrepopulatedFallbackSearch GetPrepopulatedFallbackSearch_Unused
#define GetPrepopulatedEngine GetPrepopulatedEngine_Unused
#define GetPrepopulatedEngines GetPrepopulatedEngines_Unused
#include "src/components/search_engines/template_url_prepopulate_data.cc"
#undef GetDataVersion
#if BUILDFLAG(IS_ANDROID)
#undef GetLocalPrepopulatedEngines
#endif
#undef GetPrepopulatedFallbackSearch
#undef GetPrepopulatedEngine
#undef GetPrepopulatedEngines

namespace TemplateURLPrepopulateData {

namespace {

// Default order in which engines will appear in the UI.
constexpr MisesPrepopulatedEngineID kMisesEnginesDefault[] = {
    PREPOPULATED_ENGINE_ID_MISES,      PREPOPULATED_ENGINE_ID_GOOGLE,
    PREPOPULATED_ENGINE_ID_DUCKDUCKGO, PREPOPULATED_ENGINE_ID_QWANT,
    PREPOPULATED_ENGINE_ID_BING,       PREPOPULATED_ENGINE_ID_STARTPAGE,
};

// Variations of the order / default options by country.
constexpr MisesPrepopulatedEngineID kMisesEnginesWithEcosia[] = {
    PREPOPULATED_ENGINE_ID_MISES,      PREPOPULATED_ENGINE_ID_GOOGLE,
    PREPOPULATED_ENGINE_ID_DUCKDUCKGO, PREPOPULATED_ENGINE_ID_QWANT,
    PREPOPULATED_ENGINE_ID_BING,       PREPOPULATED_ENGINE_ID_STARTPAGE,
    PREPOPULATED_ENGINE_ID_ECOSIA,
};

constexpr MisesPrepopulatedEngineID kMisesEnginesWithYandex[] = {
    PREPOPULATED_ENGINE_ID_YANDEX,    PREPOPULATED_ENGINE_ID_MISES,
    PREPOPULATED_ENGINE_ID_GOOGLE,    PREPOPULATED_ENGINE_ID_DUCKDUCKGO,
    PREPOPULATED_ENGINE_ID_QWANT,     PREPOPULATED_ENGINE_ID_BING,
    PREPOPULATED_ENGINE_ID_STARTPAGE,
};

constexpr MisesPrepopulatedEngineID kMisesEnginesDE[] = {
    PREPOPULATED_ENGINE_ID_MISES,  PREPOPULATED_ENGINE_ID_DUCKDUCKGO_DE,
    PREPOPULATED_ENGINE_ID_QWANT,  PREPOPULATED_ENGINE_ID_GOOGLE,
    PREPOPULATED_ENGINE_ID_BING,   PREPOPULATED_ENGINE_ID_STARTPAGE,
    PREPOPULATED_ENGINE_ID_ECOSIA,
};

constexpr MisesPrepopulatedEngineID kMisesEnginesFR[] = {
    PREPOPULATED_ENGINE_ID_MISES,  PREPOPULATED_ENGINE_ID_QWANT,
    PREPOPULATED_ENGINE_ID_GOOGLE, PREPOPULATED_ENGINE_ID_DUCKDUCKGO,
    PREPOPULATED_ENGINE_ID_BING,   PREPOPULATED_ENGINE_ID_STARTPAGE,
    PREPOPULATED_ENGINE_ID_ECOSIA,
};

constexpr MisesPrepopulatedEngineID kMisesEnginesAUIE[] = {
    PREPOPULATED_ENGINE_ID_MISES,  PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE,
    PREPOPULATED_ENGINE_ID_GOOGLE, PREPOPULATED_ENGINE_ID_QWANT,
    PREPOPULATED_ENGINE_ID_BING,   PREPOPULATED_ENGINE_ID_STARTPAGE,
    PREPOPULATED_ENGINE_ID_ECOSIA,
};

constexpr MisesPrepopulatedEngineID kMisesEnginesKR[] = {
    PREPOPULATED_ENGINE_ID_MISES,
    PREPOPULATED_ENGINE_ID_NAVER,
    PREPOPULATED_ENGINE_ID_DAUM,
    PREPOPULATED_ENGINE_ID_GOOGLE,
};

constexpr MisesPrepopulatedEngineID kMisesEnginesNZ[] = {
    PREPOPULATED_ENGINE_ID_MISES,  PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE,
    PREPOPULATED_ENGINE_ID_GOOGLE, PREPOPULATED_ENGINE_ID_QWANT,
    PREPOPULATED_ENGINE_ID_BING,   PREPOPULATED_ENGINE_ID_STARTPAGE,
};

// A map to keep track of a full list of default engines for countries
// that don't use the default list.
constexpr auto kDefaultEnginesByCountryIdMap =
    base::MakeFixedFlatMap<int,
                                 base::span<const MisesPrepopulatedEngineID>>(
        {{country_codes::CountryCharsToCountryID('A', 'M'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('A', 'T'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('A', 'U'), kMisesEnginesAUIE},
         {country_codes::CountryCharsToCountryID('A', 'Z'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('B', 'E'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('B', 'Y'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('C', 'A'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('C', 'H'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('D', 'E'), kMisesEnginesDE},
         {country_codes::CountryCharsToCountryID('D', 'K'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('E', 'S'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('F', 'I'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('F', 'R'), kMisesEnginesFR},
         {country_codes::CountryCharsToCountryID('G', 'B'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('G', 'R'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('H', 'U'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('I', 'E'), kMisesEnginesAUIE},
         {country_codes::CountryCharsToCountryID('I', 'T'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('K', 'G'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('K', 'R'), kMisesEnginesKR},
         {country_codes::CountryCharsToCountryID('K', 'Z'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('L', 'U'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('M', 'D'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('N', 'L'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('N', 'O'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('N', 'Z'), kMisesEnginesNZ},
         {country_codes::CountryCharsToCountryID('P', 'T'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('R', 'U'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('S', 'E'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('T', 'J'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('T', 'M'),
          kMisesEnginesWithYandex},
         {country_codes::CountryCharsToCountryID('U', 'S'),
          kMisesEnginesWithEcosia},
         {country_codes::CountryCharsToCountryID('U', 'Z'),
          kMisesEnginesWithYandex}});

// A versioned map tracking the singular default search engine per-country.
MisesPrepopulatedEngineID GetDefaultSearchEngine(int country_id, int version) {
  const MisesPrepopulatedEngineID default_v6 = PREPOPULATED_ENGINE_ID_MISES;
  static constexpr auto kContentV6 =
      base::MakeFixedFlatMap<int, MisesPrepopulatedEngineID>({
          {country_codes::CountryCharsToCountryID('A', 'U'),
           PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE},
          {country_codes::CountryCharsToCountryID('D', 'E'),
           PREPOPULATED_ENGINE_ID_DUCKDUCKGO_DE},
          {country_codes::CountryCharsToCountryID('F', 'R'),
           PREPOPULATED_ENGINE_ID_QWANT},
          {country_codes::CountryCharsToCountryID('I', 'E'),
           PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE},
          {country_codes::CountryCharsToCountryID('N', 'Z'),
           PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE},
      });
  static constexpr auto kContentV8 =
      base::MakeFixedFlatMap<int, MisesPrepopulatedEngineID>({
          {country_codes::CountryCharsToCountryID('A', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('A', 'U'),
           PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE},
          {country_codes::CountryCharsToCountryID('A', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('B', 'Y'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('D', 'E'),
           PREPOPULATED_ENGINE_ID_DUCKDUCKGO_DE},
          {country_codes::CountryCharsToCountryID('F', 'R'),
           PREPOPULATED_ENGINE_ID_QWANT},
          {country_codes::CountryCharsToCountryID('I', 'E'),
           PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE},
          {country_codes::CountryCharsToCountryID('K', 'G'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('K', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'D'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('N', 'Z'),
           PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE},
          {country_codes::CountryCharsToCountryID('R', 'U'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'J'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('U', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
      });
  static constexpr auto kContentV16 =
      base::MakeFixedFlatMap<int, MisesPrepopulatedEngineID>({
          {country_codes::CountryCharsToCountryID('A', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('A', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('B', 'Y'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('F', 'R'),
           PREPOPULATED_ENGINE_ID_QWANT},
          {country_codes::CountryCharsToCountryID('K', 'G'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('K', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'D'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('R', 'U'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'J'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('U', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
      });
  static constexpr auto kContentV17 =
      base::MakeFixedFlatMap<int, MisesPrepopulatedEngineID>({
          {country_codes::CountryCharsToCountryID('A', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('A', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('B', 'Y'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('C', 'A'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('D', 'E'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('F', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('G', 'B'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('K', 'G'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('K', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'D'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('R', 'U'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'J'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('U', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('U', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
      });

  static constexpr auto kContentV20 =
      base::MakeFixedFlatMap<int, MisesPrepopulatedEngineID>({
          {country_codes::CountryCharsToCountryID('A', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('A', 'T'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('A', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('B', 'Y'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('C', 'A'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('D', 'E'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('E', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('F', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('G', 'B'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('K', 'G'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('K', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'D'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'X'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('R', 'U'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'J'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('U', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('U', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
      });

  static constexpr auto kContentV21 =
      base::MakeFixedFlatMap<int, MisesPrepopulatedEngineID>({
          {country_codes::CountryCharsToCountryID('A', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('A', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('A', 'T'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('A', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('B', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('B', 'Y'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('C', 'A'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('D', 'E'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('E', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('F', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('G', 'B'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('K', 'G'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('K', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'D'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'X'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('R', 'U'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'J'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('U', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('U', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
      });
  static constexpr auto kContentV22 =
      base::MakeFixedFlatMap<int, MisesPrepopulatedEngineID>({
          {country_codes::CountryCharsToCountryID('A', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('A', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('A', 'T'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('A', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('B', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('B', 'Y'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('C', 'A'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('D', 'E'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('E', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('F', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('G', 'B'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('I', 'N'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('K', 'G'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('K', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'D'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'X'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('R', 'U'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'J'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('U', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('U', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
      });
  static constexpr auto kContentV25 =
      base::MakeFixedFlatMap<int, MisesPrepopulatedEngineID>({
          {country_codes::CountryCharsToCountryID('A', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('A', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('A', 'T'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('A', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('B', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('B', 'Y'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('C', 'A'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('D', 'E'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('E', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('F', 'R'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('G', 'B'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('I', 'N'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('K', 'G'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('K', 'R'),
           PREPOPULATED_ENGINE_ID_NAVER},
          {country_codes::CountryCharsToCountryID('K', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'D'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('M', 'X'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('R', 'U'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'J'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('T', 'M'),
           PREPOPULATED_ENGINE_ID_YANDEX},
          {country_codes::CountryCharsToCountryID('U', 'S'),
           PREPOPULATED_ENGINE_ID_MISES},
          {country_codes::CountryCharsToCountryID('U', 'Z'),
           PREPOPULATED_ENGINE_ID_YANDEX},
      });

  if (version > 24) {
    const auto it = kContentV25.find(country_id);
    if (it == kContentV25.end()) {
      return default_v6;
    }
    return it->second;
  } else if (version > 21) {
    const auto it = kContentV22.find(country_id);
    if (it == kContentV22.end()) {
      return default_v6;
    }
    return it->second;
  } else if (version > 20) {
    const auto it = kContentV21.find(country_id);
    if (it == kContentV21.end()) {
      return default_v6;
    }
    return it->second;
  } else if (version > 19) {
    const auto it = kContentV20.find(country_id);
    if (it == kContentV20.end()) {
      return default_v6;
    }
    return it->second;
  } else if (version > 16) {
    const auto it = kContentV17.find(country_id);
    if (it == kContentV17.end()) {
      return default_v6;
    }
    return it->second;
  } else if (version > 15) {
    const auto it = kContentV16.find(country_id);
    if (it == kContentV16.end()) {
      return default_v6;
    }
    return it->second;
  } else if (version > 7) {
    const auto it = kContentV8.find(country_id);
    if (it == kContentV8.end()) {
      return default_v6;
    }
    return it->second;
  } else {
    const auto it = kContentV6.find(country_id);
    if (it == kContentV6.end()) {
      return default_v6;
    }
    return it->second;
  }
}


bool isMisesSearchEnabled() {
  bool enabled =  base::FeatureList::IsEnabled(search_engines::features::kMisesSearch);
  return enabled;
}

// Builds a vector of PrepulatedEngine objects from the given array of
// |engine_ids|. Fills in the default engine index for the given |country_id|,
// if asked.
std::vector<const PrepopulatedEngine*> GetEnginesFromEngineIDs(
    base::span<const MisesPrepopulatedEngineID> engine_ids) {
  std::vector<const PrepopulatedEngine*> engines;
  const auto& mises_engines_map =
      TemplateURLPrepopulateData::GetMisesEnginesMap();

  for (size_t i = 0; i < engine_ids.size(); ++i) {
    MisesPrepopulatedEngineID engine_id = engine_ids[i];
    if (!isMisesSearchEnabled()) {
      if (engine_id == PREPOPULATED_ENGINE_ID_MISES) {
        engine_id = PREPOPULATED_ENGINE_ID_GOOGLE;
      }
    }
    const PrepopulatedEngine* engine = mises_engines_map.at(engine_ids[i]);
    CHECK(engine);
    engines.push_back(engine);
  }
  return engines;
}

void UpdateTemplateURLDataKeyword(
    const std::unique_ptr<TemplateURLData>& t_urld) {
  DCHECK(t_urld.get());
  switch (t_urld->prepopulate_id) {
    case PREPOPULATED_ENGINE_ID_GOOGLE:
      t_urld->SetKeyword(u":g");
      break;
    case PREPOPULATED_ENGINE_ID_BING:
      t_urld->SetKeyword(u":b");
      break;
  }
}

// Uses brave_engines_XX localized arrays of engine IDs instead of Chromium's
// localized arrays of PrepopulatedEngines to construct the vector of
// TemplateURLData. Also, fills in the default engine index for the given
// |country_id|.
std::vector<std::unique_ptr<TemplateURLData>>
GetMisesPrepopulatedEnginesForCountryID(
    int country_id,
    int version = kMisesCurrentDataVersion) {
  base::span<const MisesPrepopulatedEngineID> mises_engine_ids =
      kMisesEnginesDefault;

  // Check for a per-country override of this list
  const auto it_country = kDefaultEnginesByCountryIdMap.find(country_id);
  if (it_country != kDefaultEnginesByCountryIdMap.end()) {
    mises_engine_ids = it_country->second;
  }
  DCHECK_GT(mises_engine_ids.size(), 0ul);

  // Build a vector PrepopulatedEngines from MisesPrepopulatedEngineIDs and
  // also get the default engine index
  std::vector<const PrepopulatedEngine*> engines =
      GetEnginesFromEngineIDs(mises_engine_ids);
  DCHECK(engines.size() == mises_engine_ids.size());

  std::vector<std::unique_ptr<TemplateURLData>> t_urls;
  for (const PrepopulatedEngine* engine : engines) {
    std::unique_ptr<TemplateURLData> t_urld =
        TemplateURLDataFromPrepopulatedEngine(*engine);
    UpdateTemplateURLDataKeyword(t_urld);
    t_urls.push_back(std::move(t_urld));
  }

  return t_urls;
}

}  // namespace

// Redefines function with the same name in Chromium. We need to account for
// the version of Brave engines as well: kCurrentDataVersion is defined in
// prepopulated_engines.json and is bumped every time the json file is
// modified. Since we add our own engines we need to keep track of our
// version as well and combine it with Chromium's version.
int GetDataVersion(PrefService* prefs) {
  int data_version = GetDataVersion_ChromiumImpl(prefs);
  // Check if returned version was from preferences override and if so return
  // that version.
  if (prefs && prefs->HasPrefPath(prefs::kSearchProviderOverridesVersion))
    return data_version;
  return (data_version + kMisesCurrentDataVersion);
}

// Redefines function with the same name in Chromium. Modifies the function to
// get search engines defined by Brave.
std::vector<std::unique_ptr<TemplateURLData>> GetPrepopulatedEngines(
    PrefService* prefs,
    search_engines::SearchEngineChoiceService* search_engine_choice_service) {
  // If there is a set of search engines in the preferences file, it overrides
  // the built-in set.
  std::vector<std::unique_ptr<TemplateURLData>> t_urls =
      GetOverriddenTemplateURLData(prefs);
  if (!t_urls.empty()) {
    return t_urls;
  }

  int version = kMisesCurrentDataVersion;
  if (prefs && prefs->HasPrefPath(prefs::kMisesDefaultSearchVersion)) {
    version = prefs->GetInteger(prefs::kMisesDefaultSearchVersion);
  }

  return GetMisesPrepopulatedEnginesForCountryID(
      search_engine_choice_service
          ? search_engine_choice_service->GetCountryId()
          : country_codes::GetCountryIDFromPrefs(prefs),
      version);
}

// Redefines function with the same name in Chromium. Modifies the function to
// get search engines defined by Brave.
#if BUILDFLAG(IS_ANDROID)

std::vector<std::unique_ptr<TemplateURLData>> GetLocalPrepopulatedEngines(
    const std::string& locale) {
  int country_id = country_codes::CountryStringToCountryID(locale);
  if (country_id == country_codes::kCountryIDUnknown) {
    LOG(ERROR) << "Unknown country code specified: " << locale;
    return std::vector<std::unique_ptr<TemplateURLData>>();
  }

  return GetMisesPrepopulatedEnginesForCountryID(country_id);
}

#endif



// Chromium picks Google (if on the list, otherwise the first prepopulated on
// the list). We should return the default engine by country, or Brave.
std::unique_ptr<TemplateURLData> GetPrepopulatedFallbackSearch(
    PrefService* prefs,
    search_engines::SearchEngineChoiceService* search_engine_choice_service) {
  std::vector<std::unique_ptr<TemplateURLData>> prepopulated_engines =
      GetPrepopulatedEngines(prefs, search_engine_choice_service);
  if (prepopulated_engines.empty()) {
    return nullptr;
  }

  // Get the default engine (overridable by country) for this version
  int version = kMisesCurrentDataVersion;
  // if (prefs && prefs->HasPrefPath(prefs::kMisesCurrentDataVersion)) {
  //   version = prefs->GetInteger(prefs::kMisesCurrentDataVersion);
  // }

  int country_id = search_engine_choice_service
                       ? search_engine_choice_service->GetCountryId()
                       : country_codes::GetCountryIDFromPrefs(prefs);

  MisesPrepopulatedEngineID default_id =
      GetDefaultSearchEngine(country_id, version);

  std::unique_ptr<TemplateURLData> mises_engine;
  for (auto& engine : prepopulated_engines) {
    if (engine->prepopulate_id == static_cast<int>(default_id)) {
      return std::move(engine);
    } else if (engine->prepopulate_id ==
               TemplateURLPrepopulateData::PREPOPULATED_ENGINE_ID_MISES) {
      mises_engine = std::move(engine);
    }
  }

  // Default engine wasn't found, then return Brave, if found.
  if (mises_engine) {
    return mises_engine;
  }

  // If all else fails, return the first engine on the list.
  return std::move(prepopulated_engines[0]);
}

// Functions below are copied verbatim from
// components\search_engines\template_url_prepopulate_data.cc because they
// need to call our versions of redefined Chromium's functions.

std::unique_ptr<TemplateURLData> GetPrepopulatedEngine(
    PrefService* prefs,
    search_engines::SearchEngineChoiceService* search_engine_choice_service,
    int prepopulated_id) {
  auto engines = TemplateURLPrepopulateData::GetPrepopulatedEngines(
      prefs, search_engine_choice_service);
  for (auto& engine : engines) {
    if (engine->prepopulate_id == prepopulated_id) {
      return std::move(engine);
    }
  }
  return nullptr;
}


}  // namespace TemplateURLPrepopulateData
