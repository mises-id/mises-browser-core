#ifndef MISES_BASE_ANDROID_ANDROID_IMAGE_READER_COMPAT_H_
#define MISES_BASE_ANDROID_ANDROID_IMAGE_READER_COMPAT_H_

#define IsSupported                                                \
  IsSupported_ChromiumImpl(); \
  bool IsSupported

#include "src/base/android/android_image_reader_compat.h"

#undef IsSupported
#endif