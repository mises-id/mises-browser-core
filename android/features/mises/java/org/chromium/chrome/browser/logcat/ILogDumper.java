package org.chromium.chrome.browser.logcat;

import android.content.Context;
import android.util.Log;

import java.io.InputStream;

public interface ILogDumper {

    /**
     * when LogcatDumper start
     * @param applicationContext avoid saving context
     */
    default void onStart(Context applicationContext, LogcatDump.Config config){

    }

    boolean onInput(InputStream stream);

    void onCrash(Thread t, Throwable e);

    default void onException(Exception e){
        Log.e("ILogDumper", e.getClass().getCanonicalName() + " occurred " + e.getMessage(), e);
        e.printStackTrace();
    }

    default void onError(String errorMessage){
        Log.e("ILogDumper", errorMessage);
    }
}
