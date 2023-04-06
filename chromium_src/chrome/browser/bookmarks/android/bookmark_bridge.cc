#include "base/files/file_util.h"
#include "base/android/content_uri_utils.h"
#include "base/android/path_utils.h"
#include "base/strings/utf_string_conversions.h"
#include "base/threading/thread_restrictions.h"


#include "chrome/common/importer/imported_bookmark_entry.h"
#include "chrome/common/importer/importer_data_types.h"
#include "chrome/common/url_constants.h"
#include "chrome/common/chrome_paths_internal.h"
#include "chrome/browser/ui/chrome_select_file_policy.h"
#include "chrome/utility/importer/bookmark_html_reader.h"
#include "chrome/browser/bookmarks/bookmark_html_writer.h"
#include "chrome/browser/importer/profile_writer.h"
#include "chrome/browser/platform_util.h"
#include "chrome/browser/ui/chrome_select_file_policy.h"
#include "components/url_formatter/url_fixer.h"
#include "ui/android/window_android.h"


#include "src/chrome/browser/bookmarks/android/bookmark_bridge.cc"

void BookmarkBridge::FileSelected(const base::FilePath& file_path, int index,
                            void* params) {
  LOG(ERROR) << "Bookmarks - Bookmarks file to be imported is present in " << file_path;

  base::FilePath file_path_tmp;
  if (!base::android::GetCacheDirectory(&file_path_tmp)) {
    LOG(ERROR) << "Bookmarks - Getting Cache Directory for Import";
    return;
  }
  file_path_tmp = file_path_tmp.Append(FILE_PATH_LITERAL("bookmarks.html.tmp"));

  LOG(ERROR) << "Bookmarks - Copying from " << file_path << " to " << file_path_tmp;


  std::vector<ImportedBookmarkEntry> bookmarks;
  std::vector<importer::SearchEngineInfo> search_engines;
  
  {
    base::ScopedAllowBlockingForTesting allow_blocking;

    base::CopyFile(file_path, file_path_tmp);

    LOG(ERROR) << "Bookmarks - Reading " << file_path_tmp;


    bookmark_html_reader::ImportBookmarksFile(
        base::RepeatingCallback<bool(void)>(),
        base::RepeatingCallback<bool(const GURL&)>(),
        file_path_tmp,
        &bookmarks,
        &search_engines,
        nullptr);
    base::DeleteFile(file_path_tmp);
  }

  auto *writer = new ProfileWriter(profile_);

  if (!bookmarks.empty()) {
    writer->AddBookmarks(bookmarks, u"Imported");
  }


    
  JNIEnv* env = AttachCurrentThread();
  if (!env || !java_bookmark_model_)
    return;

  std::string message = "";
  if (bookmarks.size())
    message = "Imported " + std::to_string(bookmarks.size()) + " bookmarks";
  else
    message = "No bookmarks have been imported";
  Java_BookmarkBridge_bookmarksImported(env, ScopedJavaLocalRef<jobject>(java_bookmark_model_), ConvertUTF8ToJavaString(env, message));
}

void BookmarkBridge::FileSelectionCanceled(void* params) {
  LOG(ERROR) << "Bookmarks - FileSelectionCanceled";
}

void BookmarkBridge::ImportBookmarks(JNIEnv* env, const base::android::JavaParamRef<jobject>& java_window) {
  DCHECK(IsLoaded());


  ui::WindowAndroid* window = ui::WindowAndroid::FromJavaWindowAndroid(java_window);
  CHECK(window);

  select_file_dialog_ = ui::SelectFileDialog::Create(
    this, std::make_unique<ChromeSelectFilePolicy>(nullptr));

  ui::SelectFileDialog::FileTypeInfo file_type_info;
  file_type_info.extensions = {{FILE_PATH_LITERAL("html"), FILE_PATH_LITERAL("htm")}};
  file_type_info.allowed_paths = ui::SelectFileDialog::FileTypeInfo::NATIVE_PATH;

  select_file_dialog_->SelectFile(
        ui::SelectFileDialog::SELECT_OPEN_FILE,
        std::u16string(),
        base::FilePath(),
        &file_type_info,
        0,
        base::FilePath::StringType(),
        window,
        NULL);
}


void BookmarkBridge::ExportBookmarks(JNIEnv* env) {
  DCHECK(IsLoaded());

  base::FilePath file_path;
  if (!base::android::GetDownloadsDirectory(&file_path)) {
    LOG(ERROR) << "Bookmarks - Getting Download Directory";
    return;
  }

  file_path = file_path.Append(FILE_PATH_LITERAL("bookmarks.html"));

  LOG(ERROR) << "Bookmarks - Output path is " << file_path;


  bookmark_html_writer::WriteBookmarks(profile_, file_path, NULL);

  if (!env || !java_bookmark_model_)
    return;

  Java_BookmarkBridge_bookmarksExported(env, ScopedJavaLocalRef<jobject>(java_bookmark_model_), ConvertUTF8ToJavaString(env, file_path.MaybeAsASCII()));
}


