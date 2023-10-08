#ifndef MISES_COMPONENTS_PERMISSIONS_PERMISSION_REQUEST_H_
#define MISES_COMPONENTS_PERMISSIONS_PERMISSION_REQUEST_H_

#include <string>

#include "base/functional/callback.h"
#include "build/build_config.h"
#include "components/content_settings/core/common/content_settings.h"
#include "components/content_settings/core/common/content_settings_types.h"
#include "components/permissions/permission_request_enums.h"
#include "components/permissions/request_type.h"
#include "third_party/abseil-cpp/absl/types/optional.h"
#include "url/gurl.h"

#include "base/time/time.h"

#define PermissionRequest PermissionRequest_ChromiumImpl
#define IsDuplicateOf IsDuplicateOf_ChromiumImpl

#if BUILDFLAG(IS_ANDROID)
#define GetDialogMessageText\
  GetMessageTextFragment() const;\
  bool IsConfirmationChipSupported();\
  IconId GetIconForChip();\
  IconId GetBlockedIconForChip();\
  absl::optional<std::u16string> GetRequestChipText(ChipTextType type) const;\
  virtual std::u16string GetDialogMessageText

#include "src/components/permissions/permission_request.h"

#undef GetDialogMessageText

#else
#include "src/components/permissions/permission_request.h"
#endif


#undef IsDuplicateOf
#undef PermissionRequest


namespace permissions {

class PermissionRequest : public PermissionRequest_ChromiumImpl {
 public:
  PermissionRequest(const GURL& requesting_origin,
                    RequestType request_type,
                    bool has_gesture,
                    PermissionDecidedCallback permission_decided_callback,
                    base::OnceClosure delete_callback);

  PermissionRequest(const PermissionRequest&) = delete;
  PermissionRequest& operator=(const PermissionRequest&) = delete;

  ~PermissionRequest() override;

  bool SupportsLifetime() const;
  void SetLifetime(absl::optional<base::TimeDelta> lifetime);
  const absl::optional<base::TimeDelta>& GetLifetime() const;

  // We rename upstream's IsDuplicateOf() via a define above and re-declare it
  // here to workaround the fact that the PermissionRequest_ChromiumImpl rename
  // will affect this method's only parameter too, which will break subclasses.
  virtual bool IsDuplicateOf(PermissionRequest* other_request) const;

 private:
  absl::optional<base::TimeDelta> lifetime_;
};

}  // namespace permissions


#endif  // COMPONENTS_PERMISSIONS_PERMISSION_REQUEST_H_
