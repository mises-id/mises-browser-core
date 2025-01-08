/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser;

import android.app.SearchManager;
import android.content.Intent;
import android.text.TextUtils;

import org.chromium.base.IntentUtils;
import org.chromium.base.Log;
import org.chromium.base.ThreadUtils;
import org.chromium.chrome.browser.profiles.ProfileManager;
import org.chromium.chrome.browser.search_engines.TemplateUrlServiceFactory;
import org.chromium.content_public.browser.BrowserStartupController;

import java.util.concurrent.Callable;

public class MisesIntentHandler {
    private static final String TAG = "MisesIntentHandler";

    private static final String EXTRA_MISES_OPEN_URL = "mises.open_url";
    /**
     * Helper method to extract the raw URL from the intent, without further processing.
     * The URL may be in multiple locations.
     * @param intent Intent to examine.
     * @return Raw URL from the intent, or null if raw URL could't be found.
     */
    protected static String extractUrlFromIntent(Intent intent) {
        if (intent == null) return null;
        String url = IntentHandler.getUrlFromVoiceSearchResult(intent);
        if (url == null) url = getUrlForCustomTab(intent);
        if (url == null) url = getUrlForWebapp(intent);
        if (url == null) url = IntentHandler.getUrlFromShareIntent(intent);
        if (url == null) url = intent.getDataString();
        if (url == null) url = getUrlFromText(intent);
        if (url == null) url = getWebSearchUrl(intent);
        if (url == null) url = getUrlFromNotification(intent);
        if (url == null) return null;
        url = url.trim();
        return TextUtils.isEmpty(url) ? null : url;
    }


    protected static String getUrlFromNotification(Intent intent) {
        if (intent == null) return null;
        String text = IntentUtils.safeGetStringExtra(intent, EXTRA_MISES_OPEN_URL);
        return (text == null || isJavascriptSchemeOrInvalidUrl(text)) ? null : text;
    }


    protected static String getUrlFromText(Intent intent) {
        if (intent == null) return null;
        String text = IntentUtils.safeGetStringExtra(intent, Intent.EXTRA_TEXT);
        return (text == null || isJavascriptSchemeOrInvalidUrl(text)) ? null : text;
    }

    protected static String getWebSearchUrl(Intent intent) {
        final String action = intent.getAction();
        if (!Intent.ACTION_WEB_SEARCH.equals(action)) {
            return null;
        }

        String query = IntentUtils.safeGetStringExtra(intent, SearchManager.QUERY);
        if (TextUtils.isEmpty(query)
                || !BrowserStartupController.getInstance().isFullBrowserStarted()) {
            return null;
        }

        try {
            return ThreadUtils.runOnUiThreadBlocking(
                    new Callable<String>() {
                        @Override
                        public String call() {
                            return TemplateUrlServiceFactory.getForProfile(
                                            ProfileManager.getLastUsedRegularProfile())
                                    .getUrlForSearchQuery(query);
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Could not retrieve search query: " + e);
        }
        return null;
    }


    private static String getUrlForCustomTab(Intent intent) {
        assert (false);
        return null;
    }

    private static String getUrlForWebapp(Intent intent) {
        assert (false);
        return null;
    }

    private static boolean isJavascriptSchemeOrInvalidUrl(String url) {
        assert (false);
        return false;
    }

}
