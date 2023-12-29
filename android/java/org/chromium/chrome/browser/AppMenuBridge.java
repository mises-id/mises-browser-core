package org.chromium.chrome.browser;

import org.jni_zero.CalledByNative;
import org.jni_zero.NativeMethods;
import org.chromium.content_public.browser.WebContents;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.base.ThreadUtils;
import org.chromium.base.MisesController;

public class AppMenuBridge {
    private long mNativeAppMenuBridge;
    private boolean mIsDestroyed;

    public static AppMenuBridge getForProfile(Profile profile) {
        ThreadUtils.assertOnUiThread();
        return  AppMenuBridgeJni.get().getForProfile(profile);
    }

    @CalledByNative
    public static AppMenuBridge createAppMenuBridge(long nativeAppMenuBridge) {
        return new AppMenuBridge(nativeAppMenuBridge);
    }
    AppMenuBridge(long nativeAppMenuBridge) {
        mNativeAppMenuBridge = nativeAppMenuBridge;
    }
    public void openDevTools(WebContents w){
	    AppMenuBridgeJni.get().openDevTools(mNativeAppMenuBridge, AppMenuBridge.this, w);
    };
    public void disableProxy(){
	    AppMenuBridgeJni.get().disableProxy(mNativeAppMenuBridge, AppMenuBridge.this);
    };
    public String getRunningExtensions(WebContents w){
	    return AppMenuBridgeJni.get().getRunningExtensions(mNativeAppMenuBridge, AppMenuBridge.this, w);
    };
    public boolean isProxyEnabled(){
        return AppMenuBridgeJni.get().isProxyEnabled(mNativeAppMenuBridge, AppMenuBridge.this);
    };
    public void grantExtensionActiveTab(WebContents w,String s){
	    AppMenuBridgeJni.get().grantExtensionActiveTab(mNativeAppMenuBridge, AppMenuBridge.this, w,s);
    };
    public void callExtension(WebContents w,String s){
        AppMenuBridgeJni.get().callExtension(mNativeAppMenuBridge, AppMenuBridge.this,w,s);
    };

    @CalledByNative
    public void updateExtensionMenuIcon(final String base64Image){
        MisesController.getInstance().NotifyExtensionDNRActionCountChange(base64Image);
    }

    @CalledByNative
    private void destroyFromNative() {
        destroy();
    }
    void destroy() {
        mIsDestroyed = true;
        if (mNativeAppMenuBridge != 0) {
            AppMenuBridgeJni.get().destroy(mNativeAppMenuBridge, AppMenuBridge.this);
            mNativeAppMenuBridge = 0;
        }
    }
    private boolean isDestroyed() {
        return mIsDestroyed;
    }


    @NativeMethods
    interface Natives {
        AppMenuBridge getForProfile(Profile profile);
        void openDevTools(long nativeAppMenuBridge, AppMenuBridge caller, WebContents w);
        void disableProxy(long nativeAppMenuBridge, AppMenuBridge caller);
        String getRunningExtensions(long nativeAppMenuBridge, AppMenuBridge caller, WebContents w);
        boolean isProxyEnabled(long nativeAppMenuBridge, AppMenuBridge caller);
        void grantExtensionActiveTab(long nativeAppMenuBridge, AppMenuBridge caller, WebContents w,String s);
        void callExtension(long nativeAppMenuBridge, AppMenuBridge caller, WebContents w,String s);
        void destroy(long nativeAppMenuBridge, AppMenuBridge caller);
    }
}

