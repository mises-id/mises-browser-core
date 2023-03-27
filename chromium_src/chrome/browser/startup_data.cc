#include "chrome/browser/startup_data.h"
#include "mises/browser/browser_context_keyed_service_factories.h"
#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"

#define ChromeBrowserMainExtraPartsProfiles mises

#include "src/chrome/browser/startup_data.cc"

#undef ChromeBrowserMainExtraPartsProfiles

