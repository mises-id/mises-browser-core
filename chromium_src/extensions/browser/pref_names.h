#ifndef MISES_EXTENSIONS_BROWSER_PREF_NAMES_H_
#define MISES_EXTENSIONS_BROWSER_PREF_NAMES_H_

#include "src/extensions/browser/pref_names.h"

// Preference keys which are needed by both the ExtensionPrefs and by external
// clients, such as APIs.

namespace extensions {
namespace pref_names {


#if BUILDFLAG(IS_ANDROID) 
// A preference for whether Chrome Apps should be allowed. The default depends
// on the ChromeAppsDeprecation feature flag, and this pref can extend support
// for Chrome Apps by enterprise policy.
extern const char kChromeAppsEnabled[];
#endif


}  // namespace pref_names
}  // namespace extensions

#endif  // EXTENSIONS_BROWSER_PREF_NAMES_H_
