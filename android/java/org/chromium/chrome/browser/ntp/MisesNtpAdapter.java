/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.ntp;

import static org.chromium.ui.base.ViewUtils.dpToPx;

import android.app.Activity;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.os.Build;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.util.Pair;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.widget.ImageViewCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.RequestManager;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.chromium.base.ContextUtils;
import org.chromium.base.Log;
import org.chromium.base.task.PostTask;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.night_mode.GlobalNightModeStateProviderHolder;
import org.chromium.chrome.browser.preferences.MisesPref;
import org.chromium.chrome.browser.preferences.SharedPreferencesManager;
import org.chromium.chrome.browser.profiles.Profile;
import org.chromium.components.user_prefs.UserPrefs;
import org.chromium.content_public.browser.UiThreadTaskTraits;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class MisesNtpAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private Activity mActivity;
    private RequestManager mGlide;
    private View mMvTilesContainerLayout;
    private View mMisesServiceTilesContainerLayout;
    private OnMisesNtpListener mOnMisesNtpListener;
    private boolean mIsTopSitesEnabled;
    private int mRecyclerViewHeight;
    private int mStatsHeight;
    private int mTopSitesHeight;
    private int mMisesServiceHeight;
    private int mNewContentHeight;
    private int mTopMarginImageCredit;
    private float mImageCreditAlpha = 1f;

    private static int TYPE_MISES_SERVICE = 1;
    private static int TYPE_TOP_SITES = 2;

    private static final int ONE_ITEM_SPACE = 1;
    private static final int TWO_ITEMS_SPACE = 2;
    private static final String TAG = "MisesNtpAdapter";

    public MisesNtpAdapter(Activity activity, OnMisesNtpListener onMisesNtpListener,
            RequestManager glide, 
            View mvTilesContainerLayout, View misesServiceTilesContainerLayout,
            int recyclerViewHeight, boolean isTopSitesEnabled) {
        mActivity = activity;
        mOnMisesNtpListener = onMisesNtpListener;
        mGlide = glide;
        mMvTilesContainerLayout = mvTilesContainerLayout;
        mMisesServiceTilesContainerLayout = misesServiceTilesContainerLayout;
        mRecyclerViewHeight = recyclerViewHeight;
        mIsTopSitesEnabled = isTopSitesEnabled;
    }

    public static int getViewHeight(View view) {
        view.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        return view.getMeasuredHeight();
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof TopSitesViewHolder) {
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            int margin = dpToPx(mActivity, 16);
            layoutParams.setMargins(margin, margin, margin, 0);

            mMvTilesContainerLayout.setLayoutParams(layoutParams);
            mMvTilesContainerLayout.setBackgroundResource(R.drawable.rounded_dark_bg_alpha);

            mTopSitesHeight = getViewHeight(holder.itemView) + margin;

        }
        if (holder instanceof MisesServiceViewHolder) {
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            int margin = dpToPx(mActivity, 16);
            layoutParams.setMargins(margin, margin, margin, 0);

            mMisesServiceTilesContainerLayout.setLayoutParams(layoutParams);
            mMisesServiceTilesContainerLayout.setBackgroundResource(R.drawable.rounded_dark_bg_alpha);


        }
    }

    @Override
    public int getItemCount() {
        return getTopSitesCount();
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view;
        if (viewType == TYPE_MISES_SERVICE) {
            return new MisesServiceViewHolder(mMisesServiceTilesContainerLayout);

        }
        return new TopSitesViewHolder(mMvTilesContainerLayout);
    }

    @Override
    public int getItemViewType(int position) {
        if (position == 0) {
            return TYPE_MISES_SERVICE;
        }

        return TYPE_TOP_SITES;
    }

    public int getTopSitesCount() {
        return mIsTopSitesEnabled ? 2 : 0;
    }

    public void setTopSitesEnabled(boolean isTopSitesEnabled) {
        if (mIsTopSitesEnabled != isTopSitesEnabled) {
            mIsTopSitesEnabled = isTopSitesEnabled;
            if (mIsTopSitesEnabled) {
                notifyItemInserted(0);
            } else {
                notifyItemRemoved(0);
            }
            notifyItemRangeChanged(0, getTopSitesCount());
        }
    }



    public void setRecyclerViewHeight(int recyclerViewHeight) {
        mRecyclerViewHeight = recyclerViewHeight;
        int count = getTopSitesCount();
        if (getItemCount() > count) {
            count += 1;
        }
        notifyItemRangeChanged(0, count);
    }


    public static class TopSitesViewHolder extends RecyclerView.ViewHolder {
        TopSitesViewHolder(View itemView) {
            super(itemView);
        }
    }

    public static class MisesServiceViewHolder extends RecyclerView.ViewHolder {
        MisesServiceViewHolder(View itemView) {
            super(itemView);
        }
    }

}
