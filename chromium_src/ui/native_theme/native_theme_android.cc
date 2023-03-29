#include "ui/native_theme/native_theme_android.h"

#define GetInstanceForNativeUi GetInstanceForNativeUi_Chromium
#include "src/ui/native_theme/native_theme_android.cc"
#undef GetInstanceForNativeUi


namespace ui {


NativeTheme* NativeTheme::GetInstanceForNativeUi() {
  return NativeThemeAndroid::instance();
}
NativeTheme* NativeTheme::GetInstanceForDarkUI() {
	  static base::NoDestructor<NativeThemeAndroid> s_native_theme;
	    return s_native_theme.get();
}



}  // namespace ui
