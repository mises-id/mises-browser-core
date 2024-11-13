#ifndef MISES_BROWSER_BOOKMARKS_ANDROID_BOOKMARK_BRIDGE_H_
#define MISES_BROWSER_BOOKMARKS_ANDROID_BOOKMARK_BRIDGE_H_
#include "components/bookmarks/browser/base_bookmark_model_observer.h"
#include "components/bookmarks/managed/managed_bookmark_service.h"
#include "ui/shell_dialogs/select_file_dialog.h"

#define CreateOrDestroyAccountReadingListManagerIfNeeded CreateOrDestroyAccountReadingListManagerIfNeeded_Unused();\
  public:\
  void ImportBookmarks(JNIEnv* env, const base::android::JavaParamRef<jobject>& java_window);\
  void ExportBookmarks(JNIEnv* env, const base::android::JavaParamRef<jobject>& java_window);\
  void BookmarksExportTo(const base::FilePath& file_path);\
  void BookmarksImportFrom(const base::FilePath& file_path);\
  void FileSelected(const ui::SelectedFileInfo& file, int index) override; \
  void FileSelectionCanceled() override;\
  scoped_refptr<ui::SelectFileDialog> select_file_dialog_;\
  void CreateOrDestroyAccountReadingListManagerIfNeeded

#include "src/chrome/browser/bookmarks/android/bookmark_bridge.h"
#undef CreateOrDestroyAccountReadingListManagerIfNeeded

#endif  // CHROME_BROWSER_BOOKMARKS_ANDROID_BOOKMARK_BRIDGE_H_
