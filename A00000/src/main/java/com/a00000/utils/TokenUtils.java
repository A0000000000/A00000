package com.a00000.utils;

import java.util.ResourceBundle;

public class TokenUtils {

    private static ResourceBundle bundle = null;

    static {
        bundle = ResourceBundle.getBundle("token");
    }

    public static String getKey() {
        return bundle.getString("key");
    }

    public static String getValue() {
        return bundle.getString("value");
    }

}
