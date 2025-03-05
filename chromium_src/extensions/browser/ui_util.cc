#include "extensions/browser/ui_util.h"
#include "extensions/common/constants.h"

#define ShouldDisplayInExtensionSettings ShouldDisplayInExtensionSettings_Chromium
#include "src/extensions/browser/ui_util.cc"
#undef  ShouldDisplayInExtensionSettings

namespace extensions {
namespace ui_util {

bool ShouldDisplayInExtensionSettings(Manifest::Type type,
                                      mojom::ManifestLocation location) {
  //for test mises_extension_id
  if (Manifest::IsComponentLocation(location)) {
    return true;
  }
  return ShouldDisplayInExtensionSettings_Chromium(type, location);
}

bool ShouldDisplayInExtensionSettings(const Extension& extension) {
  //for test mises_extension_id
  if (Manifest::IsComponentLocation(extension.location())) {
    return true;
  }
  return ShouldDisplayInExtensionSettings_Chromium(extension.GetType(),
                                          extension.location());
}

}  // namespace ui_util
}  // namespace extensions
