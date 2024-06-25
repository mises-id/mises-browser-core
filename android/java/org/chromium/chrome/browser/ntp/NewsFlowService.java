package org.chromium.chrome.browser.ntp;

import android.net.Uri;

import java.util.List;

import org.chromium.base.Callback;
import org.chromium.base.Log;
import org.chromium.chrome.browser.content.ContentUtils;
import org.chromium.chrome.browser.mises.HttpUtil;
import org.chromium.chrome.browser.ntp.News;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class NewsFlowService {
    private static final String TAG = "NewsFlowService";
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
    
    private List<News> mNewsArray;
    private int mNextPageIndex;

    private Set<String> mNewsIds;

    public NewsFlowService() {
        mNewsArray = new ArrayList<>();
        mNextPageIndex = 0;
        mNewsIds = new HashSet<>();
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

    public static class UpdateAction {
        // ok表示请求成功或失败
        boolean ok;
        Range range;
        // haveMore表示是否有更多数据
        boolean haveMore;

        public UpdateAction(Range range, Boolean haveMore) {
            this.ok = true;
            this.range = range;
            this.haveMore = haveMore;
        }

        public UpdateAction() {
            this.ok = false;
            this.range = null;
            this.haveMore = false;
        }
    }

    public static class FetchNewsResp {
        boolean ok;
        JSONArray newsArray;
        int nextPageIndex;

        public FetchNewsResp(JSONArray newsArray, int nextPageIndex) {
            this.ok = true;
            this.newsArray = newsArray;
            this.nextPageIndex = nextPageIndex;
        }

        public FetchNewsResp() {
            this.ok = false;
            this.newsArray = null;
            this.nextPageIndex = -1;
        }
    }

    public void fetchMoreAsync(Callback<UpdateAction> completionHandler) {
        Log.d(TAG, "fetchMore: pageIndex=%d", mNextPageIndex);
        fetchNewsInPageAsync(
            mNextPageIndex,
            new Callback<FetchNewsResp>() {
                @Override
                public final void onResult(FetchNewsResp resp) {
                    if (resp.ok) {
                        Range range = appendNewsArrayToTail(resp.newsArray);
                        completionHandler.onResult(new UpdateAction(range, resp.nextPageIndex > 0));
                    } else {
                        completionHandler.onResult(new UpdateAction());
                    }
                }
            }
        );
    }

    public void refreshAsync(Callback<UpdateAction> completionHandler) {
        fetchNewsInPageAsync(
            0,
            new Callback<FetchNewsResp>() {
                @Override
                public final void onResult(FetchNewsResp resp) {
                    if (resp.ok) {
                        Range range = insertNewsArrayAtHead(resp.newsArray);
                        completionHandler.onResult(new UpdateAction(range, resp.nextPageIndex > 0));
                    } else {
                        completionHandler.onResult(new UpdateAction());
                    }
                }
            }
        );
    }

    private void fetchNewsInPageAsync(int pageIndex, Callback<FetchNewsResp> completionHandler) {
        Uri.Builder builder = new Uri.Builder()
            // .scheme("http")
            // .encodedAuthority("192.168.124.5:8080")
            // .encodedAuthority("172.20.10.2:8080")
            .scheme("https")
            .encodedAuthority("api.test.mises.site")
            .appendPath("api")
            .appendPath("v1")
            .appendPath("newslist")
            .appendQueryParameter("page_index", String.valueOf(pageIndex));
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
                            final int nextPageIndex = data.getInt("next_page_index");
                            mNextPageIndex = nextPageIndex;
                            if (completionHandler != null) {
                                completionHandler.onResult(new FetchNewsResp(newsJSONArray, nextPageIndex));
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
                final Date publishedAt = dateFormat.parse(publishedAtStr);
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
        int updateSize = mNewsArray.size() - start;
        Log.d(TAG, String.format("updated range: start=%d size=%d", start, updateSize));
        // notifyItemRangeChanged(changeedRangeStart, mNewsArray.size() - changeedRangeStart);
        return new Range(start, mNewsArray.size() - start);
    }

    private Range insertNewsArrayAtHead(final JSONArray newsJSONArray) {
        // 在头部添加
        List<News> newsArray = convertJSONNewsArray(newsJSONArray);
        List<News> newNewsArray = new ArrayList<>();
        for (News news : newsArray) {
            if (mNewsIds.contains(news.id)) {
                break;
            }
            mNewsIds.add(news.id);
            newNewsArray.add(news);
        }
        if (!newNewsArray.isEmpty()) {
            // int oldSize = mNewsArray.size();
            mNewsArray.addAll(0, newNewsArray);
            // notifyItemRangeInserted(0, newNewsArray.size());
            // notifyItemRangeChanged(newNewsArray.size(), oldSize);
        }

        return new Range(0, newNewsArray.size());
    }
}
