#include "build/build_config.h"
#if !BUILDFLAG(IS_ANDROID)
#include "src/chrome/browser/ui/singleton_tabs.cc"
#else
#include "chrome/browser/ui/singleton_tabs.h"
#define ShowSingletonTabOverwritingNTP ShowSingletonTabOverwritingNTP_Chromium
#include "src/chrome/browser/ui/singleton_tabs.cc"
#undef ShowSingletonTabOverwritingNTP

void ShowSingletonTabOverwritingNTP(Browser* browser, NavigateParams* params) {
  Navigate(params);
}

#endif