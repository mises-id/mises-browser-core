#include "components/permissions/request_type.h"

#if BUILDFLAG(IS_ANDROID)
#define kAccessibilityEvents \
  kCameraPanTiltZoom:\
      return RequestTypeForUma::PERMISSION_CAMERA_PAN_TILT_ZOOM;\
  case RequestType::kLocalFonts: \
      return RequestTypeForUma::PERMISSION_LOCAL_FONTS; \
  case RequestType::kRegisterProtocolHandler: \
    return RequestTypeForUma::REGISTER_PROTOCOL_HANDLER; \
  case RequestType::kSecurityAttestation: \
    return RequestTypeForUma::PERMISSION_SECURITY_KEY_ATTESTATION; \
  case RequestType::kU2fApiRequest: \
    return RequestTypeForUma::PERMISSION_U2F_API_REQUEST; \
  case RequestType::kWindowManagement: \
    return RequestTypeForUma::PERMISSION_WINDOW_MANAGEMENT; \
  case RequestType::kAccessibilityEvents
  
#include "src/components/permissions/permission_uma_util.cc"

#undef kAccessibilityEvents

#else

#include "src/components/permissions/permission_uma_util.cc"

#endif

