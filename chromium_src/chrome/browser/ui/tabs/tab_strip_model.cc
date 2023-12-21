#ifndef MISES_BROWSER_UI_TABS_TAB_STRIP_MODEL_CC_
#define MISES_BROWSER_UI_TABS_TAB_STRIP_MODEL_CC_

#include "build/build_config.h"

#include "chrome/browser/ui/tabs/tab_model.h"
#include "chrome/browser/ui/tabs/tab_strip_model.h"

#if BUILDFLAG(IS_ANDROID)


#include "third_party/perfetto/include/perfetto/tracing/traced_value.h"

TabModelDesktop::TabModelDesktop(std::unique_ptr<content::WebContents> contents)
    : contents_(std::move(contents)) {}

TabModelDesktop::~TabModelDesktop() = default;

void TabModelDesktop::WriteIntoTrace(perfetto::TracedValue context) const {
  auto dict = std::move(context).WriteDictionary();
  dict.Add("web_contents", contents());
  dict.Add("pinned", pinned());
  dict.Add("blocked", blocked());
}

#define TabModel TabModelDesktop


#include "src/chrome/browser/ui/tabs/tab_strip_model.cc"


#undef TabModel

#else

#include "src/chrome/browser/ui/tabs/tab_strip_model.cc"


#endif


#endif  // CHROME_BROWSER_UI_TABS_TAB_STRIP_MODEL_CC_
