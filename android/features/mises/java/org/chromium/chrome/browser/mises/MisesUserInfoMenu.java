package org.chromium.chrome.browser.mises;

import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.text.method.LinkMovementMethod;
import android.text.Spannable;
import android.text.style.URLSpan;
import android.text.Layout;
import android.text.Html;
import android.text.Spanned;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.bumptech.glide.request.RequestOptions;


import org.chromium.base.Log;
import org.chromium.chrome.mises.R;
import org.chromium.base.MisesController;

public class MisesUserInfoMenu extends PopupWindow implements  MisesController.MisesControllerObserver  {

    private Context mContext;

    private View view;
    private View view_user_info;
    private View view_login;
    private TextView tvUsername;
    private TextView tvId;
    private TextView tvRewardPts;
    private TextView tvRewardActions;
    private ImageView ivAvatar;

    public abstract class TextViewLinkHandler extends LinkMovementMethod {

        @Override
        public boolean onTouchEvent(TextView widget, Spannable buffer, MotionEvent event) {
            if (event.getAction() != MotionEvent.ACTION_UP)
                return super.onTouchEvent(widget, buffer, event);

            int x = (int) event.getX();
            int y = (int) event.getY();

            x -= widget.getTotalPaddingLeft();
            y -= widget.getTotalPaddingTop();

            x += widget.getScrollX();
            y += widget.getScrollY();

            Layout layout = widget.getLayout();
            int line = layout.getLineForVertical(y);
            int off = layout.getOffsetForHorizontal(line, x);

            URLSpan[] link = buffer.getSpans(off, off, URLSpan.class);
            if (link.length != 0) {
                onLinkClick(link[0].getURL());
            }
            return true;
        }

        abstract public void onLinkClick(String url);
    }

    public MisesUserInfoMenu(Context context, String id, String name, String avatar) {

        mContext = context;
        this.view = LayoutInflater.from(mContext).inflate(R.layout.mises_user_info_menu, null);
        view_user_info = view.findViewById(R.id.view_user_info);
        view_login = view.findViewById(R.id.view_login);
        tvUsername = (TextView) view.findViewById(R.id.tv_username);
        tvId = (TextView) view.findViewById(R.id.tv_id);
        ivAvatar = (ImageView) view.findViewById(R.id.iv_avatar);
        tvRewardPts = (TextView) view.findViewById(R.id.tv_my_rewards);
        tvRewardActions = (TextView) view.findViewById(R.id.tv_my_rewards_actions);
        
        final String text = "<a href='mine_more'>Mine more</a> | <a href='redeem_for_mb'>Redeem for MB</a>";        
        Spanned result;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
            result = Html.fromHtml(text, Html.FROM_HTML_MODE_LEGACY);
        } else {
            result = Html.fromHtml(text);
        }
        tvRewardActions.setText(result);

        tvRewardActions.setMovementMethod(new TextViewLinkHandler() {
            @Override
            public void onLinkClick(String url) {
                Log.v("MisesUserInfoMenu", "onLinkClick" + url);
                if (url.equals("mine_more")) {
                    view.findViewById(R.id.tv_my_rewards_action_mine).performClick();
                } else {
                    view.findViewById(R.id.tv_my_rewards_action_redeem).performClick();
                }
            }
        });
        
        boolean isLogin = MisesController.getInstance().isLogin();
        if (isLogin) {
            view_user_info.setVisibility(View.VISIBLE);
            view_login.setVisibility(View.GONE);
            tvUsername.setText(name.isEmpty() ? id.substring(0,Math.min(id.length(), 8)) : name);
            tvId.setText(id);
            Glide.with(mContext).load(avatar).apply(RequestOptions.bitmapTransform(new CircleCrop()))
                        .fallback(R.mipmap.head).error(R.mipmap.head).placeholder(R.mipmap.head).into(ivAvatar);
        } else {
            view_user_info.setVisibility(View.GONE);
            view_login.setVisibility(View.VISIBLE);
        }
        view.findViewById(R.id.tv_nft).setVisibility(View.GONE);

        // 设置外部可点击
        this.setOutsideTouchable(true);

        view.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                View view = view_login;
                if (view.getVisibility() == View.GONE) {
                    view = view_user_info;
                }
                int width = view.getRight();
                int w = (int) event.getX();
                if (event.getAction() == MotionEvent.ACTION_UP) {
                    if ( w > width) {
                        dismiss();
                    }
                }
                return true;
            }
        });

        /* 设置弹出窗口特征 */
        // 设置视图
        this.setContentView(this.view);
        // 设置弹出窗体的宽和高
        this.setHeight(RelativeLayout.LayoutParams.MATCH_PARENT);
        this.setWidth(RelativeLayout.LayoutParams.MATCH_PARENT);

        // 设置弹出窗体可点击
        this.setFocusable(true);

        this.setAnimationStyle(R.style.LeftMenuStyle);

        updateRewards();
        MisesController.getInstance().updateUserBonusFromServer(false);
        MisesController.getInstance().AddObserver(this);
        this.setOnDismissListener(new PopupWindow.OnDismissListener() {

            @Override
            public void onDismiss() {
                // TODO Auto-generated method stub
                MisesController.getInstance().RemoveObserver(MisesUserInfoMenu.this);

            }
        });
    }

    private void updateRewards() {
        final String points = MisesController.getInstance().getMisesBonusString();
        final String text = String.format(mContext.getResources().getString(R.string.lbl_my_rewards_format), points);
        tvRewardPts.setText(text);
    }
    @Override
    public void OnMisesUserInfoChanged() {
        updateRewards();
    }
    @Override
    public void OnExtensionDNRActionCountChanged(final String base64Image) {

    }
    @Override    
    public void OnWeb3SafePhishingDetected(final String address) {

    }
    public void setOnClickListener(View.OnClickListener itemsOnClick) {
        view.findViewById(R.id.tv_my_data).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_my_rewards).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_mises_discover).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_wallet).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_swap).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_login).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_create_mises).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_website).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_website1).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_twitter).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_twitter1).setOnClickListener(itemsOnClick);
	    view.findViewById(R.id.tv_nft).setOnClickListener(itemsOnClick);
	    view.findViewById(R.id.tv_portal).setOnClickListener(itemsOnClick);
	    view.findViewById(R.id.tv_invite).setOnClickListener(itemsOnClick);
	    view.findViewById(R.id.tv_id).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_my_rewards_action_mine).setOnClickListener(itemsOnClick);
        view.findViewById(R.id.tv_my_rewards_action_redeem).setOnClickListener(itemsOnClick);

        
    }
} 
