package org.chromium.chrome.browser.suggestions.tile;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.DrawableRes;
import androidx.annotation.LayoutRes;
import androidx.annotation.Nullable;
import androidx.annotation.VisibleForTesting;
import androidx.core.content.res.ResourcesCompat;
import androidx.core.graphics.drawable.RoundedBitmapDrawable;

import org.chromium.base.TraceEvent;
import org.chromium.base.metrics.RecordHistogram;
import org.chromium.base.task.PostTask;
import org.chromium.base.task.TaskTraits;
import org.chromium.base.Callback;
import org.chromium.base.Log;
import org.chromium.base.task.PostTask;
import org.chromium.base.task.TaskTraits;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.feature_engagement.TrackerFactory;
import org.chromium.chrome.browser.flags.ChromeFeatureList;
import org.chromium.chrome.browser.omnibox.suggestions.mostvisited.SuggestTileType;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.search_engines.TemplateUrlServiceFactory;
import org.chromium.chrome.browser.suggestions.SiteSuggestion;
import org.chromium.chrome.browser.suggestions.MisesSiteSuggestion;
import org.chromium.chrome.browser.suggestions.SuggestionsConfig.TileStyle;
import org.chromium.components.browser_ui.styles.ChromeColors;
import org.chromium.components.browser_ui.widget.RoundedIconGenerator;
import org.chromium.components.favicon.IconType;
import org.chromium.components.favicon.LargeIconBridge;
import org.chromium.components.feature_engagement.EventConstants;
import org.chromium.components.feature_engagement.Tracker;
import org.chromium.components.search_engines.TemplateUrlService;
import org.chromium.ui.base.ViewUtils;
import org.chromium.components.image_fetcher.ImageFetcher;
import org.chromium.components.image_fetcher.ImageFetcherConfig;
import org.chromium.components.image_fetcher.ImageFetcherFactory;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.components.browser_ui.util.GlobalDiscardableReferencePool;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MisesTileRenderer extends TileRenderer {
    private static final String TAG = "MisesTileRenderer";

    private ImageFetcher mImageFetcher;
    private final int mDesiredIconSize;

    public MisesTileRenderer(
            Context context, @TileStyle int style, int titleLines, org.chromium.chrome.browser.suggestions.ImageFetcher imageFetcher) {
        super(context, style, titleLines, imageFetcher);
        Profile profile = Profile.getLastUsedRegularProfile();
        mImageFetcher = ImageFetcherFactory.createImageFetcher(ImageFetcherConfig.IN_MEMORY_WITH_DISK_CACHE,
                        profile.getProfileKey(),
                        GlobalDiscardableReferencePool.getReferencePool());
        Resources res = context.getResources();
        mDesiredIconSize = res.getDimensionPixelSize(R.dimen.tile_view_icon_size);
    }

    protected @LayoutRes int getLayout() {
        return R.layout.mises_suggestions_tile_view;
    }
 

    private class UrlIconCallbackImpl implements Callback<Bitmap> {
        private final WeakReference<Tile> mTile;
        private final Runnable mLoadCompleteCallback;

        private UrlIconCallbackImpl(Tile tile, Runnable loadCompleteCallback) {
            mTile = new WeakReference<>(tile);
            mLoadCompleteCallback = loadCompleteCallback;
        }

        @Override
        public void onResult(@Nullable Bitmap icon) {
            Tile tile = mTile.get();
            if (tile != null) { // Do nothing if the tile was removed.
                if (icon != null) {
                    tile.setIconType(IconType.TOUCH_ICON);
                    setTileIconFromBitmap(tile, icon);
                }
                PostTask.postTask(TaskTraits.UI_DEFAULT, () -> {
                    if (mLoadCompleteCallback != null) mLoadCompleteCallback.run();
                });
               
            }

            mTile.clear();
        }
    }

    @Override
    public void updateIcon(final Tile tile, TileGroup.TileSetupDelegate setupDelegate) {
        if (tile.getData() != null && tile.getData() instanceof MisesSiteSuggestion) {
            final MisesSiteSuggestion suggestion = (MisesSiteSuggestion)tile.getData();
            mImageFetcher.fetchImage(
                    ImageFetcher.Params.create(suggestion.iconUrl.getSpec(),
                            ImageFetcher.QUERY_TILE_UMA_CLIENT_NAME, mDesiredIconSize, mDesiredIconSize),
                    new UrlIconCallbackImpl(tile, setupDelegate.createIconLoadCallback(tile)));
            return;
        }
        super.updateIcon(tile, setupDelegate);
    }
}