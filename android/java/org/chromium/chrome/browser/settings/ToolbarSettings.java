package org.chromium.chrome.browser.settings;
import androidx.preference.PreferenceFragmentCompat;
import android.os.Bundle;
import android.app.Activity;
import androidx.appcompat.app.AlertDialog;
import android.content.DialogInterface;
import org.chromium.chrome.R;
import org.chromium.chrome.browser.ApplicationLifetime;

public class ToolbarSettings extends PreferenceFragmentCompat {
    public ToolbarSettings() {
        setHasOptionsMenu(true);		  
    }
    public static void AskForRelaunch(Activity activity) {
         AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(activity);
         alertDialogBuilder
            .setMessage(R.string.preferences_restart_is_needed)
            .setCancelable(true)
            .setPositiveButton(R.string.preferences_restart_now, new DialogInterface.OnClickListener() {
              @Override
              public void onClick(DialogInterface dialog, int id) {
                  ApplicationLifetime.terminate(true);
                  dialog.cancel();
              }
            })
            .setNegativeButton(R.string.preferences_restart_later, new DialogInterface.OnClickListener() {
              @Override
              public void onClick(DialogInterface dialog,int id) {
                  dialog.cancel();
              }
            });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }
    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
    }
}
