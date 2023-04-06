#ifndef MISES_BROWSER_PROFILES_CHROME_BROWSER_MAIN_EXTRA_PARTS_PROFILES_H_
#define MISES_BROWSER_PROFILES_CHROME_BROWSER_MAIN_EXTRA_PARTS_PROFILES_H_

#include "chrome/browser/chrome_browser_main_extra_parts.h"

#define EnsureBrowserContextKeyedServiceFactoriesBuilt\
    EnsureBrowserContextKeyedServiceFactoriesBuiltAndroid();\
    void PreProfileInit_Chromium();\
    static void EnsureBrowserContextKeyedServiceFactoriesBuilt
#include "src/chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"
#undef EnsureBrowserContextKeyedServiceFactoriesBuilt


#endif  // CHROME_BROWSER_PROFILES_CHROME_BROWSER_MAIN_EXTRA_PARTS_PROFILES_H_
