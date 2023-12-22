package org.chromium.chrome.browser.ntp;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.Map;
import java.util.HashMap;

import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.mises.HttpUtil;
import org.chromium.base.shared_preferences.SharedPreferencesManager;
import org.chromium.chrome.browser.preferences.ChromeSharedPreferences;

import org.chromium.chrome.browser.suggestions.SiteSuggestion;
import org.chromium.chrome.browser.suggestions.MisesSiteSuggestion;
import org.chromium.chrome.browser.suggestions.tile.Tile;
import org.chromium.chrome.browser.suggestions.mostvisited.MostVisitedSites;
import org.chromium.chrome.browser.suggestions.tile.TileGroup;

import org.chromium.chrome.browser.suggestions.tile.TileSectionType;
import org.chromium.chrome.browser.suggestions.tile.TileSource;
import org.chromium.chrome.browser.suggestions.tile.TileTitleSource;
import org.chromium.chrome.browser.AppMenuBridge;
import org.chromium.chrome.browser.content.ContentUtils;

import org.chromium.url.GURL;
import org.chromium.base.Log;
import org.chromium.base.ContextUtils;
import org.chromium.base.Callback;
import org.chromium.base.MisesSysUtils;


public class TileGroupDelegateWrapper implements TileGroup.Delegate, MostVisitedSites.Observer {
    private static final String TAG = "TileGroupDelegateWrapper";
    public static final String PREF_WEB3_SITES_CACHE_JSON = "web3_sites_cache";
    public static final int WEB3_SITES_CACHE_EXPIRE_TIME = 3600;
    private static long sWeb3SitesCacheTimestapm;
    private TileGroup.Delegate mWrapped;
    private boolean mReady;
    private ArrayList<MostVisitedSites.Observer> mObservers = new ArrayList<>();
    private List<SiteSuggestion> mSiteSuggestionsCache;
    private List<SiteSuggestion> mMisesServiceCache;
    private List<SiteSuggestion> mWeb3SiteCache;
    private List<SiteSuggestion> mWeb3ExtensionCache;
    public TileGroupDelegateWrapper(TileGroup.Delegate wrapped) {
        Log.d(TAG, "New");
        mWrapped = wrapped;
        mWrapped.setMostVisitedSitesObserver(this, 12);
        loadWeb3SitesCache();
        updateWeb3SitesCache(false);
    }
    public void setReady() {
        mReady = true;
        handleCacheUpdate();
    }
    private boolean isReady() {
        return mReady;
    }
    private boolean isValid() {
        return mWrapped != null;
    }
    @Override
    public void removeMostVisitedItem(Tile item, Callback<GURL> removalUndoneCallback) {
        if (!isValid()) return;
        mWrapped.removeMostVisitedItem(item, removalUndoneCallback);

        if (item.getData() != null) {
            final SiteSuggestion suggestion = (SiteSuggestion)item.getData();
            MisesSysUtils.logEvent("ntp_delete_most_visited", "url", suggestion.url.getSpec());
        }
    }

    @Override
    public void openMostVisitedItem(int windowDisposition, Tile item) {
        if (!isValid()) return;
        mWrapped.openMostVisitedItem(windowDisposition, item);
        logItemOpened(item);
    }

    @Override
    public void openMostVisitedItemInGroup(int windowDisposition, Tile item) {
        if (!isValid()) return;
        mWrapped.openMostVisitedItemInGroup(windowDisposition, item);
        logItemOpened(item);
    }
    private void logItemOpened(Tile item) {
        if (item.getData() != null && item.getData() instanceof MisesSiteSuggestion) {
            final MisesSiteSuggestion suggestion = (MisesSiteSuggestion)item.getData();
            if (suggestion.extensionID != null) {
                MisesSysUtils.logEvent("ntp_open_extension", "url", suggestion.url.getSpec());
            } else {
                MisesSysUtils.logEvent("ntp_open_web3_site", "url", suggestion.url.getSpec());
            }
        } else if (item.getData() != null) {
            final SiteSuggestion suggestion = (SiteSuggestion)item.getData();
            MisesSysUtils.logEvent("ntp_open_visited_site", "url", suggestion.url.getSpec());
        }
    }

