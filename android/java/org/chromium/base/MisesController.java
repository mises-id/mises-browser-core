package org.chromium.base;

import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.text.DecimalFormat;
import java.math.RoundingMode;

import org.jni_zero.CalledByNative;
import org.jni_zero.JNINamespace;
import org.jni_zero.NativeMethods;

import org.chromium.base.Log;
import org.chromium.base.ThreadUtils;
import org.chromium.base.shared_preferences.SharedPreferencesManager;
import org.chromium.chrome.browser.preferences.ChromeSharedPreferences;
import org.chromium.base.Callback;
import org.chromium.chrome.browser.mises.HttpUtil;


@JNINamespace("base::android")
public class MisesController {
    private static final String TAG = "MisesController";
    public static final int MISES_BONUS_CACHE_EXPIRE_TIME = 60;

    public static final String MISES_HOME_BASE_URL = "https://home.mises.site";
    public static final String MISES_MINING_BASE_URL = "https://mining.mises.site";
    public static final String MISES_SWAP_BASE_URL = "https://swap.mises.site";
    public static final String MISES_API_BASE_URL = "https://api.alb.mises.site";
    public static final String MISES_WALLET_BASE_URL = "chrome://wallet";
    public static final String EXTENSIONS_BASE_URL = "chrome://extensions";
    
    private String mMisesId = "";
    private String mMisesAuth = "";
    private String mMisesToken = "";
    private String mMisesNickname = "";
    private String mMisesAvatar = "";
    private double mMisesBonus;
    private long mMisesBonusTimestamp;
    private String mLastShareIcon = "";
    private String mLastShareTitle = "";
    private String mLastShareUrl = "";
    private String mInfoCache = "";
    
    private static MisesController sInstance;

