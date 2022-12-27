#include "base/android/android_image_reader_compat.h"
#include "base/android/build_info.h"

namespace base {
namespace android {
bool AndroidImageReader::IsSupported() {
  //show mises extension in management list
  if (base::android::BuildInfo::GetInstance()->sdk_int() <
      base::android::SDK_VERSION_Q) {
    return false;
  }
  return AndroidImageReader::IsSupported_ChromiumImpl();
}
}
}
#define IsSupported IsSupported_ChromiumImpl

#include "src/base/android/android_image_reader_compat.cc"

#undef IsSupported
