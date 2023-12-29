#include "src/google_apis/google_api_keys.h"

namespace google_apis {

#if BUILDFLAG(IS_ANDROID)
// Retrieves the HaTS API Key. This key is only used for desktop HaTS
// and the internal API Key is only defined in non-Android builds.
COMPONENT_EXPORT(GOOGLE_APIS) std::string GetHatsAPIKey();
#endif

}