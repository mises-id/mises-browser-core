#ifndef MISES_EXTENSIONS_BROWSER_EXTENSION_DIALOG_AUTO_CONFIRM_H_
#define MISES_EXTENSIONS_BROWSER_EXTENSION_DIALOG_AUTO_CONFIRM_H_
#define GetAutoConfirmValue                                                \
  GetAutoConfirmValue_ChromiumImpl();  \
  static AutoConfirm GetAutoConfirmValue

#include "src/extensions/browser//extension_dialog_auto_confirm.h"

#undef GetAutoConfirmValue

#endif  // MISES_EXTENSIONS_BROWSER_EXTENSION_DIALOG_AUTO_CONFIRM_H_

