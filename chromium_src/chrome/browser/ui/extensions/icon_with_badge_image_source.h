#ifndef MISES_BROWSER_UI_EXTENSIONS_ICON_WITH_BADGE_IMAGE_SOURCE_H_
#define MISES_BROWSER_UI_EXTENSIONS_ICON_WITH_BADGE_IMAGE_SOURCE_H_


#include <optional>

namespace mises {
class MisesIconWithBadgeImageSource;
}

#define MISES_ICON_WITH_BADGE_IMAGE_SOURCE_H_            \
 private:                                                \
  friend class AppMenuBridge;\
  friend class mises::MisesIconWithBadgeImageSource;     \
  virtual std::optional<int> GetCustomGraphicSize();    \
  virtual std::optional<int> GetCustomGraphicXOffset(); \
  virtual std::optional<int> GetCustomGraphicYOffset(); \
                                                         \
 public:                                                 \
  // #define BRAVE_ICON_WITH_BADGE_IMAGE_SOURCE_H_

#define PaintBadge virtual PaintBadge
#define GetIconAreaRect virtual GetIconAreaRect



#include "src/chrome/browser/ui/extensions/icon_with_badge_image_source.h"

#undef GetIconAreaRect
#undef PaintBadge
#undef MISES_ICON_WITH_BADGE_IMAGE_SOURCE_H_



#endif  // CHROME_BROWSER_UI_EXTENSIONS_ICON_WITH_BADGE_IMAGE_SOURCE_H_
