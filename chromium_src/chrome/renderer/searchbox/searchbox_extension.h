#ifndef MISES_RENDERER_SEARCHBOX_SEARCHBOX_EXTENSION_H_
#define MISES_RENDERER_SEARCHBOX_SEARCHBOX_EXTENSION_H_


#define DispatchThemeChange\
    DispatchMisesInfoChanged(blink::WebLocalFrame* frame, const std::u16string& info);\
    static void DispatchThemeChange

#include "src/chrome/renderer/searchbox/searchbox_extension.h"
#undef DispatchThemeChange

#endif  // CHROME_RENDERER_SEARCHBOX_SEARCHBOX_EXTENSION_H_
