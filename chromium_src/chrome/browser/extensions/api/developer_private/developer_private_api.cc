#include "chrome/browser/extensions/api/developer_private/developer_private_api.h"
#include "base/threading/thread_restrictions.h"

#define DeveloperPrivateLoadUnpackedFunction DeveloperPrivateLoadUnpackedFunction_Chromium
#include "src/chrome/browser/extensions/api/developer_private/developer_private_api.cc"
#undef DeveloperPrivateLoadUnpackedFunction


namespace extensions {

namespace developer = api::developer_private;

namespace api{


DeveloperPrivateLoadUnpackedFunction::DeveloperPrivateLoadUnpackedFunction() {}
DeveloperPrivateLoadUnpackedFunction::~DeveloperPrivateLoadUnpackedFunction() {}


void DeveloperPrivateLoadUnpackedFunction::CheckFile(const base::FilePath& path) {
    LOG(INFO) << "[EXTENSIONS] The file is a content URI, we have to get file info";
    base::FilePath new_path = path;    
    base::FilePath file_path_tmp;
    if (!GetTempDir(&file_path_tmp)) {
      LOG(ERROR) << "[EXTENSIONS] Getting Default User Data Directory for Import";
      return;
    }
    file_path_tmp = file_path_tmp.Append(FILE_PATH_LITERAL("extensions.file.tmp"));

    LOG(INFO) << "[EXTENSIONS] Copying file from " << new_path << " to " << file_path_tmp;
    if (!base::CopyFile(new_path, file_path_tmp)) {
      LOG(INFO) << "[EXTENSIONS] base::CopyFile failed with error";
      return ;
    }

    LOG(INFO) << "[EXTENSIONS] Reading " << file_path_tmp;
    std::string content;
    base::ReadFileToStringWithMaxSize(file_path_tmp, &content, 2);
    LOG(INFO) << "[EXTENSIONS] Received file content: " << content;
    if (!GetTempDir(&new_path)) {
      LOG(ERROR) << "[EXTENSIONS] Getting Default User Data Directory for Import";
      return;
    }
    if (content == "Cr")
      new_path = new_path.Append(FILE_PATH_LITERAL("extensions.file.crx"));
    else if (content == "PK")
      new_path = new_path.Append(FILE_PATH_LITERAL("extensions.file.zip"));
    else if (content == "//")
      new_path = new_path.Append(FILE_PATH_LITERAL("extensions.file.user.js"));
    else
      return ;
    LOG(INFO) << "[EXTENSIONS] Copying file from " << file_path_tmp << " to " << new_path;
    if (!base::CopyFile(file_path_tmp, new_path)) {
      LOG(INFO) << "[EXTENSIONS] base::CopyFile failed with error";
      return ;
    }
    base::DeleteFile(file_path_tmp);

       content::GetUIThreadTaskRunner({})->PostTask(
        FROM_HERE,
        base::BindOnce(&DeveloperPrivateLoadUnpackedFunction::FileSelected, this, new_path));
}
void DeveloperPrivateLoadUnpackedFunction::FileSelected(
    const base::FilePath& path) {
  base::FilePath new_path = path;
  LOG(INFO) << "[EXTENSIONS] Selected file: " << new_path << " with extension: " << path.Extension();
#if BUILDFLAG(IS_ANDROID)
  if (new_path.IsContentUri()) {
     base::ThreadPool::PostTask(
      FROM_HERE,
      {base::MayBlock(), base::TaskShutdownBehavior::SKIP_ON_SHUTDOWN},
      base::BindOnce(&DeveloperPrivateLoadUnpackedFunction::CheckFile, this,
                     new_path));  
     return;
  }
#endif

  LOG(INFO) << "[EXTENSIONS] Now processing: " << new_path;

  if (new_path.MatchesExtension(FILE_PATH_LITERAL(".zip"))
   || new_path.MatchesExtension(FILE_PATH_LITERAL(".user.js"))
   || new_path.MatchesExtension(FILE_PATH_LITERAL(".crx"))) {
    ExtensionService* service = GetExtensionService(browser_context());
    if (new_path.MatchesExtension(FILE_PATH_LITERAL(".zip"))) {
      ZipFileInstaller::Create(
          GetExtensionFileTaskRunner(),
	        MakeRegisterInExtensionServiceCallback(service)
      )->InstallZipFileToTempDir(new_path);
    } else {
      scoped_refptr<CrxInstaller> crx_installer =
          CrxInstaller::CreateSilent(service);
      crx_installer->set_error_on_unsupported_requirements(true);
      crx_installer->set_off_store_install_allow_reason(
          CrxInstaller::OffStoreInstallAllowedFromSettingsPage);
      crx_installer->set_install_immediately(true);

      if (new_path.MatchesExtension(FILE_PATH_LITERAL(".user.js"))) {
        crx_installer->InstallUserScript(new_path, net::FilePathToFileURL(new_path));
      } else if (new_path.MatchesExtension(FILE_PATH_LITERAL(".crx"))) {
        crx_installer->InstallCrx(new_path);
      }
    }
    return ;
  }
  new_path = path.DirName();
  LOG(INFO) << "[EXTENSIONS] Loading path with: " << new_path;
  DeveloperPrivateLoadUnpackedFunction_Chromium::FileSelected(new_path);
  
}


}  // namespace api

}  // namespace extensions
