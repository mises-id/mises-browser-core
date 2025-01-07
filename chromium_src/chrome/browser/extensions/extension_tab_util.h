#ifndef MISES_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_
#define MISES_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_

#include "src/chrome/browser/extensions/extension_tab_util.h"
#include "components/sessions/core/session_id.h"

namespace extensions{

void OpenSingleExtensionTab(   
    const Extension* extension,
    const GURL &url,
    const SessionID::id_type session_window_id);

#if BUILDFLAG(IS_ANDROID) 


void CreateTabObjectAndroid(   
    api::tabs::Tab* tab_object,
    content::WebContents* contents,
    const Extension* extension,
    int tab_index);
bool GetTabByIdAndroid(int tab_id, content::WebContents** contents, int* tab_index);
base::Value::Dict CreateDummyWindowValueForExtension(
		  WindowController::PopulateTabBehavior populate_tab_behavior);
Browser* FindBrowserForWindowAndroid(Profile* profile, int window_id);
#endif

}  // namespace extensions

#endif  // CHROME_BROWSER_EXTENSIONS_EXTENSION_TAB_UTIL_H_
