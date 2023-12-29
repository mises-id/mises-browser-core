#ifndef MISES_BROWSER_TASK_MANAGER_WEB_CONTENTS_TAGS_H_
#define MISES_BROWSER_TASK_MANAGER_WEB_CONTENTS_TAGS_H_

#include "build/build_config.h"
#include "extensions/buildflags/buildflags.h"



#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/task_manager/web_contents_tags.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/task_manager/web_contents_tags.h"


#endif


#endif  // CHROME_BROWSER_ENGAGEMENT_IMPORTANT_SITES_UTIL_H_

