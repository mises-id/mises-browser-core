

package org.chromium.chrome.browser.crypto_wallet;


import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.provider.Browser;

import androidx.browser.customtabs.CustomTabsIntent;
import androidx.browser.customtabs.CustomTabsSessionToken;
import androidx.browser.customtabs.TrustedWebUtils;
import androidx.core.os.BuildCompat;

import static androidx.browser.customtabs.CustomTabsIntent.COLOR_SCHEME_DARK;
import static androidx.browser.customtabs.CustomTabsIntent.COLOR_SCHEME_LIGHT;


import org.chromium.base.IntentUtils;
import org.chromium.chrome.browser.browserservices.intents.BrowserServicesIntentDataProvider;
import org.chromium.chrome.browser.browserservices.intents.BrowserServicesIntentDataProvider.CustomTabsUiType;
import org.chromium.chrome.browser.customtabs.content.CustomTabActivityTabProvider;

import org.chromium.chrome.browser.LaunchIntentDispatcher;
import org.chromium.ui.util.ColorUtils;
import org.chromium.chrome.browser.customtabs.CustomTabActivity;
import org.chromium.chrome.browser.customtabs.CustomTabIntentDataProvider;
import org.chromium.chrome.browser.customtabs.CustomTabActivity;
import org.chromium.base.MisesSysUtils;
import org.chromium.base.ApplicationStatus;
import org.chromium.chrome.browser.tab.Tab;

public class BraveWalletCustomTabActivity extends CustomTabActivity {

   @Override
    protected void onDestroyInternal() {
        super.onDestroyInternal();
        BraveWalletProviderDelegateImplHelper.OnWalletPanelClosed();
    }


    public static void showWalletPage(Context context, String url) {
        // TODO(xingliu): The title text will be the html document title, figure out if we want to
        // use Chrome strings here as EmbedContentViewActivity does.
        CustomTabsIntent customTabIntent =
                new CustomTabsIntent.Builder()
                        .setShowTitle(true)
                        .setColorScheme(ColorUtils.inNightMode(context) ? COLOR_SCHEME_DARK
                                                                        : COLOR_SCHEME_LIGHT)
                        .build();
        customTabIntent.intent.setData(Uri.parse(url));

        Intent intent = LaunchIntentDispatcher.createCustomTabActivityIntent(
                context, customTabIntent.intent);
        intent.setClassName(context, BraveWalletCustomTabActivity.class.getName());
        intent.setPackage(context.getPackageName());
        intent.putExtra(CustomTabIntentDataProvider.EXTRA_UI_TYPE, CustomTabsUiType.INFO_PAGE);
        intent.putExtra(Browser.EXTRA_APPLICATION_ID, context.getPackageName());
        if (!(context instanceof Activity)) intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        IntentUtils.addTrustedIntentExtras(intent);

        context.startActivity(intent);
    }
}