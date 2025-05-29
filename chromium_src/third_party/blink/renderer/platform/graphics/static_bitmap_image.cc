#include "base/rand_util.h"
#include "base/logging.h"
#include "base/command_line.h"
#include "third_party/blink/renderer/platform/runtime_enabled_features.h"
#include "third_party/skia/include/private/SkColorData.h"
#include "mises/components/ungoogled/ungoogled_switches.h"

#include "src/third_party/blink/renderer/platform/graphics/static_bitmap_image.cc"

namespace blink {

// set the component to maximum-delta if it is >= maximum, or add to existing color component (color + delta)
#define shuffleComponent(color, max, delta) ( (color) >= (max) ? ((max)-(delta)) : ((color)+(delta)) )

#define writable_addr(T, p, stride, x, y) (T*)((const char *)p + y * stride + x * sizeof(T))

namespace {
   uint32_t GetFNVHash(uint32_t val, uint32_t seed) {
      constexpr uint32_t FNV_PRIME = 16777619u;
      constexpr uint32_t FNV_OFFSET = 2166136261u;
    
      uint32_t hash = FNV_OFFSET;
      hash ^= seed;
      hash *= FNV_PRIME;
      hash ^= val;
      hash *= FNV_PRIME;
    
      return hash;
    }
    
    double GetNormalizedHash(uint32_t hash) {
      return (hash & 0xFFFFFFFF) / 4294967295.0;
    }
}


void ShuffleSubchannelColorData(const void *addr, const SkImageInfo& info, int srcX, int srcY) {
  auto w = info.width() - srcX, h = info.height() - srcY;

  // skip tiny images; info.width()/height() can also be 0
  if ((w < 8) || (h < 8)) {
    return;
  }

  const base::CommandLine* command_line = base::CommandLine::ForCurrentProcess();
  uint32_t seed = 0;
  if (command_line->HasSwitch(switches::kFingerprint)) {
    std::string seed_str = command_line->GetSwitchValueASCII(switches::kFingerprint);
    seed = static_cast<uint32_t>(std::stoul(seed_str));
  }
  uint32_t hash_x = GetFNVHash(w, seed);
  double shuffleX = GetNormalizedHash(hash_x);

  // cap maximum pixels to change
  auto pixels = (w + h) / 128;
  if (pixels > 10) {
    pixels = 10;
  } else if (pixels < 2) {
    pixels = 2;
  }

  auto colorType = info.colorType();
  auto fRowBytes = info.minRowBytes(); // stride

  DLOG(INFO) << "BRM: ShuffleSubchannelColorData() w=" << w << " h=" << h << " colorType=" << colorType << " fRowBytes=" << fRowBytes;

  uint32_t hash_y = GetFNVHash(h, ~seed);  
  double shuffleY = GetNormalizedHash(hash_y);

  // calculate random coordinates using bisection
  auto currentW = w, currentH = h;
  for(;pixels >= 0; pixels--) {
    int x = currentW * shuffleX, y = currentH * shuffleY;

    // calculate randomisation amounts for each RGB component
    uint8_t shuffleR = seed % 4;
    uint8_t shuffleG = (shuffleR + x) % 4;
    uint8_t shuffleB = (shuffleG + y) % 4;

    // manipulate pixel data to slightly change the R, G, B components
    switch (colorType) {
      case kAlpha_8_SkColorType:
      {
         auto *pixel = writable_addr(uint8_t, addr, fRowBytes, x, y);
         auto r = SkColorGetR(*pixel), g = SkColorGetG(*pixel), b = SkColorGetB(*pixel), a = SkColorGetA(*pixel);

         r = shuffleComponent(r, UINT8_MAX-1, shuffleR);
         g = shuffleComponent(g, UINT8_MAX-1, shuffleG);
         b = shuffleComponent(b, UINT8_MAX-1, shuffleB);
         // alpha is left unchanged

         *pixel = SkColorSetARGB(a, r, g, b);
      }
      break;
      case kGray_8_SkColorType:
      {
         auto *pixel = writable_addr(uint8_t, addr, fRowBytes, x, y);
         *pixel = shuffleComponent(*pixel, UINT8_MAX-1, shuffleB);
      }
      break;
      case kRGB_565_SkColorType:
      {
         auto *pixel = writable_addr(uint16_t, addr, fRowBytes, x, y);
         unsigned    r = SkPacked16ToR32(*pixel);
         unsigned    g = SkPacked16ToG32(*pixel);
         unsigned    b = SkPacked16ToB32(*pixel);

         r = shuffleComponent(r, 31, shuffleR);
         g = shuffleComponent(g, 63, shuffleG);
         b = shuffleComponent(b, 31, shuffleB);

         unsigned r16 = (r & SK_R16_MASK) << SK_R16_SHIFT;
         unsigned g16 = (g & SK_G16_MASK) << SK_G16_SHIFT;
         unsigned b16 = (b & SK_B16_MASK) << SK_B16_SHIFT;

         *pixel = r16 | g16 | b16;
      }
      break;
      case kARGB_4444_SkColorType:
      {
         auto *pixel = writable_addr(uint16_t, addr, fRowBytes, x, y);
         auto a = SkGetPackedA4444(*pixel), r = SkGetPackedR4444(*pixel), g = SkGetPackedG4444(*pixel), b = SkGetPackedB4444(*pixel);

         r = shuffleComponent(r, 15, shuffleR);
         g = shuffleComponent(g, 15, shuffleG);
         b = shuffleComponent(b, 15, shuffleB);
         // alpha is left unchanged

         unsigned a4 = (a & 0xF) << SK_A4444_SHIFT;
         unsigned r4 = (r & 0xF) << SK_R4444_SHIFT;
         unsigned g4 = (g & 0xF) << SK_G4444_SHIFT;
         unsigned b4 = (b & 0xF) << SK_B4444_SHIFT;

         *pixel = r4 | b4 | g4 | a4;
      }
      break;
      case kRGBA_8888_SkColorType:
      {
         auto *pixel = writable_addr(uint32_t, addr, fRowBytes, x, y);
         auto a = SkGetPackedA32(*pixel), r = SkGetPackedR32(*pixel), g = SkGetPackedG32(*pixel), b = SkGetPackedB32(*pixel);

         r = shuffleComponent(r, UINT8_MAX-1, shuffleR);
         g = shuffleComponent(g, UINT8_MAX-1, shuffleG);
         b = shuffleComponent(b, UINT8_MAX-1, shuffleB);
         // alpha is left unchanged

         *pixel = (a << SK_A32_SHIFT) | (r << SK_R32_SHIFT) |
                  (g << SK_G32_SHIFT) | (b << SK_B32_SHIFT);
      }
      break;
      case kBGRA_8888_SkColorType:
      {
         auto *pixel = writable_addr(uint32_t, addr, fRowBytes, x, y);
         auto a = SkGetPackedA32(*pixel), b = SkGetPackedR32(*pixel), g = SkGetPackedG32(*pixel), r = SkGetPackedB32(*pixel);

         r = shuffleComponent(r, UINT8_MAX-1, shuffleR);
         g = shuffleComponent(g, UINT8_MAX-1, shuffleG);
         b = shuffleComponent(b, UINT8_MAX-1, shuffleB);
         // alpha is left unchanged

         *pixel = (a << SK_BGRA_A32_SHIFT) | (r << SK_BGRA_R32_SHIFT) |
                  (g << SK_BGRA_G32_SHIFT) | (b << SK_BGRA_B32_SHIFT);
      }
      break;
      default:
         // the remaining formats are not expected to be used in Chromium
         LOG(WARNING) << "BRM: ShuffleSubchannelColorData(): Ignoring pixel format";
         return;
    }

    // keep bisecting or reset current width/height as needed
    if (x == 0) {
       currentW = w;
    } else {
       currentW = x;
    }
    if (y == 0) {
       currentH = h;
    } else {
       currentH = y;
    }
  }
}

#undef writable_addr
#undef shuffleComponent

}  // namespace blink