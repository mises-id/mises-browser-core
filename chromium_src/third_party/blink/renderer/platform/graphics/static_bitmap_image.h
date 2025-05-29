#ifndef MISES_THIRD_PARTY_BLINK_RENDERER_PLATFORM_GRAPHICS_STATIC_BITMAP_IMAGE_H_
#define MISES_THIRD_PARTY_BLINK_RENDERER_PLATFORM_GRAPHICS_STATIC_BITMAP_IMAGE_H_

#include "third_party/blink/renderer/platform/platform_export.h"
#include "src/third_party/blink/renderer/platform/graphics/static_bitmap_image.h"

namespace blink {
  PLATFORM_EXPORT void ShuffleSubchannelColorData(const void *addr, const SkImageInfo& info, int srcX, int srcY);
}

#endif