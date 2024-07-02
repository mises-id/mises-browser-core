package org.chromium.chrome.browser.ntp;

import android.net.Uri;

import androidx.annotation.Nullable;

import org.chromium.base.Callback;
import org.chromium.base.Log;
import org.chromium.chrome.browser.content.ContentUtils;
import org.chromium.chrome.browser.feed.FeedPersistentKeyValueCache;
import org.chromium.chrome.browser.mises.HttpUtil;
import org.chromium.chrome.browser.ntp.News;
import org.chromium.chrome.browser.xsurface.PersistentKeyValueCache;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class NewsFlowService {
    private static final String TAG = "NewsFlowService";
    private static final SimpleDateFormat DateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
    private static final byte[] mCacheKey = "news-flow-cache".getBytes(StandardCharsets.UTF_8);
    private static final int MaxNumOfNewsInCache = 100;

    private final FeedPersistentKeyValueCache mPersistentKeyValueCache =
            new FeedPersistentKeyValueCache();
    
    private List<News> mNewsArray;
    // private int mNextPageIndex;

    private Set<String> mNewsIds;

    public NewsFlowService() {
        mNewsArray = new ArrayList<>();
        // mNextPageIndex = 0;
        mNewsIds = new HashSet<>();
    }

    private String idOfLastNews() {
        if (mNewsArray.isEmpty()) {
            return null;
        }

        return mNewsArray.get(mNewsArray.size() - 1).id;
    }

    public void initialize(Callback<RefreshResponse> completionHandler) {
        loadNewsArrayFromCache(completionHandler);
    }

    private void loadNewsArrayFromCache(Callback<RefreshResponse> completionHandler) {
        // 从缓存中读取
        Log.v(TAG, "loadNewsArrayFromCache");
        mPersistentKeyValueCache.lookup(mCacheKey, new PersistentKeyValueCache.ValueConsumer() {
            @Override
            public void run(@Nullable byte[] value) {
                Log.v(TAG, "loadNewsArrayFromCache value="+Arrays.toString(value));
                if (value == null) {
                    return;
                }

                JSONArray jsonArray = convertBytes2JSONArray(value);
                if (jsonArray.length() == 0) {
                    return;
                }

                replaceNewsArray(jsonArray);
                completionHandler.onResult(new RefreshResponse(true).reloadAll());
            }
        });
    }

    // 保存到缓存中
    private void saveNewsArray2Cache() {
        int numOfNews = 0;
        List<News> newsArray = new ArrayList<>();
        for (News news : mNewsArray) {
            if (numOfNews >= MaxNumOfNewsInCache) {
                break;
            }
            newsArray.add(news);
            numOfNews += 1;
        }

        JSONArray jsonNewsArray = convertNewsArray2JSONArray(newsArray);

        byte[] value = convertJSONArray2Bytes(jsonNewsArray);
        Log.v(TAG, "cacheKey="+Arrays.toString(mCacheKey));
        Log.v(TAG, "value="+Arrays.toString(value));
        mPersistentKeyValueCache.put(mCacheKey, value, () -> {
            Log.v(TAG, "save news array to cache done");
        });
        Log.v(TAG, "saveNewsArray2Cache done");
    }

    public int numOfNews() {
        return mNewsArray.size();
    }

    public News newsAtIndex(int index) {
        return mNewsArray.get(index);
    }

    public static class Range {
        int start;
        int size;

        public Range(int start, int size) {
            this.start = start;
            this.size = size;
        }

        public int end() {
            return this.start + this.size;
        }
    }

    public static class RefreshResponse {
        // ok表示请求成功或失败
        boolean ok;
        // haveMore表示是否有更多数据
        boolean haveMore;
        public List<UpdateAction> actions;

        public RefreshResponse(Boolean haveMore) {
            this.ok = true;
            this.haveMore = haveMore;
            this.actions = new ArrayList<>();
        }

        public RefreshResponse insert(Range range) {
            this.actions.add(new UpdateAction(UpdateMode.INSERTED, range));
            return this;
        }

        public RefreshResponse remove(Range range) {
            this.actions.add(new UpdateAction(UpdateMode.REMOVED, range));
            return this;
        }

        public RefreshResponse change(Range range) {
            this.actions.add(new UpdateAction(UpdateMode.CHANGED, range));
            return this;
        }

        public RefreshResponse reloadAll() {
            this.actions.add(new UpdateAction(UpdateMode.RELOAD_ALL, null));
            return this;
        }

        public RefreshResponse withActions(List<UpdateAction> actions) {
            this.actions.addAll(actions);
            return this;
        }

        public RefreshResponse() {
            this.ok = false;
            this.haveMore = false;
        }
    }

    public static class UpdateAction {
        UpdateMode mode;
        Range range;

        public UpdateAction(UpdateMode mode, Range range) {
            this.mode = mode;
            this.range = range;
        }
    }

    enum UpdateMode {
        INSERTED,
        REMOVED,
        CHANGED,
        RELOAD_ALL,
        /* MOVED(3), */
    }

    public static class FetchNewsResp {
        boolean ok;
        JSONArray newsArray;
        boolean haveMore;

        public FetchNewsResp(JSONArray newsArray, boolean haveMore) {
            this.ok = true;
            this.newsArray = newsArray;
            this.haveMore = haveMore;
        }

        public FetchNewsResp() {
            this.ok = false;
            this.newsArray = null;
            this.haveMore = false;
        }
    }

    public void fetchMoreAsync(Callback<RefreshResponse> completionHandler) {
        Log.d(TAG, "fetchMore: idOfLastNews=%s", idOfLastNews());
        fetchNewsInPageAsync(
            // mNextPageIndex,
            idOfLastNews(),
            new Callback<FetchNewsResp>() {
                @Override
                public final void onResult(FetchNewsResp resp) {
                    if (resp.ok) {
                        Range range = appendNewsArrayToTail(resp.newsArray);
                        saveNewsArray2Cache();
                        completionHandler.onResult(new RefreshResponse(resp.haveMore).insert(range));
                    } else {
                        completionHandler.onResult(new RefreshResponse());
                    }
                }
            }
        );
    }

    public void refreshAsync(Callback<RefreshResponse> completionHandler) {
        fetchNewsInPageAsync(
            null,
            new Callback<FetchNewsResp>() {
                @Override
                public final void onResult(FetchNewsResp resp) {
                    if (resp.ok) {
                        List<UpdateAction> actions = insertNewsArrayAtHead(resp.newsArray);
                        saveNewsArray2Cache();
                        completionHandler.onResult(new RefreshResponse(resp.haveMore).withActions(actions));
                    } else {
                        completionHandler.onResult(new RefreshResponse());
                    }
                }
            }
        );
    }

    private void fetchNewsInPageAsync(String newsIdBefore, Callback<FetchNewsResp> completionHandler) {
        Uri.Builder builder = new Uri.Builder()
            // .scheme("http")
            // .encodedAuthority("192.168.124.5:8080")
            // .encodedAuthority("172.20.10.2:8080")
            .scheme("https")
            .encodedAuthority("api.test.mises.site")
            .appendPath("api")
            .appendPath("v1")
            .appendPath("newslist2");
            //.appendQueryParameter("page_index", String.valueOf(pageIndex));
        if (newsIdBefore != null) {
            builder.appendQueryParameter("news_id", newsIdBefore);
        }
        Log.d(TAG, String.format("fetchNewsInPageAsync: url=%s", builder.toString()));
        HttpUtil.JsonGetAsync(
            builder.toString(),
            "",
            ContentUtils.getBrowserUserAgent(),
            new Callback<HttpUtil.HttpResp>() {
                @Override
                public final void onResult(HttpUtil.HttpResp result) {
                    Log.d(TAG, String.format("fetchNewsInPageAsync Resp: resp.code=%d", result.code));
                    if (result.resp != null) {
                        try {
                            final JSONObject data = result.resp.getJSONObject("data");
                            final JSONArray newsJSONArray = data.getJSONArray("news_array");
                            final boolean haveMore = data.getBoolean("have_more");
                            // final int nextPageIndex = data.getInt("next_page_index");
                            // mNextPageIndex = nextPageIndex;
                            if (completionHandler != null) {
                                completionHandler.onResult(new FetchNewsResp(newsJSONArray, haveMore));
                            }
                        } catch (JSONException e) {
                            Log.e(TAG, "load news array from json error");
                            if (completionHandler != null) {
                                completionHandler.onResult(new FetchNewsResp());
                            }
                        }
                    } else {
                        if (completionHandler != null) {
                            completionHandler.onResult(new FetchNewsResp());
                        }
                    }
                }
            });
    }

    static private List<News> convertJSONNewsArray(final JSONArray newsJSONArray) {
        final int length = newsJSONArray.length();
        List<News> newsArray = new ArrayList<>();
        for (int i = 0; i < length; i ++) {
            try {
                final JSONObject newsObj = newsJSONArray.getJSONObject(i);
                final String id = newsObj.getString("id");
                final String title = newsObj.getString("title");
                final String link = newsObj.getString("link");
                final String thumbnail = newsObj.getString("thumbnail");
                final String source = newsObj.getJSONObject("source").getString("title");
                final String publishedAtStr = newsObj.getString("published_at");
                final Date publishedAt = DateFormat.parse(publishedAtStr);
                News news = new News(id, title, link, thumbnail, source, publishedAt);
                newsArray.add(news);
                Log.d(TAG, String.format("fetch new news: id=%s title=%s", id, title));
            } catch (JSONException e) {
                Log.e(TAG, "load news from json error");
            } catch (ParseException e) {
                Log.e(TAG, "parse date error");
            }
        }
        return newsArray;
    }

    static private JSONArray convertNewsArray2JSONArray(final List<News> newsArray) {
        JSONArray jsonArray = new JSONArray();
        for (News news : newsArray) {
            try {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", news.id);
                jsonObject.put("title", news.title);
                jsonObject.put("link", news.link);
                jsonObject.put("thumbnail", news.thumbnail);

                JSONObject jsonSource = new JSONObject();
                jsonSource.put("title", news.source);
                jsonObject.put("source", jsonSource);

                jsonObject.put("published_at", DateFormat.format(news.publishedAt));

                jsonArray.put(jsonObject);
            } catch (JSONException e) {
                Log.e(TAG, "assemble JSONObject failed:"+e);
            }
        }

        return jsonArray;
    }

    private Range appendNewsArrayToTail(final JSONArray newsJSONArray) {
        final int start = mNewsArray.size();
        List<News> newsArray = convertJSONNewsArray(newsJSONArray);
        for (News news : newsArray) {
            if (mNewsIds.contains(news.id)) {
                continue;
            }
            mNewsIds.add(news.id);
            mNewsArray.add(news);
        }
        // int updateSize = mNewsArray.size() - start;
        // Log.d(TAG, String.format("updated range: start=%d size=%d", start, updateSize));
        return new Range(start, mNewsArray.size() - start);
    }

    private void replaceNewsArray(final JSONArray newsJSONArray) {
        List<News> newsArray = convertJSONNewsArray(newsJSONArray);
        mNewsIds.clear();
        for (News news : newsArray) {
            mNewsIds.add(news.id);
        }
        mNewsArray.clear();
        mNewsArray.addAll(newsArray);
    }

    /*private Range appendNewsArray(final JSONArray newsJSONArray) {
        List<News> newsArray = convertJSONNewsArray(newsJSONArray);
        for (News news : newsArray) {
            if (mNewsIds.contains(news.id)) {
                continue;
            }
            mNewsIds.add(news.id);
            mNewsArray.add(news);
        }
        Collections.sort(mNewsArray, new Comparator<News>() {
            @Override
            public int compare(News lhs, News rhs) {
                if (lhs.publishedAt.before(rhs.publishedAt)) {
                    return -1;
                } else if (lhs.publishedAt.after(rhs.publishedAt)) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
        return new Range(0, newsArray.size());
    }*/

    // 在头部添加新闻数组
    // 如果插入的新闻数组跟现存的新闻数组没有重复部分，则只留下新插入的新闻数组
    private List<UpdateAction> insertNewsArrayAtHead(final JSONArray newsJSONArray) {
        List<UpdateAction> actions = new ArrayList<>();
        // 在头部添加
        List<News> newsArray = convertJSONNewsArray(newsJSONArray);
        Set<String> newNewsIdSet = new HashSet<>();
        List<News> newNewsArray = new ArrayList<>();
        boolean isOverlap = false;
        for (News news : newsArray) {
            if (mNewsIds.contains(news.id)) {
                isOverlap = true;
                break;
            }
            newNewsIdSet.add(news.id);
            newNewsArray.add(news);
        }

        if (newNewsArray.isEmpty()) {
            return actions;
        }

        if (!isOverlap) {
            actions.add(new UpdateAction(UpdateMode.REMOVED, new Range(0, mNewsArray.size())));
            mNewsIds = newNewsIdSet;
            mNewsArray = newNewsArray;
            actions.add(new UpdateAction(UpdateMode.INSERTED, new Range(0, mNewsArray.size())));
            return actions;
        }

        mNewsIds.addAll(newNewsIdSet);
        mNewsArray.addAll(0, newNewsArray);
        actions.add(new UpdateAction(UpdateMode.INSERTED, new Range(0, newNewsArray.size())));
        return actions;
    }

    private byte[] convertJSONArray2Bytes(JSONArray jsonArray) {
        final String text = jsonArray.toString();
        return text.getBytes(StandardCharsets.UTF_8);
    }

    private JSONArray convertBytes2JSONArray(byte[] bytes) {
        final String text = new String(bytes, StandardCharsets.UTF_8);
        try {
            return new JSONArray(text);
        } catch (JSONException e) {
            Log.e(TAG, "convert string to json array failed: "+e);
            return new JSONArray();
        }
    }
}
