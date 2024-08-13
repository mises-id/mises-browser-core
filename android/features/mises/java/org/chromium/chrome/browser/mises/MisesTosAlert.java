package org.chromium.chrome.browser.mises;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.Canvas;
import android.net.TrafficStats;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import androidx.annotation.NonNull;
import androidx.fragment.app.DialogFragment;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.LinearLayout;
import android.app.Dialog;
import android.text.Html;

import org.chromium.chrome.mises.R;
import org.chromium.chrome.browser.tabmodel.TabCreatorManager;
import org.chromium.chrome.browser.tabmodel.TabModel;
import org.chromium.chrome.browser.tabmodel.TabCreator;
import org.chromium.ui.widget.LoadingView;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import com.kirich1409.svgimageloaderplugins.GlideApp;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.Target;

import java.io.ByteArrayOutputStream;

import org.chromium.net.ChromiumNetworkAdapter;
import org.chromium.net.NetworkTrafficAnnotationTag;
import androidx.annotation.Nullable;
import org.chromium.chrome.browser.tabmodel.TabCreatorManager;
import com.google.firebase.analytics.FirebaseAnalytics;
import org.chromium.base.task.AsyncTask;
import android.graphics.Color;
import android.graphics.Typeface;
import android.text.SpannableString;
import android.text.style.RelativeSizeSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;
import org.chromium.base.MisesController;


public class MisesTosAlert extends DialogFragment {

    private static final String TAG = "MisesTosAlert";

    private Context mContext;

    private FrameLayout view;

    private Button btn_block;
    private Button btn_continue;
    private TextView tv_title;
    private TextView tv_detail;
    private LoadingView mLoadingView;
    private final TabCreatorManager mTabCreatorManager;
    private String content;


    public MisesTosAlert(TabCreatorManager tabMgr) {
	    mTabCreatorManager = tabMgr;
    }

    public static MisesTosAlert newInstance(TabCreatorManager tabMgr,  final String html) {
        MisesTosAlert f = new MisesTosAlert(tabMgr);

        // Supply num input as an argument.
        Bundle args = new Bundle();
        args.putString("content", html);
        f.setArguments(args);
        return f;
    }
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        Dialog dialog = super.onCreateDialog(savedInstanceState);
        dialog.setCanceledOnTouchOutside(false);
        return dialog;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        this.view = (FrameLayout) inflater.inflate(R.layout.mises_tos_dialog, container, false);


        tv_title = view.findViewById(R.id.title);
        tv_detail = view.findViewById(R.id.detail);
        btn_block = (Button) view.findViewById(R.id.btn_block);
        btn_continue = (Button) view.findViewById(R.id.btn_continue);
        mContext = getContext();

        content = getArguments().getString("content");

        if (content != null) {
          tv_detail.setText( Html.fromHtml(content));
        }
        tv_detail.setMovementMethod(new TextViewLinkHandler() {
            @Override
            public void onLinkClick(String url) {
                Log.v("MisesTosAlert", "onLinkClick" + url);
                TabCreator tabCreator = mTabCreatorManager.getTabCreator(false);
                if (tabCreator != null) {
                    tabCreator.openSinglePage(url);
                }
                
            }
        });
        btn_continue.setOnClickListener(new View.OnClickListener() {
          @Override
          public void onClick(View v) {
            Bundle bundleParams = new Bundle();
            bundleParams.putString("step", "accept");
            FirebaseAnalytics.getInstance(getContext()).logEvent("mises_temple_tos", bundleParams);
            MisesController.getInstance().callbackNotifyDialog(content, 0);
            dismiss();     
          }
        });
        btn_block.setEnabled(true);
        btn_block.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

              
              Bundle bundleParams = new Bundle();
              bundleParams.putString("step", "block");
              FirebaseAnalytics.getInstance(getContext()).logEvent("mises_temple_tos", bundleParams);
              MisesController.getInstance().callbackNotifyDialog(content, 1);
              dismiss();
            }
        });


        mLoadingView = new LoadingView(mContext);
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT);
        lp.gravity = Gravity.CENTER;
        mLoadingView.setLayoutParams(lp);
        mLoadingView.setVisibility(View.GONE);
        view.addView(mLoadingView);

        return view;
    }

    private float getDensity() {
      DisplayMetrics dm = new DisplayMetrics();
      getActivity().getWindowManager().getDefaultDisplay().getMetrics(dm);
      return dm.density;
  }

    @Override
    public void onStart() {
      WindowManager.LayoutParams params = getDialog().getWindow().getAttributes();
      params.width = ViewGroup.LayoutParams.MATCH_PARENT;
      getDialog().getWindow().setAttributes((WindowManager.LayoutParams) params);

	    Bundle bundleParams = new Bundle();
	    bundleParams.putString("step", "begin");
	    FirebaseAnalytics.getInstance(getContext()).logEvent("mises_temple_tos", bundleParams);
      super.onStart();
    }
}
