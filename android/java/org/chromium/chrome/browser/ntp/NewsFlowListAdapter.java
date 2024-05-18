package org.chromium.chrome.browser.ntp;

import static org.chromium.ui.base.ViewUtils.dpToPx;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import android.app.Activity;
import android.net.Uri;
import android.view.View;
import android.view.ViewGroup;
import android.view.LayoutInflater;
import android.widget.TextView;
import android.widget.ImageView;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import android.graphics.drawable.Drawable;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.target.Target;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import org.chromium.base.Callback;
import org.chromium.base.Log;
import org.chromium.chrome.browser.content.ContentUtils;
import org.chromium.chrome.browser.mises.HttpUtil;
import org.chromium.chrome.browser.ntp.News;
import org.chromium.chrome.browser.tab.TabLaunchType;
import org.chromium.chrome.browser.tabmodel.TabCreatorManager;
import org.chromium.chrome.browser.tabmodel.TabCreator;
import org.chromium.chrome.R;
import org.chromium.url.GURL;

public class NewsFlowListAdapter extends RecyclerView.Adapter<NewsFlowListAdapter.ViewHolder> {

    private static final String TAG = "NewsFlowListAdapter";
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
    
    private Activity mActivity;
    private List<News> mNewsArray;
    private int mNextPageIndex;

    private Set<String> mNewsIds;
    private TabCreator mTabCreator;

    public NewsFlowListAdapter(Activity activity) {
        mActivity = activity;
        mNewsArray = new ArrayList<>();
        mNextPageIndex = 0;
        mNewsIds = new HashSet<>();

        if (activity instanceof TabCreatorManager) {
            mTabCreator = ((TabCreatorManager)activity).getTabCreator(false);
        }
    }

    public void startFetchAsync() {
        fetchNewsInPageAsync(null);
    }

    public void fetchMoreAsync(Callback<FetchNewsResp> callback) {
        Log.d(TAG, "fetchMore: pageIndex=%d", mNextPageIndex);
        fetchNewsInPageAsync(callback);
    }

    public class FetchNewsResp {
        int nextPageIndex;

        public FetchNewsResp(int nextPageIndex) {
            this.nextPageIndex = nextPageIndex;
        }
    }

    // static private String fetchNewsURL = "http://192.168.124.2:8080/api/v1/user/newslist";
    private void fetchNewsInPageAsync(Callback<FetchNewsResp> callback) {
        int pageIndex = mNextPageIndex;
        Uri.Builder builder = new Uri.Builder()
            // .scheme("http")
            // .encodedAuthority("192.168.124.2:8080")
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
                            final JSONArray newsArray = data.getJSONArray("news_array");
                            final int nextPageIndex = data.getInt("next_page_index");
                            mNextPageIndex = nextPageIndex;
                            if (callback != null) {
                                callback.onResult(new FetchNewsResp(nextPageIndex));
                            }
                            appendNewsArray(newsArray);
                        } catch (JSONException e) {
                            Log.e(TAG, "load news array from json error");
                        }
                    }
                }
            });
    }

    private void appendNewsArray(final JSONArray newsArray) {
        final int changeedRangeStart = mNewsArray.size();
        final int length = newsArray.length();
        for (int i = 0; i < length; i ++) {
            try {
                final JSONObject newsObj = newsArray.getJSONObject(i);
                final String id = newsObj.getString("id");
                if (mNewsIds.contains(id)) {
                    continue;
                }

                final String title = newsObj.getString("title");
                final String url = newsObj.getString("url");
                final String imageURL = newsObj.getString("image_url");
                final String source = newsObj.getJSONObject("source").getString("title");
                final String publishedAtStr = newsObj.getString("published_at");
                final Date publishedAt = dateFormat.parse(publishedAtStr);
                News news = new News(id, title, url, imageURL, source, publishedAt);
                mNewsArray.add(news);
                Log.d(TAG, String.format("fetch new news: id=%s title=%s", id, title));
            } catch (JSONException e) {
                Log.e(TAG, "load news from json error");
            } catch (ParseException e) {
                Log.e(TAG, "parse date error");
            }
        }
        Log.d(TAG, String.format("notifyItemRangeChanged: start=%d size=%d", changeedRangeStart, mNewsArray.size()- changeedRangeStart));
        notifyItemRangeChanged(changeedRangeStart, mNewsArray.size() - changeedRangeStart);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.setNews(mNewsArray.get(position));
        News news = mNewsArray.get(position);
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                Log.d(TAG, String.format("click news: url=%s", news.url));
                if (mTabCreator != null) {
                    mTabCreator.launchUrl(news.url, TabLaunchType.FROM_LINK);
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return mNewsArray.size();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.mises_news_flow_list_item, parent, false);
        return new ViewHolder(itemView);
    }

    class ViewHolder extends RecyclerView.ViewHolder {

        // private static SimpleDateFormat sDateFormat;

        TextView mtvTitle;
        ImageView mivImage;
        TextView mtvSource;
        TextView mtvPublishedAt;

        public ViewHolder(View itemView) {
            super(itemView);

            /*if (sDateFormat == null) {
                sDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            }*/

            mtvTitle = (TextView) itemView.findViewById(R.id.tv_title);
            mivImage = (ImageView) itemView.findViewById(R.id.iv_image);
            mtvSource = (TextView) itemView.findViewById(R.id.tv_source);
            mtvPublishedAt = (TextView) itemView.findViewById(R.id.tv_published_at);
        }

        private String dateOffsetNowDesc(Date date) {
            long offset = (new Date().getTime() - date.getTime()) / 1000;
            if (offset == 0) {
                return "now";
            }

            final String suffix = offset > 0 ? "ago" : "later";
            if (offset < 60) {
                return String.format("%d seconds %s", offset, suffix);
            }

            offset /= 60;
            if (offset < 60) {
                return String.format("%d minutes %s", offset, suffix);
            }

            offset /= 60;
            if (offset < 60) {
                return String.format("%d hours %s", offset, suffix);
            }

            offset /= 24;
            return String.format("%d days %s", offset, suffix);
        }

        public void setNews(News news) {
            mtvTitle.setText(news.title);
            mtvSource.setText(news.source);
            mtvPublishedAt.setText(
                String.format("%s", dateOffsetNowDesc(news.publishedAt)));
            Log.d(TAG, String.format("setNews: imageURL=%s", news.imageURL));
            RequestOptions options = new RequestOptions().transform(new RoundedCorners(dpToPx(mActivity, 10)));
            Glide.with(itemView.getContext())
                .load(news.imageURL)
                .listener(new RequestListener<Drawable>() {
                    @Override
                    public boolean onLoadFailed(
                        @Nullable GlideException e,
                        Object model,
                        Target<Drawable> target,
                        boolean isFirstResource) {
                            Log.e(TAG, "fetch image in news failed: id=%s url=`%s` err=%s", news.id, news.imageURL, e.toString());
                            return false;
                        }
                    
                    @Override
                    public boolean onResourceReady(
                        Drawable resource,
                        Object model,
                        Target<Drawable> target,
                        DataSource dataSource,
                        boolean isFirstResource) {
                            mivImage.setVisibility(View.VISIBLE);
                            return false;
                        }
                })
                .apply(options)
                .into(mivImage);
        }
    }
}