#include "build/build_config.h"
#if !BUILDFLAG(IS_ANDROID)
#include "src/chrome/browser/ui/singleton_tabs.cc"
#else
#include "chrome/browser/ui/singleton_tabs.h"
#include "src/chrome/browser/ui/singleton_tabs.cc"

#endif