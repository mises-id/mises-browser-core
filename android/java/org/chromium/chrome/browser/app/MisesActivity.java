package org.chromium.chrome.browser.app;

import org.jni_zero.JNINamespace;
import org.jni_zero.NativeMethods;

import org.chromium.base.ApplicationStatus;

import org.chromium.chrome.browser.ChromeTabbedActivity;


/** Brave's extension for ChromeActivity */
@JNINamespace("chrome::android")
public abstract class MisesActivity extends ChromeActivity {

  public MisesActivity() {}

  public static ChromeTabbedActivity getChromeTabbedActivity() {
      return (ChromeTabbedActivity) getActivityOfType(ChromeTabbedActivity.class);
  }

  private static Activity getActivityOfType(Class<?> classOfActivity) {
      for (Activity ref : ApplicationStatus.getRunningActivities()) {
          if (!classOfActivity.isInstance(ref)) continue;

          return ref;
      }

      return null;
  }

}