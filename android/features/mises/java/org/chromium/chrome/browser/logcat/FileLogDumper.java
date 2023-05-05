package org.chromium.chrome.browser.logcat;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FileLogDumper implements ILogDumper {

    public static class Config {
        private String logDir;
        private String logFileBaseName = "logcat";
        private int expiresToCleanInSeconds = 3600 * 24 * 2;
        private int checkCleanCreatedTimes = 10;
        private boolean isGzipEnabled = false;

        private int copyBufferSize = 8192;
        private String subDirDateFormat = "yyyyMMdd";
        private String subDirDateFormatSuffix = "_HH-mm-ss";
    }

    private static final String TAG = "FileLogDumper";

    private Config config;

    private String logDir;

    private volatile boolean isDirWritable = false;

    private Object cleanLock = new Object();

    private SimpleDateFormat simpleDateFormat;

    private String lastSubDirName = null;

    private int fileCount = 0;

    public FileLogDumper() {
        this(new Config());
    }

    public FileLogDumper(Config config) {
        this.config = config;
        simpleDateFormat = new SimpleDateFormat(config.subDirDateFormat
                + config.subDirDateFormatSuffix);
    }

    @Override
    public void onStart(Context applicationContext, LogcatDump.Config dumpConfig) {
        logDir = config.logDir;
        if (logDir == null) {
            logDir = Environment.getExternalStorageDirectory()
                    + "/" + applicationContext.getPackageName() + "/logcat-dumper";
        }
        try {
            Log.i(TAG, "onStart!");
            mkdir(logDir);
            clean();
        } catch (IOException e) {
            ILogDumper.super.onException(e);
        }

    }

    @Override
    public void onCrash(Thread t, Throwable e) {

    }

    @Override
    public boolean onInput(InputStream inputStream) {
        if (!checkIsDirWritable()) {
            return false;
        }

        try {
            String filePath = getValidLogFileName();
            Log.i(TAG, "begin to write logcat dump file : " + filePath);
            try (OutputStream os = new FileOutputStream(filePath)) {
                byte[] buffer = new byte[8192];
                int length = 0;
                do {
                    length = inputStream.read(buffer);
                    if (length > 0) {
                        os.write(buffer, 0, length);
                    }
                } while (length >= 0);
            }
            Log.i(TAG, "end to write logcat dump file : " + filePath);
            if (fileCount % config.checkCleanCreatedTimes == 0) {
                clean();
            }
        } catch (IOException e) {
            onException(e);
        }
        return true;
    }

    @Override
    public void onException(Exception e) {
        Log.e("ILogDumper", e.getClass().getCanonicalName() + " occurred " + e.getMessage(), e);
        e.printStackTrace();
        if (!checkIsDirWritable()) {
            return;
        }
    }

    private String getValidLogFileName() throws IOException {
        String dirName = simpleDateFormat.format(new Date());
        if (lastSubDirName == null || !dirName.startsWith(lastSubDirName.substring(0, 6))) {
            mkdir(logDir + "/" + dirName);
            lastSubDirName = dirName;
        }
        String extension = "log";
        String filePath = logDir + "/" + lastSubDirName
                + "/" + config.logFileBaseName + "." + fileCount + "." + extension;
        fileCount++;
        return filePath;
    }

    private boolean checkIsDirWritable() {
        if (!isDirWritable) {
            onError("FileLogDumper failed to start:" + logDir);
        }
        return isDirWritable;
    }

    private void mkdir(String path) throws IOException {
        isDirWritable = false;
        File dir = new File(path);
        if (dir.mkdirs()) {
            Log.i(TAG, "Dir create success " + path);
        }
        if (!dir.isDirectory()) {
            throw new IOException("path cannot be created:" + path);
        }
        isDirWritable = true;
    }

    public void clean() {
        if (!isDirWritable) {
            return;
        }
        synchronized (cleanLock) {
            long nowInSeconds = System.currentTimeMillis() / 1000;

            File file = new File(logDir);
            for (File dir : file.listFiles()) {
                if (dir.isDirectory() && nowInSeconds > dir.lastModified() / 1000 + config.expiresToCleanInSeconds) {
                    Log.i(TAG, "try to delete expired directory :" + dir.getAbsolutePath());
                    deleteRecursive(dir);
                }
            }
        }

    }

    private void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            for (File child : fileOrDirectory.listFiles()) {
                deleteRecursive(child);
            }
        }

        fileOrDirectory.delete();
    }

}
