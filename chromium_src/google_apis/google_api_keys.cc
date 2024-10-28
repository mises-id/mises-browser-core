#include "src/google_apis/google_api_keys.cc"

namespace google_apis {

#if BUILDFLAG(IS_ANDROID)
const std::string& GetHatsAPIKey() {
  return "";
}
#endif

}