package com.a00000.utils;

import com.a00000.bean.Image;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * 用于进行JSON数据相关的解析
 */
public class JSONUtils {
    /**
     * 将JSON格式的字符串解析为Image对象
     * @param jsonData JSON格式的数据
     * @return Image对象列表
     */
    public static List<Image> parserJsonToImage(String jsonData) {
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

    /**
     * 解析JSON数组
     * @param jsonData JSON数组的字符串
     * @return Image对象的列表
     */
    private static List<Image> parserArray(String jsonData) {
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

    /**
     * 解析JSON对象
     * @param jsonData JSON对象的字符串
     * @return Image的对象
     */
    private static Image parserObject(String jsonData) {
        Image image = new Image();
        JSONObject obj = JSONObject.fromObject(jsonData);
        setData(image, obj);
        return image;
    }

    /**
     * 从JSON对象中取值设置到Image对象中
     * @param image Image对象
     * @param obj JSONObject对象
     */
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
