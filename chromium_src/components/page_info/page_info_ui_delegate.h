#ifndef MISES_COMPONENTS_PAGE_INFO_PAGE_INFO_UI_DELEGATE_H_
#define MISES_COMPONENTS_PAGE_INFO_PAGE_INFO_UI_DELEGATE_H_

#include "build/build_config.h"
#include "components/content_settings/core/common/content_settings_types.h"
#include "content/public/browser/permission_result.h"
#include "third_party/abseil-cpp/absl/types/optional.h"

#if BUILDFLAG(IS_ANDROID)

#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (0)


#include "src/components/page_info/page_info_ui_delegate.h"
#undef BUILDFLAG_INTERNAL_IS_ANDROID
#define BUILDFLAG_INTERNAL_IS_ANDROID() (1)

#else

#include "src/components/page_info/page_info_ui_delegate.h"


#endif


#endif  // COMPONENTS_PAGE_INFO_PAGE_INFO_UI_DELEGATE_H_