    @Override
    public void setMostVisitedSitesObserver(MostVisitedSites.Observer observer, int maxResults) {
        Log.d(TAG, "setMostVisitedSitesObserver");
        mObservers.add(observer);
    }

    @Override
    public void onLoadingComplete(List<Tile> tiles) {
        if (!isValid()) return;
        mWrapped.onLoadingComplete(tiles);
    }

    @Override
    public void destroy() {
        if (!isValid()) return;
        mWrapped = null;
    }

    @Override
    public void onSiteSuggestionsAvailable(List<SiteSuggestion> siteSuggestions) {
        if (!isValid()) return;
        Log.d(TAG, "onSiteSuggestionsAvailable");
        mSiteSuggestionsCache = siteSuggestions;
        handleCacheUpdate();
    }

    @Override
    public void onIconMadeAvailable(GURL siteUrl) {
        if (!isValid()) return;
        Log.d(TAG, "onIconMadeAvailable");
        for (MostVisitedSites.Observer observer : mObservers) {
            observer.onIconMadeAvailable(siteUrl);
        }

    }

    private void handleCacheUpdate() {
        if (!isValid() || !isReady()) {
            Log.v(TAG, "handleCacheUpdate skip");
            return;
        }
        Log.v(TAG, "handleCacheUpdate");
        if (mObservers.size() >= 1 && mSiteSuggestionsCache != null) {
            mObservers.get(0).onSiteSuggestionsAvailable(mSiteSuggestionsCache);
        }

        if (mObservers.size() >= 2 &&  mMisesServiceCache != null) {
            mObservers.get(1).onSiteSuggestionsAvailable(mMisesServiceCache);
        }

        if (mObservers.size() >= 3 &&  mWeb3SiteCache != null) {
            mObservers.get(2).onSiteSuggestionsAvailable(mWeb3SiteCache);
        }
        if (mObservers.size() >= 4 &&  mWeb3ExtensionCache != null) {
            mObservers.get(3).onSiteSuggestionsAvailable(mWeb3ExtensionCache);
        }
    }

    private void loadWeb3SitesCache() {
         Log.v(TAG, "loadWeb3SitesCache");
        final String cache_str = ContextUtils.getAppSharedPreferences().getString(
                PREF_WEB3_SITES_CACHE_JSON, "");
        if (cache_str != null && !cache_str.isEmpty()) {
            try {
                JSONObject jsonMessage = new JSONObject(cache_str);
                if (loadWeb3SitesJson(jsonMessage)) {
                    handleCacheUpdate();
                }
            } catch (JSONException e) {
                Log.e(TAG, "load web3_sites from cache %s error", cache_str);
            }

        }
    }

