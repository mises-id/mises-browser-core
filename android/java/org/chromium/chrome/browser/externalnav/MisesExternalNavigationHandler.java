/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.chromium.chrome.browser.externalnav;

import android.annotation.SuppressLint;

import org.chromium.components.external_intents.ExternalNavigationDelegate;
import org.chromium.components.external_intents.ExternalNavigationHandler;
import org.chromium.components.external_intents.ExternalNavigationHandler.OverrideUrlLoadingResult;
import org.chromium.components.external_intents.ExternalNavigationParams;
import org.chromium.url.GURL;

public class MisesExternalNavigationHandler extends ExternalNavigationHandler {

    public static final String IPFS_REDIRECT_URL = "ipfs://";
    public static final String IPNS_REDIRECT_URL = "ipns://";
    public MisesExternalNavigationHandler(ExternalNavigationDelegate delegate) {
        super(delegate);
    }

    @Override
    public OverrideUrlLoadingResult shouldOverrideUrlLoading(ExternalNavigationParams params) {
        if (isIPFSOverride(params)) {
            return OverrideUrlLoadingResult.forNoOverride();
        }
        return super.shouldOverrideUrlLoading(params);
    }

    private boolean isIPFSOverride(ExternalNavigationParams params) {
        if (params.getUrl().getSpec().startsWith(IPFS_REDIRECT_URL)) {
            return true;
        }

        if (params.getUrl().getSpec().startsWith(IPNS_REDIRECT_URL)) {
            return true;
        }
        return false;
    }


    @SuppressLint("VisibleForTests")
    public OverrideUrlLoadingResult clobberCurrentTabWithFallbackUrl(
            String browserFallbackUrl, ExternalNavigationParams params) {
        // Below is an actual code that was used prior to deletion of
        // clobberCurrentTabWithFallbackUrl introduced here
        // https://chromium.googlesource.com/chromium/src/+/37b5b744bc83f630d3121b46868818bb4e848c2a
        if (!params.isMainFrame()) {
            return OverrideUrlLoadingResult.forNoOverride();
        }

        if (params.getRedirectHandler() != null) {
            params.getRedirectHandler().setShouldNotOverrideUrlLoadingOnCurrentRedirectChain();
        }
        GURL browserFallbackGURL = new GURL(browserFallbackUrl);
        return clobberCurrentTab(browserFallbackGURL, params.getReferrerUrl(),
                params.getInitiatorOrigin(), params.isRendererInitiated());
    }
}
