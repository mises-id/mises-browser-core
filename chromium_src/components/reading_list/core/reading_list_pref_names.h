#ifndef MISES_COMPONENTS_READING_LIST_CORE_READING_LIST_PREF_NAMES_H_
#define MISES_COMPONENTS_READING_LIST_CORE_READING_LIST_PREF_NAMES_H_

#include "src/components/reading_list/core/reading_list_pref_names.h"

namespace reading_list {
namespace prefs {

#if BUILDFLAG(IS_ANDROID) 
extern const char kReadingListDesktopFirstUseExperienceShown[];
#endif  // !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS)

}  // namespace prefs
}  // namespace reading_list

#endif  // COMPONENTS_READING_LIST_CORE_READING_LIST_PREF_NAMES_H_
