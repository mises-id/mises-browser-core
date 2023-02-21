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
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

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


public class MisesWeb3SafeAlert extends DialogFragment {

    private static final String TAG = "MisesWeb3SafeAlert";

    private Context mContext;

    private FrameLayout view;

    private Button btn_block;
    private Button btn_ignor;
    private TextView tv_title;
    private ImageView iv_blockem;
    private TextView tv_detail;
    private String mAddress;
    private String mUrl;
    private LoadingView mLoadingView;
    private final TabCreatorManager mTabCreatorManager;


    public MisesWeb3SafeAlert(TabCreatorManager tabMgr) {
	    mTabCreatorManager = tabMgr;
    }

    public static MisesWeb3SafeAlert newInstance(TabCreatorManager tabMgr, String phishingUrl,  String phishingAddress) {
        MisesWeb3SafeAlert f = new MisesWeb3SafeAlert(tabMgr);

        // Supply num input as an argument.
        Bundle args = new Bundle();
        args.putString("phishing_url", phishingUrl);
        args.putString("phishing_address", phishingAddress);
        f.setArguments(args);

        return f;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        this.view = (FrameLayout) inflater.inflate(R.layout.mises_web3_safe_alert, container, false);
        tv_title = view.findViewById(R.id.title);
        tv_detail = view.findViewById(R.id.detail);
        iv_blockem = view.findViewById(R.id.iv_blockem);
        btn_block = (Button) view.findViewById(R.id.btn_block);
        btn_ignor = (Button) view.findViewById(R.id.btn_ignor);
        mContext = getContext();

        mAddress = getArguments().getString("phishing_address");
        mUrl = getArguments().getString("phishing_url");


        final String txtBegin = "The contract address: ";
        final String txtEnd = "\nyou're interacting with is identified as a Phishing Address. " + System.lineSeparator();
        final String txtNotice = "Please notice the high risk of losing you assets when you continue!";
        SpannableString spannable = new SpannableString(txtBegin + mAddress + txtEnd + txtNotice);
        spannable.setSpan(new ForegroundColorSpan(Color.RED), txtBegin.length(), txtBegin.length()+mAddress.length(), 0);
        spannable.setSpan(new ForegroundColorSpan(Color.BLACK), txtBegin.length()+mAddress.length()+txtEnd.length(), txtBegin.length()+mAddress.length()+txtEnd.length() + txtNotice.length(), 0);
        spannable.setSpan(new StyleSpan(Typeface.BOLD), txtBegin.length()+mAddress.length()+txtEnd.length(), txtBegin.length()+mAddress.length()+txtEnd.length() + txtNotice.length(), 0);

        tv_detail.setText( spannable );

        btn_ignor.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 销毁弹出框
                MisesController.getInstance().callbackPhishingDetected(mAddress, 1);
                dismiss();
                Bundle params = new Bundle();
                params.putString("step", "ignor");
                FirebaseAnalytics.getInstance(getContext()).logEvent("mises_web3_safe_alert", params);
            }
        });
        btn_block.setEnabled(true);
        btn_block.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                MisesController.getInstance().callbackPhishingDetected(mAddress, 0);
                dismiss();
                Bundle params = new Bundle();
                params.putString("step", "block");
                FirebaseAnalytics.getInstance(getContext()).logEvent("mises_web3_safe_alert", params);
            }
        });

        //blockem
        iv_blockem.setOnClickListener(new View.OnClickListener() {
          @Override
          public void onClick(View v) {
              dismiss();
              TabCreator tabCreator = mTabCreatorManager.getTabCreator(false);
              if (tabCreator != null) {
                  tabCreator.openSinglePage("https://www.blockem.io/");
              }
              Bundle params = new Bundle();
              params.putString("step", "blockem");
              FirebaseAnalytics.getInstance(getContext()).logEvent("mises_web3_safe_alert", params);
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

    @Override
    public void onStart() {
        WindowManager.LayoutParams params = getDialog().getWindow().getAttributes();
        params.width = ViewGroup.LayoutParams.MATCH_PARENT;
        getDialog().getWindow().setAttributes((WindowManager.LayoutParams) params);

	    Bundle bundleParams = new Bundle();
	    bundleParams.putString("step", "begin");
	    FirebaseAnalytics.getInstance(getContext()).logEvent("mises_web3_safe_alert", bundleParams);
        super.onStart();
    }
}
