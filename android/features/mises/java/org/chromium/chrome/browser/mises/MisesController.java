package org.chromium.chrome.browser.mises;

import org.chromium.base.Log;
import org.chromium.base.ThreadUtils;
import org.chromium.base.annotations.CalledByNative;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.preferences.SharedPreferencesManager;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import org.chromium.base.annotations.NativeMethods;

public class MisesController {
    private static final String TAG = "MisesController";
    private String mMisesId = "";
    private String mMisesToken = "";
    private String mMisesNickname = "";
    private String mMisesAvatar = "";
    private String mLastShareIcon = "";
    private String mLastShareTitle = "";
    private String mLastShareUrl = "";
    private String mInfoCache = "";
    private static MisesController sInstance;

    public interface MisesControllerObserver {
	    void OnMisesUserInfoChanged();
        void OnExtensionDNRActionCountChanged(final String base64Image);
        void OnWeb3SafePhishingDetected(final String address);
    }

    ArrayList<MisesControllerObserver> observers_ = new ArrayList<>();

	public void AddObserver(MisesControllerObserver observer) {
	    observers_.add(observer);
    }

    public void RemoveObserver(MisesControllerObserver observer) {
	    observers_.remove(observer);
    }

    public static MisesController getInstance() {
        ThreadUtils.assertOnUiThread();
        if (sInstance == null) {
            sInstance = new MisesController();
        }
        return sInstance;
    }
    public void load() {
        String json = SharedPreferencesManager.getInstance().getMisesUserInfo();
        if (json == null || json.isEmpty()) {
            mMisesId = "";
            mMisesToken = "";
            mMisesNickname = "";
            mMisesAvatar = "";
	        mInfoCache = "";
        } else {
            try {
                JSONObject jsonMessage = new JSONObject(json);
                if (jsonMessage.has("misesId")) {
                    mMisesId = jsonMessage.getString("misesId");
		        }
                if (jsonMessage.has("token")) {
                    mMisesToken = jsonMessage.getString("token");
                }
                if (jsonMessage.has("nickname")) {
                    mMisesNickname = jsonMessage.getString("nickname");
                }
                if (jsonMessage.has("avatar")) {
   		            mMisesAvatar = jsonMessage.getString("avatar");
                }
	            mInfoCache = json;
            } catch (JSONException e) {
                Log.e(TAG, "load MisesUserInfo from cache %s error", json);
		        mInfoCache = "";
            }
            for (MisesControllerObserver observer : observers_) {
                observer.OnMisesUserInfoChanged();
            }
        } 
    }
    public void NotifyExtensionDNRActionCountChange(final String base64Image) {
        for (MisesControllerObserver observer : observers_) {
	        observer.OnExtensionDNRActionCountChanged(base64Image);
        }
    }

    @CalledByNative
    public static void NotifyPhishingDetected(final String address) {
        MisesController instance = getInstance();
        for (MisesControllerObserver observer : instance.observers_) {
            observer.OnWeb3SafePhishingDetected(address);
        }
    }

    @CalledByNative
    public static String getMisesUserInfo() {
	    return sInstance.mInfoCache;
    }

    @CalledByNative
    public static void setMisesUserInfo(String json) {
        MisesController instance = getInstance();
    	if (json == null || json.isEmpty()) {
    	    instance.mMisesId = "";
    	    instance.mMisesToken = "";
    	    instance.mMisesNickname = "";
    	    instance.mMisesAvatar = "";
    	    SharedPreferencesManager.getInstance().setMisesUserInfo("");
        } else {
            try {
                JSONObject jsonMessage = new JSONObject(json);
                if (jsonMessage.has("misesId")) {
                    instance.mMisesId = jsonMessage.getString("misesId");
                }
                if (jsonMessage.has("token")) {
                    instance.mMisesToken = jsonMessage.getString("token");
                }
                if (jsonMessage.has("nickname")) {
                    instance.mMisesNickname = jsonMessage.getString("nickname");
                }
                if (jsonMessage.has("avatar")) {
                    instance.mMisesAvatar = jsonMessage.getString("avatar");
                } else {
                    instance.mMisesAvatar = "";
                }
                SharedPreferencesManager.getInstance().setMisesUserInfo(json);
		        sInstance.mInfoCache = json;
            } catch (JSONException e) {
                Log.e(TAG, "setMisesUserInfo from plugin %s error", json);
            }
        }

    	for (MisesControllerObserver observer : instance.observers_) {
    	    observer.OnMisesUserInfoChanged();
        }
    }

    public boolean isLogin() {
        return mMisesToken != null && !mMisesToken.isEmpty();
    }

    public String getMisesId() {
        return mMisesId;
    }

    public String getMisesToken() {
        return mMisesToken;
    }

    public String getMisesNickname() {
        return mMisesNickname;
    }

    public String getMisesAvatar() {
        return mMisesAvatar;
    }

    public void setLastShareInfo(String icon, String title, String url) {
	    mLastShareIcon = icon;
	    mLastShareTitle = title;
	    mLastShareUrl = url;
    }

    public String getLastShareIcon() {
        return mLastShareIcon;
    }

    public String getLastShareTitle() {
        return mLastShareTitle;
    }

    public String getLastShareUrl() {
        return mLastShareUrl;
    }

    public void clearLastShareInfo() {
	    mLastShareUrl = "";
	    mLastShareTitle = "";
	    mLastShareIcon = "";
    }

    public void callbackPhishingDetected(final String address, int action) {
        MisesControllerJni.get().callbackPhishingDetected(address, action);
    }

    @NativeMethods
    interface Natives {
        void callbackPhishingDetected(final String address, int action);
    }
}
