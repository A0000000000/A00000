package com.a00000.utils;

import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

public class URLUtils {

    private static ResourceBundle bundle = null;
    static {
        bundle = ResourceBundle.getBundle("url");
    }

    public static boolean isInterceptor(String url) {
        LogUtils.LogInfo("URLUtils.isInterceptor", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        try {
            String str = bundle.getString(url).toLowerCase();
            if (StringUtils.isEmpty(str)){
                return false;
            }
            if ("false".equalsIgnoreCase(str)) {
                return false;
            }
            return true;
        } catch (MissingResourceException e){
            return false;
        }
    }

}
