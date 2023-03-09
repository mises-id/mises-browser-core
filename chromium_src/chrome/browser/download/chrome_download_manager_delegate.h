#ifndef MISES_BROWSER_DOWNLOAD_CHROME_DOWNLOAD_MANAGER_DELEGATE_H_
#define MISES_BROWSER_DOWNLOAD_CHROME_DOWNLOAD_MANAGER_DELEGATE_H_

#include "chrome/browser/download/download_target_determiner_delegate.h"

#if BUILDFLAG(IS_ANDROID)
#define RequestConfirmation  \
  RequestConfirmation_Chromium(download::DownloadItem* download,\
                           const base::FilePath& suggested_virtual_path,\
                           DownloadConfirmationReason reason,\
                           ConfirmationCallback callback);\
  public: void ScheduleCancelForEphemeralWarning(const std::string& guid){};\
  protected: void RequestConfirmation
#endif
#include "src/chrome/browser/download/chrome_download_manager_delegate.h"
#if BUILDFLAG(IS_ANDROID)
#undef RequestConfirmation
#endif


#endif  // CHROME_BROWSER_DOWNLOAD_CHROME_DOWNLOAD_MANAGER_DELEGATE_H_
