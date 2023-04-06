#include "chrome/browser/webapps/web_app_offline.h"
#if BUILDFLAG(IS_ANDROID)
#define GetOfflinePageInfo GetOfflinePageInfo_Chromium
#endif
#include "src/chrome/browser/web_applications/web_app_utils.cc"

