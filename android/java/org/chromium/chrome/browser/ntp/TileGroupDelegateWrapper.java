package org.chromium.chrome.browser.ntp;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import org.chromium.chrome.browser.mises.HttpUtil;
import org.chromium.chrome.browser.preferences.SharedPreferencesManager;

import org.chromium.chrome.browser.suggestions.SiteSuggestion;
import org.chromium.chrome.browser.suggestions.tile.Tile;
import org.chromium.chrome.browser.suggestions.mostvisited.MostVisitedSites;
import org.chromium.chrome.browser.suggestions.tile.TileGroup;

import org.chromium.chrome.browser.suggestions.tile.TileSectionType;
import org.chromium.chrome.browser.suggestions.tile.TileSource;
import org.chromium.chrome.browser.suggestions.tile.TileTitleSource;

import org.chromium.url.GURL;
import org.chromium.base.Log;
import org.chromium.base.ContextUtils;
import org.chromium.base.Callback;


public class TileGroupDelegateWrapper implements TileGroup.Delegate, MostVisitedSites.Observer {
    private static final String TAG = "TileGroupDelegateWrapper";
    public static final String PREF_WEB3_SITES_CACHE_JSON = "web3_sites_cache";
    public static final String PREF_WEB3_SITES_CACHE_TIMESTAMP = "web3_sites_cache_timestamp";
    public static final int WEB3_SITES_CACHE_EXPIRE_TIME = 3600;
    private TileGroup.Delegate mWrapped;
    private boolean mDestroyed;
    private ArrayList<MostVisitedSites.Observer> mObservers = new ArrayList<>();
    private List<SiteSuggestion> mSiteSuggestionsCache;
    private List<SiteSuggestion> mMisesServiceCache;
    private List<SiteSuggestion> mWeb3SiteCache;
    private List<SiteSuggestion> mWeb3ExtensionCache;
    public TileGroupDelegateWrapper(TileGroup.Delegate wrapped) {
        mWrapped = wrapped;
        mWrapped.setMostVisitedSitesObserver(this, 12);
        loadWeb3SitesCache();
        updateWeb3SitesCache(false);
    }
    private boolean isValid() {
        return mWrapped != null;
    }
    @Override
    public void removeMostVisitedItem(Tile item, Callback<GURL> removalUndoneCallback) {
        if (!isValid()) return;
        mWrapped.removeMostVisitedItem(item, removalUndoneCallback);
    }

    @Override
    public void openMostVisitedItem(int windowDisposition, Tile item) {
        if (!isValid()) return;
        mWrapped.openMostVisitedItem(windowDisposition, item);
    }

    @Override
    public void openMostVisitedItemInGroup(int windowDisposition, Tile item) {
        if (!isValid()) return;
        mWrapped.openMostVisitedItemInGroup(windowDisposition, item);
    }

    @Override
    public void setMostVisitedSitesObserver(MostVisitedSites.Observer observer, int maxResults) {
        Log.d(TAG, "setMostVisitedSitesObserver");
        mObservers.add(observer);
        handleCacheUpdate();
    }

    @Override
    public void onLoadingComplete(List<Tile> tiles) {
        if (!isValid()) return;
        mWrapped.onLoadingComplete(tiles);
    }

    @Override
    public void destroy() {
        if (!isValid()) return;
        mWrapped.destroy();
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

    void handleCacheUpdate() {
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
                    sites.add(new SiteSuggestion(
                        feature.getString("title"), 
                        new GURL(feature.getString("url")), 
                        TileTitleSource.TITLE_TAG,
                        TileSource.TOP_SITES, TileSectionType.PERSONALIZED
                    ));
                    
                }
                mMisesServiceCache = sites;
            }
            {
                final JSONArray recommended_sites = jsonMessage.getJSONArray("recommended_sites");
                ArrayList<SiteSuggestion> sites = new ArrayList<>();
                for( int i = 0 ;i < recommended_sites.length(); i ++ ) {
                    final JSONObject site = recommended_sites.getJSONObject(i);
                    sites.add(new SiteSuggestion(
                        site.getString("title"), 
                        new GURL(site.getString("url")), 
                        TileTitleSource.TITLE_TAG,
                        TileSource.TOP_SITES, TileSectionType.PERSONALIZED
                    ));
                    
                }
                mWeb3SiteCache = sites;
            }
            {
                final JSONArray recommended_extensions = jsonMessage.getJSONArray("recommended_extensions");
                ArrayList<SiteSuggestion> extensions = new ArrayList<>();
                for( int i = 0 ;i < recommended_extensions.length(); i ++ ) {
                    final JSONObject extension = recommended_extensions.getJSONObject(i);
                    extensions.add(new SiteSuggestion(
                        extension.getString("title"), 
                        new GURL(extension.getString("url")), 
                        TileTitleSource.TITLE_TAG,
                        TileSource.TOP_SITES, TileSectionType.PERSONALIZED
                    ));
                    
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
        int nowInSeconds = (int)(System.currentTimeMillis() / 1000);
        if (!force) {
            // check cache expiration
            final int cache_timestamp = ContextUtils.getAppSharedPreferences().getInt(
                PREF_WEB3_SITES_CACHE_TIMESTAMP, 0);
            if (cache_timestamp > 0 && (nowInSeconds - cache_timestamp < WEB3_SITES_CACHE_EXPIRE_TIME)) {
                Log.v(TAG, "updateWeb3SitesCache skip");
                return;
            }
        }

        HttpUtil.JsonGetAsync("https://web3.mises.site/website/config.json", new Callback<JSONObject>() {
            @Override
            public final void onResult(JSONObject result) {
                if (result != null && loadWeb3SitesJson(result)) {
                    SharedPreferencesManager.getInstance().writeStringUnchecked(
                        PREF_WEB3_SITES_CACHE_JSON, result.toString());
                    SharedPreferencesManager.getInstance().writeIntUnchecked(
                        PREF_WEB3_SITES_CACHE_TIMESTAMP, nowInSeconds);

                    handleCacheUpdate();
                }
            }
        });

    }
      
}
