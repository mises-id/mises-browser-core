
#include "extensions/common/constants.h"

#define MISES_COMPONENTS_PAGE_INFO_PAGE_INFO_INSERT \
 is_chrome_ui_native_scheme = is_chrome_ui_native_scheme || url.SchemeIs(extensions::kExtensionScheme);

#include "src/components/page_info/page_info.cc"