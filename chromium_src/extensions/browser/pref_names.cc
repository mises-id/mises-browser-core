#include "src/extensions/browser/pref_names.cc"


namespace extensions {
namespace pref_names {
#if BUILDFLAG(IS_ANDROID) 
extern const char kChromeAppsEnabled[] = "extensions.chrome_apps_enabled";
#endif

}  // namespace pref_names
}  // namespace extensions
