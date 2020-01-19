package com.a00000.utils;

import org.springframework.util.StringUtils;

import java.util.MissingResourceException;
import java.util.ResourceBundle;

/**
 * 用于获取某个URL是否需要被拦截
 */
public class URLUtils {

    private static ResourceBundle bundle = null;
    static {
        bundle = ResourceBundle.getBundle("url");
    }

    /**
     * 判断指定URL是否需要被拦截
     * @param url 待判断的URL
     * @return 是否需要被拦截
     */
    public static boolean isInterceptor(String url) {
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
