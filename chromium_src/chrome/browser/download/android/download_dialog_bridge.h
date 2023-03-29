#ifndef MISES_BROWSER_DOWNLOAD_ANDROID_DOWNLOAD_DIALOG_BRIDGE_H_
#define MISES_BROWSER_DOWNLOAD_ANDROID_DOWNLOAD_DIALOG_BRIDGE_H_

#define OnCanceled \
  SetUrl(const std::string& url) {url_to_download_ = url;}\
  std::string url_to_download_;\
  void OnCanceled

#include "src/chrome/browser/download/android/download_dialog_bridge.h"
#undef OnCanceled

#endif  // CHROME_BROWSER_DOWNLOAD_ANDROID_DOWNLOAD_DIALOG_BRIDGE_H_