    boolean loadWeb3SitesJson(JSONObject jsonMessage) {
        Log.v(TAG, "loadWeb3SitesJson");
        boolean ret = true;
        try {
            {
                final JSONArray feature_list = jsonMessage.getJSONArray("feature_list");
                ArrayList<SiteSuggestion> sites = new ArrayList<>();
                for( int i = 0 ;i < feature_list.length(); i ++ ) {
                    final JSONObject feature = feature_list.getJSONObject(i);
                    final MisesSiteSuggestion suggestion = new MisesSiteSuggestion(
                        feature.getString("title"), 
                        new GURL(feature.getString("url")), 
                        TileTitleSource.TITLE_TAG,
                        TileSource.TOP_SITES, 
                        TileSectionType.PERSONALIZED
                    );
                    suggestion.setIconUrl(new GURL(feature.getString("logo")));
                    sites.add(suggestion);
                    
                }
                mMisesServiceCache = sites;
            }
            {
                final JSONArray recommended_sites = jsonMessage.getJSONArray("recommended_sites");
                ArrayList<SiteSuggestion> sites = new ArrayList<>();
                for( int i = 0 ;i < recommended_sites.length(); i ++ ) {
                    final JSONObject site = recommended_sites.getJSONObject(i);
                    final MisesSiteSuggestion suggestion = new MisesSiteSuggestion(
                        site.getString("title"), 
                        new GURL(site.getString("url")), 
                        TileTitleSource.TITLE_TAG,
                        TileSource.TOP_SITES, 
                        TileSectionType.PERSONALIZED
                    );
                    suggestion.setIconUrl(new GURL(site.getString("logo")));
                    sites.add(suggestion);
                    
                }
                mWeb3SiteCache = sites;
            }
            {
                final JSONArray recommended_extensions = jsonMessage.getJSONArray("recommended_extensions");
                ArrayList<SiteSuggestion> extensions = new ArrayList<>();
                Map<String, String> running_extensions = getRunningExtensions();
                for( int i = 0 ;i < recommended_extensions.length(); i ++ ) {
                    final JSONObject extension = recommended_extensions.getJSONObject(i);
                    final String extension_id = extension.getString("extension_id");
                    String url = extension.getString("url");
                    if (running_extensions.containsKey(extension_id)) {
                        url = running_extensions.get(extension_id);
                    }
                    final MisesSiteSuggestion suggestion = new MisesSiteSuggestion(
                        extension.getString("title"), 
                        new GURL(url), 
                        TileTitleSource.TITLE_TAG,
                        TileSource.TOP_SITES, 
                        TileSectionType.PERSONALIZED
                    );
                    suggestion.setIconUrl(new GURL(extension.getString("logo")));
                    suggestion.setExtensionID(extension_id);

                    extensions.add(suggestion);
                    
                }
                mWeb3ExtensionCache = extensions;
            }


            
        } catch (JSONException e) {
            Log.e(TAG, "load web3_sites from json error");
            ret = false;
        }
        return ret;
    }
    private void updateWeb3SitesCache(boolean force) {
        Log.v(TAG, "updateWeb3SitesCache force:" + force);
        long nowInSeconds = System.currentTimeMillis() / 1000;
        if (!force) {
            // check cache expiration
            if (sWeb3SitesCacheTimestapm > 0 && (nowInSeconds - sWeb3SitesCacheTimestapm < WEB3_SITES_CACHE_EXPIRE_TIME)) {
                Log.v(TAG, "updateWeb3SitesCache skip");
                return;
            }
        }
        // "https://web3.test.mises.site/website/test_config.json"
        HttpUtil.JsonGetAsync("https://web3.mises.site/website/config.json", "", ContentUtils.getBrowserUserAgent(), new Callback<HttpUtil.HttpResp>() {
            @Override
            public final void onResult(HttpUtil.HttpResp result) {
                if (result.resp != null && loadWeb3SitesJson(result.resp)) {
                    SharedPreferencesManager sharedPreferencesManager = ChromeSharedPreferences.getInstance();
                    sharedPreferencesManager.writeStringUnchecked(
                        PREF_WEB3_SITES_CACHE_JSON, result.resp.toString());
                    sWeb3SitesCacheTimestapm = nowInSeconds;

                    handleCacheUpdate();
                }
            }
        });

    }

    private Map<String, String> getRunningExtensions() {
        Map<String, String> extensionInfos = new HashMap<String, String>();
        Profile profile = Profile.getLastUsedRegularProfile();
        String extensions = AppMenuBridge.getForProfile(profile).getRunningExtensions(null);
        if (!extensions.isEmpty()) {
            String[] extensionsArray = extensions.split("\u001f");
            for (String extension: extensionsArray) {
              String[] extensionsInfo = extension.split("\u001e");
              if (extensionsInfo.length > 2 && !extensionsInfo[2].equals("")) {
                extensionInfos.put( extensionsInfo[1],  extensionsInfo[2]);
              }
            }
        }
        return extensionInfos;
    }
      
}
