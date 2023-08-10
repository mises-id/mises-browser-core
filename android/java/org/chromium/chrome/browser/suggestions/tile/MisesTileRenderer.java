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
import org.chromium.chrome.R;
import org.chromium.chrome.browser.feature_engagement.TrackerFactory;
import org.chromium.chrome.browser.flags.ChromeFeatureList;
import org.chromium.chrome.browser.omnibox.suggestions.mostvisited.SuggestTileType;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.chrome.browser.search_engines.TemplateUrlServiceFactory;
import org.chromium.chrome.browser.suggestions.ImageFetcher;
import org.chromium.chrome.browser.suggestions.SiteSuggestion;
import org.chromium.chrome.browser.suggestions.SuggestionsConfig.TileStyle;
import org.chromium.components.browser_ui.styles.ChromeColors;
import org.chromium.components.browser_ui.widget.RoundedIconGenerator;
import org.chromium.components.favicon.IconType;
import org.chromium.components.favicon.LargeIconBridge;
import org.chromium.components.feature_engagement.EventConstants;
import org.chromium.components.feature_engagement.Tracker;
import org.chromium.components.search_engines.TemplateUrlService;
import org.chromium.ui.base.ViewUtils;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MisesTileRenderer extends TileRenderer {
    private static final String TAG = "MisesTileRenderer";

    public MisesTileRenderer(
            Context context, @TileStyle int style, int titleLines, ImageFetcher imageFetcher) {
        super(context, style, titleLines, imageFetcher);
    }

    protected @LayoutRes int getLayout() {
        return R.layout.mises_suggestions_tile_view;
    }
 
}