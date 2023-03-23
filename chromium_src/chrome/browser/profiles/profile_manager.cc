#include "mises/browser/profiles/mises_profile_manager.h"

#include "src/chrome/browser/profiles/profile_manager.cc"

#if BUILDFLAG(IS_ANDROID)


base::FilePath ProfileManager::GetSystemProfilePath() {
  DCHECK_CURRENTLY_ON(BrowserThread::UI);

  ProfileManager* profile_manager = g_browser_process->profile_manager();

  base::FilePath system_path = profile_manager->user_data_dir();
  return system_path.Append(chrome::kSystemProfileDir);
}

#endif