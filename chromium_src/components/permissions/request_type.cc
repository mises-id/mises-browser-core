#include "src/components/permissions/request_type.cc"

#if BUILDFLAG(IS_ANDROID)
namespace permissions {
IconId GetBlockedIconId(RequestType type) {
  return permissions::GetIconId(type);
}
}
#endif