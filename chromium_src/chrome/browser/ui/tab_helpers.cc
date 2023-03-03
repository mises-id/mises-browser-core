#include "build/build_config.h"
#if BUILDFLAG(IS_ANDROID)

#include "chrome/browser/ui/search/search_tab_helper.h"
#include "chrome/browser/plugins/plugin_observer_android.h"
#define PluginObserverAndroid SearchTabHelper::CreateForWebContents(web_contents);\
    PluginObserverAndroid
#include "src/chrome/browser/ui/tab_helpers.cc"
#undef PluginObserverAndroid
#else
#include "src/chrome/browser/ui/tab_helpers.cc"
#endif

