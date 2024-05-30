package org.chromium.base;

import android.content.Context;
import android.os.Bundle;
import org.json.JSONException;
import org.json.JSONObject;

import org.chromium.chrome.browser.base.HttpUtil;
import com.vpn.lib.VPNInit;
import com.tencent.mmkv.MMKV;

import org.chromium.components.version_info.Channel;
import org.chromium.components.version_info.VersionConstants;
import org.chromium.components.version_info.VersionInfo;

public class MisesVpnUtils {
    private static final String TAG = "MisesVpnUtils";

    private static final String TOKEN_KEY = "MisesVpnToken";
    private static final String SERVER_CACHE_KEY = "MisesVpnServerCache";
    private static final String SERVER_CACHE_TIMESTAMP_KEY = "MisesVpnServerCacheTimeStamp";

    private static final long CACHE_EXPIRE_TIME = 3600;

    private static String sToken = "";

    public static boolean isVpnRelatedProcess() {
        boolean isBrowser =  !ContextUtils.getProcessName().contains(":");
        boolean isVpn = ContextUtils.getProcessName().contains("vpnLibDaemon");
        return isBrowser || isVpn;
    }

    public static void initApplication(final Context applicationContext) {
        if (isVpnRelatedProcess()) {
            MMKV.initialize(applicationContext);
            sToken = loadToken();
            initVpn(applicationContext);
        }

    }

    private static String loadToken() {
        MMKV kv = MMKV.defaultMMKV();
        return kv.decodeString(TOKEN_KEY);

    }

    private static boolean isValidServerList(final String json) {
        try {
            JSONObject jsonMessage = new JSONObject(json);
            if (jsonMessage.has("code") && jsonMessage.getInt("code") == 0) {
                return true;
            }


        } catch (JSONException e) {
            Log.e(TAG, "ServerList %s error", json);
        }
        return false;
    }
    private static void saveServerCache(final String json) {
        if (isValidServerList(json)) {
            MMKV kv = MMKV.defaultMMKV();
            long nowInSeconds = System.currentTimeMillis() / 1000;
            kv.encode(SERVER_CACHE_TIMESTAMP_KEY, nowInSeconds);
            kv.encode(SERVER_CACHE_KEY, json);
        }
    }
    private static String loadServerCache() {
        MMKV kv = MMKV.defaultMMKV();
        if (!kv.containsKey(SERVER_CACHE_TIMESTAMP_KEY) || !kv.containsKey(SERVER_CACHE_KEY)) {
            return "";
        }
        long nowInSeconds = System.currentTimeMillis() / 1000;
        long timeStamp = kv.decodeLong(SERVER_CACHE_TIMESTAMP_KEY);
        if (nowInSeconds - timeStamp > CACHE_EXPIRE_TIME) {
            //expired
            return "";
        }
        return kv.decodeString(SERVER_CACHE_KEY);
    }

    public static void updateToken(final String token) {
        if (token != null && !token.isEmpty()) {
            VPNInit.INSTANCE.setVip(true);
            sToken = token;

        } else {
            VPNInit.INSTANCE.setVip(false);
            sToken = "";
        }
        MMKV kv = MMKV.defaultMMKV();
        kv.encode(TOKEN_KEY, sToken);

    }

    private static String getVpnApiHost() {
        if (VersionConstants.CHANNEL == Channel.DEV || VersionConstants.CHANNEL == Channel.DEFAULT)  {
            return "https://api1.test.mises.site";
        } else {
            return "https://api.alb.mises.site";
        }
    }

    private static void initVpn(final Context applicationContext) {
        Log.i(TAG, "initVpn!");
        
        VPNInit.INSTANCE.init(applicationContext, new VPNInit.ISdk() {
            @Override
            public String getConfig(String ip) {
                Log.i(TAG, "getConfig: ip" + ip);
                JSONObject root = new JSONObject();
                try {
                    root.put("server", ip);
                } catch (JSONException e) {
                    return "{ \"code\": -1, \"msg\": \"Unable to write to a JSONObject\" }";
                }

                HttpUtil.HttpResp result = HttpUtil.JsonPostSync( getVpnApiHost() + "/api/v1/vpn/server_link", root, sToken, "");
                if (result.resp != null) {
                    Log.i(TAG, "getConfig:" + result.resp.toString());
                    return result.resp.toString();
                }
                Log.i(TAG, "getConfig: fail" );
                return "{ \"code\": -1, \"msg\": \"service error\" }";
                
            }
            @Override
            public String getServer() {
                final String cached = loadServerCache();
                if (isValidServerList(cached)) {
                    Log.i(TAG, "getServer(cached):" + cached);
                    return cached;
                }

                
                HttpUtil.HttpResp result = HttpUtil.JsonGetSync( getVpnApiHost() + "/api/v1/vpn/server_list", sToken, "");
                if (result.resp != null) {
                    final String jsonString = result.resp.toString();
                    Log.i(TAG, "getServer:" + jsonString);
                    saveServerCache(jsonString);
                    return jsonString;
                }
                Log.i(TAG, "getServer: fail" );
                return "{ \"code\": -1, \"msg\": \"service error\" }";
            }
        });
    }
    
    public static void openVpn(final Context context) {
        sToken = loadToken();
        VPNInit.INSTANCE.startVpn(context);
    }

}