package org.chromium.chrome.browser;

import org.chromium.base.annotations.NativeMethods;
import org.chromium.content_public.browser.WebContents;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.base.natives.GEN_JNI;

public class AppMenuBridge {
	@NativeMethods
	interface Natives {
		void openDevTools(WebContents w);
		void disableProxy(Profile p);
		String getRunningExtensions(Profile p,WebContents w);
		boolean isProxyEnabled(Profile p);
		void grantExtensionActiveTab(Profile p,WebContents w,String s);
		void callExtension(Profile p,WebContents w,String s);
	}
        public      static  void openDevTools(WebContents w){GEN_JNI.org_chromium_chrome_browser_AppMenuBridge_openDevTools(w);};
          public    static void disableProxy(Profile p){GEN_JNI.org_chromium_chrome_browser_AppMenuBridge_disableProxy(p);};
           public  static   String getRunningExtensions(Profile p,WebContents w){return GEN_JNI.org_chromium_chrome_browser_AppMenuBridge_getRunningExtensions(p,w);};
          public  static    boolean isProxyEnabled(Profile p){return GEN_JNI.org_chromium_chrome_browser_AppMenuBridge_isProxyEnabled(p);};
          public  static    void grantExtensionActiveTab(Profile p,WebContents w,String s){GEN_JNI.org_chromium_chrome_browser_AppMenuBridge_grantExtensionActiveTab(p,w,s);};
          public   static   void callExtension(Profile p,WebContents w,String s){GEN_JNI.org_chromium_chrome_browser_AppMenuBridge_callExtension(p,w,s);};
}
