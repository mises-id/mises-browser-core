package org.chromium.chrome.browser.ntp;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.github.islamkhsh.CardSliderAdapter;
import com.openmediation.sdk.nativead.AdIconView;
import com.openmediation.sdk.nativead.AdInfo;
import com.openmediation.sdk.nativead.MediaView;
import com.openmediation.sdk.nativead.NativeAd;
import com.openmediation.sdk.nativead.NativeAdListener;
import com.openmediation.sdk.nativead.NativeAdView;
import com.openmediation.sdk.utils.error.Error;

import org.chromium.chrome.R;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class CarouselAdapter extends CardSliderAdapter<CarouselAdapter.NativeAdViewHolder> {

    private static final int ITEM_VIEW_TYPE_AD = 1;

    private List<CarouselAdInfo> mData;
    private Context mContext;

    public CarouselAdapter(Context context, List<CarouselAdInfo> data) {
        this.mContext = context;
        this.mData = data;
    }

    @NonNull
    @Override
    public CarouselAdapter.NativeAdViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new NativeAdViewHolder(LayoutInflater.from(mContext).inflate(R.layout.mises_native_ad_container, parent, false));
    }


    private int getColorRandom() {
        int a = Double.valueOf(Math.random() * 255).intValue();
        int r = Double.valueOf(Math.random() * 255).intValue();
        int g = Double.valueOf(Math.random() * 255).intValue();
        int b = Double.valueOf(Math.random() * 255).intValue();
        return Color.argb(a, r, g, b);
    }

    @Override
    public int getItemCount() {
        int count = mData == null ? 0 : mData.size();
        return count;
    }

    @Override
    public int getItemViewType(int position) {
        if (mData != null) {
            int count = mData.size();
            if (count > 0) {
                return ITEM_VIEW_TYPE_AD;
            }

        }
        return super.getItemViewType(position);
    }


    @Override
    public void bindVH(@NonNull NativeAdViewHolder holder, int position) {
        if (position < mData.size()) {
            CarouselAdInfo info = mData.get(position);
            holder.setData(info.mPlacementId, info.mAdInfo);
        }
        
    }

    public static class CarouselAdInfo {
        final public AdInfo mAdInfo;
        final public String mPlacementId;
        public CarouselAdInfo(String placementId, AdInfo adInfo) {
            mAdInfo = adInfo;
            mPlacementId = placementId;
        }
    }
    /**
     * NativeAdViewHolder
     */
    public static class NativeAdViewHolder extends RecyclerView.ViewHolder {
        private LinearLayout itemContainView;
        private Context mContext;

        public NativeAdViewHolder(View itemView) {
            super(itemView);
            mContext = itemView.getContext();
            itemContainView = itemView.findViewById(R.id.native_ad_container);
        }

        public void setData(String placementId, AdInfo info) {
            if (info == null) {
                return;
            }
            itemContainView.removeAllViews();
            if (info.isTemplateRender()) {
                RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
                        RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
                layoutParams.addRule(Gravity.CENTER);
                itemContainView.addView(info.getView(), layoutParams);
            } else {
                View adView = LayoutInflater.from(mContext).inflate(R.layout.native_ad_layout, null);
                TextView title = adView.findViewById(R.id.ad_title);
                title.setText(info.getTitle());
                TextView desc = adView.findViewById(R.id.ad_desc);
                desc.setText(info.getDesc());
                Button btn = adView.findViewById(R.id.ad_btn);
                btn.setText(info.getCallToActionText());
                MediaView mediaView = adView.findViewById(R.id.ad_media);
                NativeAdView nativeAdView = new NativeAdView(mContext);
                AdIconView adIconView = adView.findViewById(R.id.ad_icon_media);
                ImageView badgeView = adView.findViewById(R.id.ad_badge);

                badgeView.setVisibility(View.GONE);
                btn.setVisibility(View.GONE);
                if (info.getTitle() == null || info.getTitle().isEmpty()) {
                    title.setVisibility(View.INVISIBLE);
                }

                nativeAdView.addView(adView);
                nativeAdView.setTitleView(title);
                nativeAdView.setDescView(desc);
                nativeAdView.setAdIconView(adIconView);
                nativeAdView.setCallToActionView(btn);
                nativeAdView.setMediaView(mediaView);


                NativeAd.registerNativeAdView(placementId, nativeAdView, info);

                RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
                        RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                itemContainView.addView(nativeAdView, layoutParams);
            }
        }
    }

}