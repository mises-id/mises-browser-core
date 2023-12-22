package org.chromium.chrome.browser.ntp_background_images;

import androidx.annotation.Nullable;

import org.chromium.base.ObserverList;
import org.chromium.base.ThreadUtils;
import org.jni_zero.CalledByNative;
import org.jni_zero.NativeMethods;
import java.util.ArrayList;
import java.util.List;
import org.chromium.chrome.browser.profiles.Profile;

public class NTPBackgroundImagesBridge {


    @NativeMethods
    interface Natives {
        NTPBackgroundImagesBridge getInstance(Profile profile);
        // NTPImage getCurrentWallpaper(
        //         long nativeNTPBackgroundImagesBridge, NTPBackgroundImagesBridge caller);
        void registerPageView(long nativeNTPBackgroundImagesBridge,
                              NTPBackgroundImagesBridge caller);
        void wallpaperLogoClicked(long nativeNTPBackgroundImagesBridge,
                                  NTPBackgroundImagesBridge caller,
                                  String creativeInstanceId,
                                  String destinationUrl, String wallpaperId);
        void getTopSites(long nativeNTPBackgroundImagesBridge,
                              NTPBackgroundImagesBridge caller);
        boolean isSuperReferral(long nativeNTPBackgroundImagesBridge,
                              NTPBackgroundImagesBridge caller);
        String getSuperReferralThemeName(long nativeNTPBackgroundImagesBridge,
                              NTPBackgroundImagesBridge caller);
        String getSuperReferralCode(long nativeNTPBackgroundImagesBridge,
                              NTPBackgroundImagesBridge caller);
        String getReferralApiKey(long nativeNTPBackgroundImagesBridge,
                              NTPBackgroundImagesBridge caller);
    }

}
