#include "src/components/permissions/pref_names.h"


namespace permissions {
namespace prefs {
#if BUILDFLAG(IS_ANDROID)
inline constexpr char kUnusedSitePermissionsRevocationEnabled[] =
    "safety_hub.unused_site_permissions_revocation.enabled";
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)


}
}