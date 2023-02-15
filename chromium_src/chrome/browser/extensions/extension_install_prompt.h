#ifndef MISES_BROWSER_EXTENSIONS_EXTENSION_INSTALL_PROMPT_H_
#define MISES_BROWSER_EXTENSIONS_EXTENSION_INSTALL_PROMPT_H_

#define GetUserCount GetPermissionsAsString() const; \
  std::u16string GetUserCount

#define show_dialog_callback_ show_dialog_callback_;\
  content::WebContents* contents_

#include "src/chrome/browser/extensions/extension_install_prompt.h"

#undef show_dialog_callback_
#undef GetUserCount

#endif