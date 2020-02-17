package com.a00000.utils;

import com.a00000.bean.Image;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class JSONUtils {

    public static List<Image> parserJsonToImage(String jsonData) {
        LogUtils.LogInfo("JSONUtils.parserJsonToImage", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        try {
            return parserArray(jsonData);
        } catch (Exception e) {
        }
        try {
            List<Image> images = new ArrayList<>();
            images.add(parserObject(jsonData));
            return images;
        } catch (Exception e) {
        }
        return null;
    }

    private static List<Image> parserArray(String jsonData) {
        LogUtils.LogInfo("JSONUtils.parserArray", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        List<Image> images = new ArrayList<>();
        JSONArray array = JSONArray.fromObject(jsonData);
        for (int i = 0; i < array.size(); i++) {
            Image image = new Image();
            JSONObject obj = (JSONObject) array.get(i);
            setData(image, obj);
            images.add(image);
        }
        return images;
    }

    private static Image parserObject(String jsonData) {
        LogUtils.LogInfo("JSONUtils.parserObject", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Image image = new Image();
        JSONObject obj = JSONObject.fromObject(jsonData);
        setData(image, obj);
        return image;
    }

    private static void setData(Image image, JSONObject obj) {
        if (obj.containsKey("filename")) {
            image.setFilename(obj.getString("filename"));
        }
        if (obj.containsKey("path")) {
            image.setPath(obj.getString("path"));
        }
        if (obj.containsKey("password")) {
            image.setPassword(obj.getString("password"));
        }
        if (obj.containsKey("originalname")) {
            image.setOriginalname(obj.getString("originalname"));
        }
    }

}
