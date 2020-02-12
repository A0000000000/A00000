package com.a00000.utils;

import java.util.Date;

public class LogUtils {
    public static void LogInfo(Exception e, String filename, int line, Date date) {
        System.out.println("===== Info =====");
        System.out.println("info e: " + e.getMessage());
        System.out.println("info filename: " + filename);
        System.out.println("info line: " + line);
        System.out.println("info date: " + date.toString());
        System.out.println("===== Info =====");
    }

    public static void LogInfo(String em, String filename, int line, Date date) {
        System.out.println("===== Info =====");
        System.out.println("info e: " + em);
        System.out.println("info filename: " + filename);
        System.out.println("info line: " + line);
        System.out.println("info date: " + date.toString());
        System.out.println("===== Info =====");
    }

    public static void LogWarning(Exception e, String filename, int line, Date date) {
        System.out.println("===== Warning =====");
        System.out.println("warning e: " + e.getMessage());
        System.out.println("warning filename: " + filename);
        System.out.println("warning line: " + line);
        System.out.println("warning date: " + date.toString());
        System.out.println("===== Warning =====");
    }

    public static void LogWarning(String em, String filename, int line, Date date) {
        System.out.println("===== Warning =====");
        System.out.println("warning e: " + em);
        System.out.println("warning filename: " + filename);
        System.out.println("warning line: " + line);
        System.out.println("warning date: " + date.toString());
        System.out.println("===== Warning =====");
    }

    public static void LogError(Exception e, String filename, int line, Date date) {
        System.out.println("===== Error =====");
        System.out.println("error e: " + e.getMessage());
        System.out.println("error filename: " + filename);
        System.out.println("error line: " + line);
        System.out.println("error date: " + date.toString());
        System.out.println("===== Error =====");
    }

    public static void LogError(String em, String filename, int line, Date date) {
        System.out.println("===== Error =====");
        System.out.println("error e: " + em);
        System.out.println("error filename: " + filename);
        System.out.println("error line: " + line);
        System.out.println("error date: " + date.toString());
        System.out.println("===== Error =====");
    }
}
