#include "chrome/browser/download/android/download_dialog_bridge.h"


#include "chrome/browser/download/android/jni_headers/DownloadDialogBridge_jni.h"

#define Java_DownloadDialogBridge_showDialog(A1,A2,A3,A4,A5,A6,A7,A8,A9) \
  Java_DownloadDialogBridge_showDialog(A1,A2,A3,A4,A5,A6,A7,A8,A9,base::android::ConvertUTF8ToJavaString(env, url_to_download_))
#include "src/chrome/browser/download/android/download_dialog_bridge.cc"
#undef Java_DownloadDialogBridge_showDialog
