#ifndef MISES_BROWSER_PROCESS_SINGLETON_H_
#define MISES_BROWSER_PROCESS_SINGLETON_H_

#include "base/sequence_checker.h"
#include "build/build_config.h"

#if BUILDFLAG(IS_WIN)
#include "base/win/windows_types.h"
#endif  // BUILDFLAG(IS_WIN)

#include "base/functional/callback.h"
#include "base/check.h"
#include "base/command_line.h"
#include "base/files/file_path.h"
#include "base/memory/ref_counted.h"
#include "base/process/process.h"
#include "ui/gfx/native_widget_types.h"



#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/chrome/browser/process_singleton.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/chrome/browser/process_singleton.h"


#endif



#endif  // CHROME_BROWSER_PROCESS_SINGLETON_H_
