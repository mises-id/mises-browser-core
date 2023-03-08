#ifndef MISES_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_
#define MISES_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_

#include "src/chrome/browser/extensions/extension_tab_util.h"

namespace extensions{

#if BUILDFLAG(IS_ANDROID) 
 std::unique_ptr<base::DictionaryValue> CreateDummyWindowValueForExtension(
		  ExtensionTabUtil::PopulateTabBehavior populate_tab_behavior);
#endif

}  // namespace extensions

#endif  // CHROME_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_
