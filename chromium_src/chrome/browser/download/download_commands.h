#ifndef MISES_BROWSER_DOWNLOAD_DOWNLOAD_COMMANDS_H_
#define MISES_BROWSER_DOWNLOAD_DOWNLOAD_COMMANDS_H_

#include "base/gtest_prod_util.h"
#include "base/memory/weak_ptr.h"
#include "build/build_config.h"
#include "content/public/browser/page_navigator.h"
#include "ui/gfx/image/image.h"



#if BUILDFLAG(IS_ANDROID)
class Browser;

#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (1)


#include "src/chrome/browser/download/download_commands.h"
#undef BUILDFLAG_INTERNAL_IS_LINUX
#define BUILDFLAG_INTERNAL_IS_LINUX() (0)

#else

#include "src/chrome/browser/download/download_commands.h"


#endif


#endif  // CHROME_BROWSER_DOWNLOAD_DOWNLOAD_COMMANDS_H_
