// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.chromium.chrome.browser.init;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Process;
import android.os.StrictMode;
import android.content.Intent;
import android.content.BroadcastReceiver;
import android.content.SharedPreferences;

import org.chromium.base.ActivityState;
import org.chromium.base.ApplicationStatus;
import org.chromium.base.ApplicationStatus.ActivityStateListener;
import org.chromium.base.CommandLine;
import org.chromium.base.ContentUriUtils;
import org.chromium.base.ContextUtils;
import org.chromium.base.Log;
import org.chromium.base.PathUtils;
//import org.chromium.base.ResourceExtractor;
import org.chromium.base.SysUtils;
import org.chromium.base.ThreadUtils;
import org.chromium.base.TraceEvent;
//import org.chromium.base.annotations.RemovableInRelease;
import org.chromium.base.library_loader.LibraryLoader;
import org.chromium.base.library_loader.LibraryProcessType;
import org.chromium.base.library_loader.ProcessInitException;
import org.chromium.base.memory.MemoryPressureUma;
import org.chromium.chrome.browser.AppHooks;
//import org.chromium.chrome.browser.ChromeApplication;
import org.chromium.chrome.browser.ChromeStrictMode;
//import org.chromium.chrome.browser.ChromeSwitches;
//import org.chromium.chrome.browser.ClassRegister;
import org.chromium.chrome.browser.FileProviderHelper;
import org.chromium.chrome.browser.crash.LogcatExtractionRunnable;
import org.chromium.chrome.browser.download.DownloadManagerService;
//import org.chromium.chrome.browser.services.GoogleServicesManager;
//import org.chromium.chrome.browser.tabmodel.document.DocumentTabModelImpl;
//import org.chromium.chrome.browser.webapps.ActivityAssigner;
import org.chromium.chrome.browser.webapps.ChromeWebApkHost;
//import org.chromium.components.crash.browser.CrashDumpManager;
//import org.chromium.content.browser.BrowserStartupController;
import org.chromium.content_public.browser.DeviceUtils;
import org.chromium.content_public.browser.SpeechRecognition;
import org.chromium.net.NetworkChangeNotifier;
//import org.chromium.policy.CombinedPolicyProvider;

import java.net.URL;
import java.net.URLEncoder;
import java.net.HttpURLConnection;
import java.io.File;
import java.util.Locale;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.io.UnsupportedEncodingException;

import android.os.RemoteException;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerClient.InstallReferrerResponse;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import org.chromium.net.ChromiumNetworkAdapter;
import org.chromium.net.NetworkTrafficAnnotationTag;
import org.chromium.base.Callback;
import org.chromium.chrome.browser.mises.HttpUtil;

/**
 * Application level delegate that handles start up tasks.
 * {@link AsyncInitializationActivity} classes should override the {@link BrowserParts}
 * interface for any additional initialization tasks for the initialization to work as intended.
 */
public class ChromeBrowserReferrer extends BroadcastReceiver {
  private static final String TAG = "ChromeBrowserReferrer";
  private String readStream(InputStream is) {
      try {
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        int i = is.read();
        while (i != -1) {
          bo.write(i);
          i = is.read();
        }
        is.close();
        return bo.toString();
      } catch (IOException e) {
        return "";
      }
    }

    @Override
    public void onReceive(final Context context, Intent intent) {
      String referrer = intent.getStringExtra("referrer");

      if (referrer == null || referrer.length() == 0 || referrer.equals("")) {
        return;
      }

      Log.i(TAG, "Received: [" + referrer + "]");

      SharedPreferences.Editor sharedPreferencesEditor = ContextUtils.getAppSharedPreferences().edit();
      sharedPreferencesEditor.putString("install_referrer", (String)referrer);
      sharedPreferencesEditor.apply();
      
      try {
        HttpUtil.JsonGetAsync("https://update.browser.mises.site/a/install.php?ping=" + URLEncoder.encode(referrer, "UTF-8"), "", "", new Callback<HttpUtil.HttpResp>() {
            @Override
            public final void onResult(HttpUtil.HttpResp result) {
                
            }
        });
      } catch (UnsupportedEncodingException e) {
        Log.e(TAG, "Received  with unsupported encoding");
      }
  }
  public static void handleInstallReferrer(final Context context){
    try {
        final InstallReferrerClient referrerClient = InstallReferrerClient.newBuilder(context).build();
        referrerClient.startConnection(new InstallReferrerStateListener() {
          @Override
          public void onInstallReferrerSetupFinished(int responseCode) {
            switch (responseCode) {
              case InstallReferrerResponse.OK:
                // Connection established.
                try {
                  ReferrerDetails response = referrerClient.getInstallReferrer();
                  String referrer = response.getInstallReferrer();
                  if (referrer == null || referrer.length() == 0 || referrer.equals("")) {
                    Log.i(TAG, "Received : []");
                  } else {
                    Log.i(TAG, "Received : [" + referrer + "]");

                    SharedPreferences.Editor sharedPreferencesEditor = ContextUtils.getAppSharedPreferences().edit();
                    sharedPreferencesEditor.putString("install_referrer", (String)referrer);
                    sharedPreferencesEditor.apply();
                  }
                } catch (RemoteException e) {
                  Log.e(TAG, "Could not getInstallReferrer: " + e.getMessage());
                } catch (Exception e) {
                  Log.e(TAG, e.toString());
                }
                referrerClient.endConnection();
                break;
              case InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                // API not available on the current Play Store app.
                Log.e(TAG, "Could not get: FEATURE_NOT_SUPPORTED" );
                break;
              case InstallReferrerResponse.SERVICE_UNAVAILABLE:
                // Connection couldn't be established.
                Log.e(TAG, "Could not get: SERVICE_UNAVAILABLE" );
                break;
            }
          }

          @Override
          public void onInstallReferrerServiceDisconnected() {
              // Try to restart the connection on the next request to
              // Google Play by calling the startConnection() method.
          }
        });
    } catch (Exception e) {
      Log.e(TAG, e.toString());
    }
   
  }
}
