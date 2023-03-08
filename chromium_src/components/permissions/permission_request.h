#ifndef MISES_COMPONENTS_PERMISSIONS_PERMISSION_REQUEST_H_
#define MISES_COMPONENTS_PERMISSIONS_PERMISSION_REQUEST_H_

#include <string>

#include "base/callback.h"
#include "build/build_config.h"
#include "components/content_settings/core/common/content_settings.h"
#include "components/content_settings/core/common/content_settings_types.h"
#include "components/permissions/permission_request_enums.h"
#include "components/permissions/request_type.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "url/gurl.h"

#if BUILDFLAG(IS_ANDROID)
#define GetDialogMessageText\
  GetMessageTextFragment() const;\
  IconId GetIconForChip();\
  IconId GetBlockedIconForChip();\
  absl::optional<std::u16string> GetRequestChipText() const;\
  absl::optional<std::u16string> GetQuietChipText() const;\
  virtual std::u16string GetDialogMessageText

#include "src/components/permissions/permission_request.h"

#undef GetDialogMessageText

#else
#include "src/components/permissions/permission_request.h"
#endif


#endif  // COMPONENTS_PERMISSIONS_PERMISSION_REQUEST_H_
