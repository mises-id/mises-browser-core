#ifndef MISES_COMMON_CHROME_SWITCHES_H_
#define MISES_COMMON_CHROME_SWITCHES_H_

#include "src/chrome/common/chrome_switches.h"
#if BUILDFLAG(IS_ANDROID)
namespace switches {
    extern const char kEnableNewAppMenuIcon[];
    extern const char kGuest[];
}
#endif

#endif

