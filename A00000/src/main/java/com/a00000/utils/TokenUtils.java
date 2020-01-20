package com.a00000.utils;

import java.util.ResourceBundle;

/**
 * 用于获取服务器key和value的值
 */
public class TokenUtils {

    private static ResourceBundle bundle = null;

    static {
        bundle = ResourceBundle.getBundle("token");
    }

    /**
     * 获取key
     * @return key的值
     */
    public static String getKey() {
        return bundle.getString("key");
    }

    /**
     * 获取value
     * @return value的值
     */
    public static String getValue() {
        return bundle.getString("value");
    }

    public static String getTOKEN() {
        return bundle.getString("TOKEN");
    }
}