    public interface MisesControllerObserver {
	    void OnMisesUserInfoChanged();
        void OnExtensionDNRActionCountChanged(final String base64Image);
        void OnShowNotifyDialog(int dialogType, final String param);
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
        SharedPreferencesManager sharedPreferencesManager = ChromeSharedPreferences.getInstance();
        String jsonStr = sharedPreferencesManager.getMisesUserInfo();
        if (jsonStr == null || jsonStr.isEmpty()) {
            mMisesId = "";
            mMisesToken = "";
            mMisesNickname = "";
            mMisesAvatar = "";
	        mInfoCache = "";
        } else {
            try {
                JSONObject jsonMessage = new JSONObject(jsonStr);
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

                if (jsonMessage.has("bonus")) {
   		            mMisesBonus = jsonMessage.getDouble("bonus");
                }
	            mInfoCache = jsonStr;
            } catch (JSONException e) {
                Log.e(TAG, "load MisesUserInfo from cache %s error", jsonStr);
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
    public static void ShowNotifyDialog(int dialogType, final String param) {
        MisesController instance = getInstance();
        for (MisesControllerObserver observer : instance.observers_) {
            observer.OnShowNotifyDialog(dialogType, param);
        }
    }

    @CalledByNative
    public static String getMisesUserInfo() {
	    return sInstance.mInfoCache;
    }

    private String buildInfoJson() {
        JSONObject json = new JSONObject();
        try {
            json.put("misesId", mMisesId);
            json.put("token", mMisesToken);
            json.put("nickname", mMisesNickname);
            json.put("avatar", mMisesAvatar);
            json.put("bonus", mMisesBonus);
        } catch (JSONException e) {
            Log.d(TAG, "Unable to buildInfoJson." + e.toString());
        }
        return json.toString();

    }
    public void handleUserInfoUpdate() {
        String jsonStr = buildInfoJson();
        SharedPreferencesManager sharedPreferencesManager = ChromeSharedPreferences.getInstance();
        sharedPreferencesManager.setMisesUserInfo(jsonStr);
        mInfoCache = jsonStr;
        for (MisesControllerObserver observer : observers_) {
            observer.OnMisesUserInfoChanged();
        }

    }
    private String getUserAgent() {
        return "Mises Browser";
    }
    public void updateUserBonusFromServer(boolean force) {
        Log.v(TAG, "updateUserBonusFromServer");
        long nowInSeconds = System.currentTimeMillis() / 1000;
        if (!force) {
            // check cache expiration
            if (mMisesBonusTimestamp > 0 && (nowInSeconds - mMisesBonusTimestamp < MISES_BONUS_CACHE_EXPIRE_TIME)) {
                Log.v(TAG, "updateUserBonusFromServer skip: rate");
                return;
            }
        }
        if (mMisesToken.isEmpty()) {
            Log.v(TAG, "updateUserBonusFromServer skip: not signin");
            return;
        }
        mMisesBonusTimestamp =  nowInSeconds;
        HttpUtil.JsonGetAsync(MISES_API_BASE_URL + "/api/v1/mining/bonus", mMisesToken, getUserAgent(), new Callback<HttpUtil.HttpResp>() {
            @Override
            public final void onResult(HttpUtil.HttpResp result) {
                if (result.resp != null ) {
                    try {
                        if (result.resp.has("data")) {
                            JSONObject data = result.resp.getJSONObject("data");
                            
                            if (data.has("bonus")) {
                                mMisesBonus = data.getDouble("bonus");
                            }
                        }
                        
                    } catch (JSONException e) {
                        Log.d(TAG, "Unable to read JSONObject." + e.toString());
                    }
                    
                    
                    handleUserInfoUpdate();
                    
                }
            }
        });
    }
    private void updateUserInfoFromServer() {
        if (mMisesToken.isEmpty()) {
            Log.v(TAG, "updateUserInfoFromServer skip: not signin");
            return;
        }
        HttpUtil.JsonGetAsync(MISES_API_BASE_URL + "/api/v1/user/me", mMisesToken, getUserAgent(), new Callback<HttpUtil.HttpResp>() {
            @Override
            public final void onResult(HttpUtil.HttpResp result) {
                if (result.resp != null ) {
                    try {
                        if (result.resp.has("data")) {
                            JSONObject data = result.resp.getJSONObject("data");
                            
                            if (data.has("username")) {
                                mMisesNickname = data.getString("username");
                            }
                            if (data.has("avatar")) {
                                mMisesAvatar = data.getJSONObject("avatar").getString("medium");
                            } else {
                                mMisesAvatar = "";
                            }
                        }
                    } catch (JSONException e) {
                        Log.d(TAG, "Unable to read JSONObject." + e.toString());
                    }
                    

                    handleUserInfoUpdate();
                }
            }
        });
    }
    private void updateFromServer() {
        Log.v(TAG, "updateFromServer");
        JSONObject root = new JSONObject();
        try {
            JSONObject user_authz = new JSONObject();
            user_authz.put("auth", mMisesAuth);
            root.put("user_authz", user_authz);
        } catch (JSONException e) {
            Log.d(TAG, "Unable to write to a JSONObject.");
        }
        HttpUtil.JsonPostAsync(MISES_API_BASE_URL + "/api/v1/signin", root, "", getUserAgent(), new Callback<HttpUtil.HttpResp>() {
            @Override
            public final void onResult(HttpUtil.HttpResp result) {
                if (result.resp != null ) {
                    try {
                        if (result.resp.has("data")) {
                            JSONObject data = result.resp.getJSONObject("data");
                            if (data.has("token")) {
                                mMisesToken = data.getString("token");
                            }
                        }
                        
                    } catch (JSONException e) {
                        Log.d(TAG, "Unable to read JSONObject." + e.toString());
                    }
                    
                    updateUserInfoFromServer();
                    updateUserBonusFromServer(true);
                }
            }
        });
    }
    @CalledByNative
    public static void setMisesUserInfo(String json) {
        MisesController instance = getInstance();
    	if (json == null || json.isEmpty()) {
    	    instance.mMisesId = "";
    	    instance.mMisesToken = "";
    	    instance.mMisesNickname = "";
    	    instance.mMisesAvatar = "";
    	    instance.handleUserInfoUpdate();
        } else {
            try {
                JSONObject jsonMessage = new JSONObject(json);
                if (jsonMessage.has("misesId") && jsonMessage.has("auth")) {
                    instance.mMisesId = jsonMessage.getString("misesId");
                    instance.mMisesAuth = jsonMessage.getString("auth");
                    instance.updateFromServer();
                } else {
                    // old wallet signin not supported any more
                    // if (jsonMessage.has("misesId")) {
                    //     instance.mMisesId = jsonMessage.getString("misesId");
                    // }
                    // if (jsonMessage.has("token")) {
                    //     instance.mMisesToken = jsonMessage.getString("token");
                    // }
                    // if (jsonMessage.has("nickname")) {
                    //     instance.mMisesNickname = jsonMessage.getString("nickname");
                    // }
                    // if (jsonMessage.has("avatar")) {
                    //     instance.mMisesAvatar = jsonMessage.getString("avatar");
                    // } else {
                    //     instance.mMisesAvatar = "";
                    // }
                    // instance.handleUserInfoUpdate();

                }


            } catch (JSONException e) {
                Log.e(TAG, "setMisesUserInfo from plugin %s error", json);
            }
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

    public String getMisesBonusString() {
        DecimalFormat df = new DecimalFormat();
        df.setRoundingMode(RoundingMode.FLOOR);
        df.setMaximumFractionDigits(2);
        return df.format(mMisesBonus);
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

    public void callbackNotifyDialog(final String callback_id, int action) {
        MisesControllerJni.get().callbackNotifyDialog(callback_id, action);
    }

    @NativeMethods
    interface Natives {
        void callbackNotifyDialog(final String callback_id, int action);
    }
}
