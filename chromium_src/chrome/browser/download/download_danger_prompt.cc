#include "build/build_config.h"
#include "chrome/browser/download/download_danger_prompt.h"
#if !BUILDFLAG(IS_ANDROID)

#include "src/chrome/browser/download/download_danger_prompt.cc"


#else 

// static
void DownloadDangerPrompt::RecordDownloadWarningEvent(
    Action action,
    download::DownloadItem* download) {

}

#endif
