#include "src/chrome/browser/task_manager/web_contents_tags.cc"

#if BUILDFLAG(IS_ANDROID)

namespace task_manager {
// static
void WebContentsTags::CreateForWebApp(content::WebContents* web_contents,
                                      const webapps::AppId& app_id,
                                      const bool is_isolated_web_app) {
}

}

#endif

