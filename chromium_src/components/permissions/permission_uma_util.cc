#include "components/permissions/request_type.h"

#include "components/permissions/permission_uma_util.h"

#include "components/permissions/permissions_client.h"

// Since we don't do UMA just reuse an existing UMA type instead of adding one.
#define MISES_GET_UMA_VALUE_FOR_REQUEST_TYPE      \
  case RequestType::kWidevine:                    \
  case RequestType::kMisesEthereum:               \
  case RequestType::kMisesSolana:                 \
    return RequestTypeForUma::PERMISSION_VR;

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

#undef MISES_GET_UMA_VALUE_FOR_REQUEST_TYPE
