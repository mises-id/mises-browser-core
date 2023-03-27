
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#define ShowWarningMessageBox ShowWarningMessageBox_Chromium
#define  ShowWarningMessageBoxWithCheckbox ShowWarningMessageBoxWithCheckbox_Chromium
#include "src/chrome/browser/ui/views/message_box_dialog.cc"

#undef ShowWarningMessageBoxWithCheckbox
#undef ShowWarningMessageBox

#else
#include "src/chrome/browser/ui/views/message_box_dialog.cc"
#endif
