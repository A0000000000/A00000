package com.a00000.utils;

import java.util.Date;
import java.util.ResourceBundle;

public class TokenUtils {

    private static ResourceBundle bundle = null;

    static {
        bundle = ResourceBundle.getBundle("token");
    }

    public static String getKey() {
        LogUtils.LogInfo("TokenUtils.getKey", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        return bundle.getString("key");
    }

    public static String getValue() {
        LogUtils.LogInfo("TokenUtils.getValue", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        return bundle.getString("value");
    }

    public static String getTOKEN() {
        LogUtils.LogInfo("TokenUtils.getTOKEN", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        return bundle.getString("TOKEN");
    }
}
