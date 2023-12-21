#include "src/google_apis/google_api_keys.cc"

namespace google_apis {

#if BUILDFLAG(IS_ANDROID)
std::string GetHatsAPIKey() {
  return DUMMY_API_TOKEN;
}
#endif

}