#include "components/site_engagement/content/site_engagement_service.h"

#define SetLastShortcutLaunchTime(A, B, C) SetLastShortcutLaunchTime(A,C)
#include "src/chrome/browser/ui/web_applications/web_app_launch_utils.cc"
#undef SetLastShortcutLaunchTime
