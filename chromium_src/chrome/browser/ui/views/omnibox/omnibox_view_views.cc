#include "chrome/browser/ui/views/omnibox/omnibox_popup_view_webui.h"
#define OmniboxPopupViewWebUI OmniboxPopupViewViews
#include "src/chrome/browser/ui/views/omnibox/omnibox_view_views.cc"
#undef OmniboxPopupViewWebUI

#if BUILDFLAG(IS_ANDROID)
std::u16string GetClipboardText(bool notify_if_restricted) {
  return std::u16string();
}

#endif