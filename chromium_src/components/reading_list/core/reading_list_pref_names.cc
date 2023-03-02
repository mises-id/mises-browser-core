#include "src/components/reading_list/core/reading_list_pref_names.cc"


namespace reading_list {
namespace prefs {

#if BUILDFLAG(IS_ANDROID)
// Boolean to track if the first-use experience has been shown on desktop.
const char kReadingListDesktopFirstUseExperienceShown[] =
    "reading_list.desktop_first_use_experience_shown";
#endif  

}  // namespace prefs
}  // namespace reading_list
