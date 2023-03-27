#include "build/build_config.h"
#include "content/browser/startup_task_runner.h"

#if BUILDFLAG(IS_ANDROID)
#define StartRunningTasksAsync RunAllTasksNow
#include "src/content/browser/browser_main_loop.cc"
#undef StartRunningTasksAsync

#else
#include "src/content/browser/browser_main_loop.cc"
#endif

