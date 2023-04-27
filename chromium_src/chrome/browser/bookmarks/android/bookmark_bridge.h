#ifndef MISES_BROWSER_BOOKMARKS_ANDROID_BOOKMARK_BRIDGE_H_
#define MISES_BROWSER_BOOKMARKS_ANDROID_BOOKMARK_BRIDGE_H_
#include "components/bookmarks/browser/base_bookmark_model_observer.h"
#include "ui/shell_dialogs/select_file_dialog.h"

#define BaseBookmarkModelObserver BaseBookmarkModelObserver, public ui::SelectFileDialog::Listener
#define DestroyJavaObject DestroyJavaObject();\
  public:\
  void ImportBookmarks(JNIEnv* env, const base::android::JavaParamRef<jobject>& java_window);\
  void ExportBookmarks(JNIEnv* env, const base::android::JavaParamRef<jobject>& java_window);\
  void BookmarksExportTo(const base::FilePath& file_path);\
  void BookmarksImportFrom(const base::FilePath& file_path);\
  void FileSelected(const base::FilePath& path, int index, void* params) override; \
  void FileSelectionCanceled(void* params) override;\
  scoped_refptr<ui::SelectFileDialog> select_file_dialog_;\
  void DummyFunction

#include "src/chrome/browser/bookmarks/android/bookmark_bridge.h"
#undef DestroyJavaObject
#undef BaseBookmarkModelObserver

#endif  // CHROME_BROWSER_BOOKMARKS_ANDROID_BOOKMARK_BRIDGE_H_
