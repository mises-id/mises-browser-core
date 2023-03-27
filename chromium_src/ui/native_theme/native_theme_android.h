#ifndef MISES_UI_NATIVE_THEME_NATIVE_THEME_ANDROID_H_
#define MISES_UI_NATIVE_THEME_NATIVE_THEME_ANDROID_H_


#define GetInstanceForNativeUi GetInstanceForNativeUi_Chromium();\
  NativeTheme* GetInstanceForNativeUi
#include "src/ui/native_theme/native_theme_android.h"
#undef GetInstanceForNativeUi


#endif  // UI_NATIVE_THEME_NATIVE_THEME_ANDROID_H_
