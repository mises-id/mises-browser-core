/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */


#include "mises/components/search_engines/mises_prepopulated_engines.h"
#include "components/search_engines/prepopulated_engines.h"
#include "components/search_engines/search_engine_type.h"

namespace TemplateURLPrepopulateData {

// IMPORTANT! Make sure to bump this value if you make changes to the
// engines below or add/remove engines.
const int kMisesCurrentDataVersion = 25;
// DO NOT CHANGE THIS ONE. Used for backfilling kMisesDefaultSearchVersion.
const int kMisesFirstTrackedDataVersion = 6;

namespace {

PrepopulatedEngine MakeMisesPrepopulatedEngine(const char16_t* const name,
                                               const char16_t* const keyword,
                                               const char* const favicon_url,
                                               const char* const search_url,
                                               const char* const encoding,
                                               const char* const suggest_url,
                                               SearchEngineType type,
                                               const int id) {
  return {name,    keyword, favicon_url, search_url, encoding, suggest_url,
          nullptr, nullptr, nullptr,     nullptr,    nullptr,  nullptr,
          nullptr, nullptr, nullptr,     nullptr,    nullptr,  nullptr,
          nullptr, nullptr, nullptr,     0,          nullptr,  0,
          type,    nullptr, nullptr,     id};
}

PrepopulatedEngine MakeGogglePrepopulatedEngine(const char16_t* const name,
                                               const char16_t* const keyword,
                                               const char* const favicon_url,
                                               const char* const search_url,
                                               const char* const encoding,
                                               const char* const suggest_url,
                                               SearchEngineType type,
                                               const int id) {
  return {name,    keyword, favicon_url, search_url, encoding, suggest_url,
          google.image_url, 
          google.image_translate_url, 
          google.new_tab_url,
          google.contextual_search_url,
          google.logo_url,
          google.doodle_url,
          google.search_url_post_params, 
          google.suggest_url_post_params, 
          google.image_url_post_params,     
          google.side_search_param,    
          google.side_image_search_param,  
          google.image_translate_source_language_param_key,
          google.image_translate_target_language_param_key,
          google.image_search_branding_label, 
          google.search_intent_params,     google.search_intent_params_size,          
          nullptr,  0,
          type,    nullptr, nullptr,     id};
}

// Maps MisesPrepopulatedEngineID to Chromium's PrepopulatedEngine.
const std::map<MisesPrepopulatedEngineID, const PrepopulatedEngine*>
    mises_engines_map = {
        {PREPOPULATED_ENGINE_ID_GOOGLE, &google},
        {PREPOPULATED_ENGINE_ID_YANDEX, &mises_yandex},
        {PREPOPULATED_ENGINE_ID_BING, &mises_bing},
        {PREPOPULATED_ENGINE_ID_NAVER, &naver},
        {PREPOPULATED_ENGINE_ID_DAUM, &daum},
        {PREPOPULATED_ENGINE_ID_DUCKDUCKGO, &mises_duckduckgo},
        {PREPOPULATED_ENGINE_ID_DUCKDUCKGO_DE, &duckduckgo_de},
        {PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE, &duckduckgo_au_nz_ie},
        {PREPOPULATED_ENGINE_ID_QWANT, &mises_qwant},
        {PREPOPULATED_ENGINE_ID_STARTPAGE, &startpage},
        {PREPOPULATED_ENGINE_ID_ECOSIA, &mises_ecosia},
        {PREPOPULATED_ENGINE_ID_MISES, &mises_search},
};

PrepopulatedEngine ModifyEngineParams(const PrepopulatedEngine& engine,
                                      const char16_t* const name,
                                      const char16_t* const keyword,
                                      const char* const search_url,
                                      const char* const suggest_url,
                                      const char* const image_url,
                                      int id) {
  return {name ? name : engine.name,
          keyword ? keyword : engine.keyword,
          engine.favicon_url,
          search_url ? search_url : engine.search_url,
          engine.encoding,
          suggest_url ? suggest_url : engine.suggest_url,
          image_url ? image_url : engine.image_url,
          engine.image_translate_url,
          engine.new_tab_url,
          engine.contextual_search_url,
          engine.logo_url,
          engine.doodle_url,
          engine.search_url_post_params,
          engine.suggest_url_post_params,
          engine.image_url_post_params,
          engine.side_search_param,
          engine.side_image_search_param,
          engine.image_translate_source_language_param_key,
          engine.image_translate_target_language_param_key,
          engine.image_search_branding_label,
          engine.search_intent_params,
          engine.search_intent_params_size,
          engine.alternate_urls,
          engine.alternate_urls_size,
          engine.type,
          engine.preconnect_to_search_url,
          engine.prefetch_likely_navigations,
          id > 0 ? id : engine.id};
}

}  // namespace

const PrepopulatedEngine mises_duckduckgo = MakeMisesPrepopulatedEngine(
    u"DuckDuckGo",
    u":d",
    "https://duckduckgo.com/favicon.ico",
    "https://duckduckgo.com/?q={searchTerms}&t=mises",
    "UTF-8",
    "https://ac.duckduckgo.com/ac/?q={searchTerms}&type=list",
    SEARCH_ENGINE_DUCKDUCKGO,
    PREPOPULATED_ENGINE_ID_DUCKDUCKGO);

const PrepopulatedEngine duckduckgo_de =
    ModifyEngineParams(duckduckgo,
                       nullptr,
                       nullptr,
                       "https://duckduckgo.com/?q={searchTerms}&t=misesned",
                       nullptr,
                       nullptr,
                       PREPOPULATED_ENGINE_ID_DUCKDUCKGO_DE);

const PrepopulatedEngine duckduckgo_au_nz_ie =
    ModifyEngineParams(duckduckgo,
                       nullptr,
                       nullptr,
                       "https://duckduckgo.com/?q={searchTerms}&t=misesed",
                       nullptr,
                       nullptr,
                       PREPOPULATED_ENGINE_ID_DUCKDUCKGO_AU_NZ_IE);

#if BUILDFLAG(IS_ANDROID)
const PrepopulatedEngine duckduckgo_lite = MakeMisesPrepopulatedEngine(
    u"DuckDuckGo Lite",
    u":du",
    "https://duckduckgo.com/favicon.ico",
    "https://duckduckgo.com/lite/?q={searchTerms}&t=mises",
    "UTF-8",
    "https://ac.duckduckgo.com/ac/?q={searchTerms}&type=list",
    SEARCH_ENGINE_DUCKDUCKGO,
    PREPOPULATED_ENGINE_ID_DUCKDUCKGO_LITE);
#endif  // BUILDFLAG(IS_ANDROID)

const PrepopulatedEngine mises_ecosia =
    ModifyEngineParams(ecosia,
                       nullptr,
                       u":e",
                       "https://www.ecosia.org/search?tt="
#if BUILDFLAG(IS_ANDROID)
                       "00000000"
#else
                       "00000000"
#endif
                       "&q={searchTerms}&addon=mises",
                       "https://ac.ecosia.org/?q={searchTerms}",
                       nullptr,
                       PREPOPULATED_ENGINE_ID_ECOSIA);

const PrepopulatedEngine mises_qwant = MakeMisesPrepopulatedEngine(
    u"Qwant",
    u":q",
    "https://www.qwant.com/favicon.ico",
    "https://www.qwant.com/?q={searchTerms}&client=brz-mises",
    "UTF-8",
    "https://api.qwant.com/api/suggest/?q={searchTerms}&client=opensearch",
    SEARCH_ENGINE_QWANT,
    PREPOPULATED_ENGINE_ID_QWANT);

const PrepopulatedEngine startpage = MakeMisesPrepopulatedEngine(
    u"Startpage",
    u":sp",
    "https://www.startpage.com/favicon.ico",
    "https://www.startpage.com/do/"
    "search?q={searchTerms}&segment=startpage.mises",
    "UTF-8",
    "https://www.startpage.com/cgi-bin/"
    "csuggest?query={searchTerms}&limit=10&format=json",
    SEARCH_ENGINE_OTHER,
    PREPOPULATED_ENGINE_ID_STARTPAGE);

const PrepopulatedEngine mises_yandex =
    ModifyEngineParams(yandex_com,
                       u"Yandex",
                       nullptr,
                       "https://yandex.ru/search/?clid="
#if BUILDFLAG(IS_ANDROID)
                       "0000000"
#else
                       "0000000"
#endif
                       "&text={searchTerms}",
                       "https://suggest.yandex.ru/suggest-ff.cgi?"
                       "part={searchTerms}&v=3&sn=5&srv=mises_desktop",
                       nullptr,
                       PREPOPULATED_ENGINE_ID_YANDEX);

const PrepopulatedEngine mises_search = MakeGogglePrepopulatedEngine(
    u"Google(Mises Optimized)",
    u":m",
    google.favicon_url,
    "https://search.mises.site/?q={searchTerms}&source="
    #if BUILDFLAG(IS_ANDROID)
        "android",
    #else
        "desktop",
    #endif
    "UTF-8",
    google.suggest_url,
    SEARCH_ENGINE_GOOGLE,
    PREPOPULATED_ENGINE_ID_MISES);

// const PrepopulatedEngine brave_search_tor = ModifyEngineParams(
//     brave_search,
//     nullptr,
//     u":search.brave4u7jddbv7cyviptqjc7jusxh72uik7zt6adtckl5f4nwy2v72qd.onion",
//     "https://"
//     "search.brave4u7jddbv7cyviptqjc7jusxh72uik7zt6adtckl5f4nwy2v72qd.onion/"
//     "search?q={searchTerms}",
//     "https://"
//     "search.brave4u7jddbv7cyviptqjc7jusxh72uik7zt6adtckl5f4nwy2v72qd.onion/api/"
//     "suggest?q={searchTerms}",
//     nullptr,
//     PREPOPULATED_ENGINE_ID_MISES_TOR);

const PrepopulatedEngine mises_bing = ModifyEngineParams(
    bing,
    nullptr,
    nullptr,
    "https://www.bing.com/search?q={searchTerms}",
    "https://www.bing.com/osjson.aspx?query={searchTerms}&language={language}",
    "https://www.bing.com/images/detail/search?iss=sbiupload#enterInsights",
    PREPOPULATED_ENGINE_ID_BING);

const std::map<MisesPrepopulatedEngineID, const PrepopulatedEngine*>&
GetMisesEnginesMap() {
  return mises_engines_map;
}

}  // namespace TemplateURLPrepopulateData
