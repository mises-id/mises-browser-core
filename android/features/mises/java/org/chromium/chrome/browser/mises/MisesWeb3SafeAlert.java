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


public class MisesWeb3SafeAlert extends DialogFragment {

    private static final String TAG = "MisesWeb3SafeAlert";

    private static final String UrlNotifyType = "url";
    private static final String AddressNotifyType = "address";
    private static final int userActionNone = 1;
    private static final int userActionIgnore = 2;

    private Context mContext;

    private FrameLayout view;

    private Button btn_block;
    private Button btn_continue;
    private View view_bottom;
    private CheckBox checkbox_ignore;
    private TextView tv_title;
    private TextView tv_domain_title;
    private LinearLayout layout_blockem;
    private TextView tv_detail;
    private String callback_id;
    private String mType;
    private String mLevel;
    private String mTag;
    private String suggestedUrl;
    private String mAddress;
    private String mDomain;
    private LoadingView mLoadingView;
    private final TabCreatorManager mTabCreatorManager;


    public MisesWeb3SafeAlert(TabCreatorManager tabMgr) {
	    mTabCreatorManager = tabMgr;
    }

    public static MisesWeb3SafeAlert newInstance(TabCreatorManager tabMgr,  String json) {
        MisesWeb3SafeAlert f = new MisesWeb3SafeAlert(tabMgr);

        // Supply num input as an argument.
        Bundle args = new Bundle();
        String suggestedUrl = "";
        String notifyType = "address";
        String notifyLevel = "danger";
        String notifyTag = "potentially_behavior";
        String address = json;
        String domain = "";
        try{
          JSONObject jsonMessage = new JSONObject(json);
          if (jsonMessage.has("notify_type")) {
            notifyType = jsonMessage.getString("notify_type");
          }
          if (jsonMessage.has("notify_level")) {
            notifyLevel = jsonMessage.getString("notify_level");
          }
          if (jsonMessage.has("notify_tag")) {
            notifyTag = jsonMessage.getString("notify_tag");
          }
          if (jsonMessage.has("address")) {
            address = jsonMessage.getString("address");
          }
          if (jsonMessage.has("suggested_url")) {
            suggestedUrl = jsonMessage.getString("suggested_url");
          }
          if (jsonMessage.has("domain")) {
            domain = jsonMessage.getString("domain");
          }
        } catch (Exception e) {}
        args.putString("callback_id", json);
        args.putString("notify_type", notifyType);
        args.putString("notify_tag", notifyTag);
        args.putString("notify_level", notifyLevel);
        args.putString("domain", domain);
        args.putString("suggested_url", suggestedUrl);
        args.putString("address", address);
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
        this.view = (FrameLayout) inflater.inflate(R.layout.mises_web3_safe_alert, container, false);


        tv_title = view.findViewById(R.id.title);
        tv_domain_title = view.findViewById(R.id.domain_title);
        tv_detail = view.findViewById(R.id.detail);
        layout_blockem = view.findViewById(R.id.layout_blockem);
        view_bottom = view.findViewById(R.id.view_bottom);
        btn_block = (Button) view.findViewById(R.id.btn_block);
        btn_continue = (Button) view.findViewById(R.id.btn_continue);
        checkbox_ignore = (CheckBox) view.findViewById(R.id.checkbox_ignore);
        mContext = getContext();

        callback_id = getArguments().getString("callback_id");
        mAddress = getArguments().getString("address");
        mDomain = getArguments().getString("domain");
        mType = getArguments().getString("notify_type");
        mLevel = getArguments().getString("notify_level");
        mTag = getArguments().getString("notify_tag");
        suggestedUrl = getArguments().getString("suggested_url");
        //contract address
        String tagInfo = "you're interacting with might be a Phishing/Scam address.";
        String typeInfo = "The contract address: ";
        String txtValue = mAddress;
        String notice = "\nPlease notice the risk of losing you assets when you continue!";
        String eventType = "contract_alert";//event log type
        //notify url
        if (mType.equals(UrlNotifyType)){
          //edit tv_title
          tv_title.setVisibility(View.GONE);
          tv_domain_title.setVisibility(View.VISIBLE);
          //url notify value
          txtValue = mDomain;
          typeInfo = "The site: ";
          //notify tag
          tagInfo = "is currently on the Mises domain warning list. May trick you into doing something dangerous.";
          //have suggested url
          if(suggestedUrl != null && suggestedUrl.length() > 0){
            btn_block.setText("Go to " + suggestedUrl);
            //checkbox_ignore.setVisibility(View.GONE);
            btn_continue.setVisibility(View.VISIBLE);
            view_bottom.setVisibility(View.GONE);
            //fuzzy tag
            if(mTag != null && mTag.equals("fuzzy")){
              tagInfo = "you just visit looks fake. Attackers sometimes mimic sites by making small, hard-to-see changes to the URL." ;
            };
          };
          layout_blockem.setVisibility(View.GONE);//hidden blockem
          eventType = "domain_alert";//event log type
        }
        //event logging
        if(mDomain != null && mDomain.length() > 0){
          Bundle eventParams = new Bundle();
          eventParams.putString("domain", mDomain);
          FirebaseAnalytics.getInstance(getContext()).logEvent(eventType, eventParams);
        }
        if(txtValue == null || txtValue.length() <= 0){
          txtValue = "example.site";
        };
        Log.i(TAG,"txtValue: " + txtValue);
        final boolean isSuggestedURL = mType.equals(UrlNotifyType) && suggestedUrl != null && suggestedUrl.length() > 0;
        final String txtBegin = typeInfo;
        final String txtEnd = "\n"+tagInfo+ " "+ System.lineSeparator();
        final String txtNotice = notice;
        SpannableString spannable = new SpannableString(txtBegin + txtValue + txtEnd + txtNotice);
        spannable.setSpan(new ForegroundColorSpan(0xff666666), 0,
            txtBegin.length() + txtValue.length() + txtEnd.length() + txtNotice.length(), 0);
        spannable.setSpan(new ForegroundColorSpan(Color.RED), txtBegin.length(), txtBegin.length()+txtValue.length(), 0);
        spannable.setSpan(new ForegroundColorSpan(Color.BLACK), txtBegin.length()+txtValue.length()+txtEnd.length(), txtBegin.length()+txtValue.length()+txtEnd.length() + txtNotice.length(), 0);
        spannable.setSpan(new StyleSpan(Typeface.BOLD), txtBegin.length()+txtValue.length()+txtEnd.length(), txtBegin.length()+txtValue.length()+txtEnd.length() + txtNotice.length(), 0);

        tv_detail.setText( spannable );
        btn_continue.setOnClickListener(new View.OnClickListener() {
          @Override
          public void onClick(View v) {
              boolean ignore = checkbox_ignore.isChecked();
              int userAction = userActionNone;
              if (ignore) {
                userAction = userActionIgnore;
              }
              MisesController.getInstance().callbackNotifyDialog(callback_id, userAction);
              dismiss();
              Bundle params = new Bundle();
              if (ignore) {
                params.putString("step", "ignore url");
            } else {
                params.putString("step", "block url");
            }
              FirebaseAnalytics.getInstance(getContext()).logEvent("mises_web3_safe_alert", params);
          }
      });
        btn_block.setEnabled(true);
        btn_block.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
              boolean ignore = checkbox_ignore.isChecked();
                int userAction = userActionNone;
                if (ignore) {
                  userAction = userActionIgnore;
                }
                MisesController.getInstance().callbackNotifyDialog(callback_id, userAction);
                dismiss();
                //suggested url
                if (isSuggestedURL){
                  TabCreator tabCreator = mTabCreatorManager.getTabCreator(false);
                  if (tabCreator != null) {
                      tabCreator.openSinglePage(suggestedUrl);
                  }
                  Bundle params = new Bundle();
                  params.putString("step", "go to suggested url");
                  FirebaseAnalytics.getInstance(getContext()).logEvent("mises_web3_safe_alert", params);
                  return;
                }else{
                  Bundle params = new Bundle();
                  if (ignore) {
                      params.putString("step", "ignore address");
                  } else {
                      params.putString("step", "block address");
                  }
                  FirebaseAnalytics.getInstance(getContext()).logEvent("mises_web3_safe_alert", params);
                }
            }
        });

        //blockem
        layout_blockem.setOnClickListener(new View.OnClickListener() {
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
	    FirebaseAnalytics.getInstance(getContext()).logEvent("mises_web3_safe_alert", bundleParams);
        super.onStart();
    }
}
