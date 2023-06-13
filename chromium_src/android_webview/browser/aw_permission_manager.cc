#include "components/permissions/permission_util.h"
#include "third_party/blink/public/common/permissions/permission_utils.h"

#define NUM \
   MISES_ETHEREUM:                   \
  case PermissionType::MISES_SOLANA:               \
  case PermissionType::NUM
  
#include "src/android_webview/browser/aw_permission_manager.cc"
#undef NUM
