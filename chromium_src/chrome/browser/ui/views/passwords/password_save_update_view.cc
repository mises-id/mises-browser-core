
#include "build/build_config.h"
#if !BUILDFLAG(IS_ANDROID)
#define IDS_PASSWORD_MANAGER_UPDATE_BUTTON IDS_PASSWORD_MANAGER_UPDATE_BUTTON_DESKTOP
#define IDS_PASSWORD_MANAGER_SAVE_BUTTON IDS_PASSWORD_MANAGER_SAVE_BUTTON_DESKTOP
#endif
#include "src/chrome/browser/ui/views/passwords/password_save_update_view.cc"