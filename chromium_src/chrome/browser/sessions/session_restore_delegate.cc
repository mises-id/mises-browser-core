#include "src/chrome/browser/sessions/session_restore_delegate.cc"
#if BUILDFLAG(IS_ANDROID)
namespace performance_manager {

namespace policies {
  void ScheduleLoadForRestoredTabs(
    std::vector<content::WebContents*> web_contents_vector) {
  }
}
}
#endif
