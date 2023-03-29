#include "src/chrome/browser/ui/chrome_pages.cc"

#if BUILDFLAG(IS_ANDROID)
namespace chrome {
  void ShowWebAppSettings(Browser* browser,
                          const std::string& app_id,
                          web_app::AppSettingsPageEntryPoint entry_point) {
  }
}
#endif

