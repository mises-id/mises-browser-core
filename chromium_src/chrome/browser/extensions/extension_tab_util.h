#ifndef MISES_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_
#define MISES_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_

#include "src/chrome/browser/extensions/extension_tab_util.h"

namespace extensions{

#if BUILDFLAG(IS_ANDROID) 
	void CreateTabObjectAndroid(   
    api::tabs::Tab* tab_object,
    WebContents* contents,
    const Extension* extension,
    int tab_index);
	void CreateTabListAndroid(
    const Browser* browser,
    const Extension* extension,
    Feature::Context context,
		base::Value::List& tab_list);
	bool GetTabByIdAndroid(int tab_id, WebContents** contents, int* tab_index);
 	std::unique_ptr<base::DictionaryValue> CreateDummyWindowValueForExtension(
		  ExtensionTabUtil::PopulateTabBehavior populate_tab_behavior);
#endif

}  // namespace extensions

#endif  // CHROME_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_
