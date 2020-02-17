package com.a00000.handler;

import com.a00000.bean.Image;
import com.a00000.service.ImageService;
import com.a00000.utils.JSONUtils;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping("/")
public class ImageHandler {

    @Autowired
    private ImageService imageService;

    @RequestMapping("saveImages")
    public @ResponseBody Map<String, Object> saveImages(@RequestParam("images")  String images) throws Exception {
        LogUtils.LogInfo("ImageHandler.saveImages", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        List<Image> list = JSONUtils.parserJsonToImage(images);
        if (list != null) {
            int count = imageService.saveImages(list);
            if (count == list.size()) {
                map.put("status", "success");
                map.put("message", "上传成功!");
            } else if (count == 0){
                map.put("status", "failed");
                map.put("message", "上传失败, 请稍后再试!");
            } else {
                map.put("status", "middle");
                map.put("message", String.format("上传部分成功, 成功%d条, 失败%d条.", count, list.size() - count));
            }
        } else {
            map.put("status", "failed");
            map.put("message", "请求数据无效!");
        }
        return map;
    }

    @RequestMapping("getAllImagesMsg")
    public @ResponseBody List<Map<String, Object>> getAllImagesMsg() throws Exception {
        LogUtils.LogInfo("ImageHandler.getAllImagesMsg", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        List<Map<String, Object>> res = new ArrayList<>();
        List<Image> images = imageService.getAllImages();
        if (images != null) {
            images.stream().forEach(image -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", image.getId());
                map.put("filename", image.getOriginalname());
                map.put("password", StringUtils.isEmpty(image.getPassword()) ? "false" : "true");
                res.add(map);
            });
        }
        return res;
    }

    @RequestMapping("getImageById")
    public @ResponseBody Map<String, Object> getImageById(@RequestParam("id") String id, @RequestParam(value = "password", required = false) String password) throws Exception {
        LogUtils.LogInfo("ImageHandler.getImageById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        Image image = imageService.getImageById(id);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        if (image != null) {
            if (StringUtils.isEmpty(image.getPassword()) || image.getPassword().equals(password)) {
                map.put("status", "success");
                map.put("message", "ok");
                map.put("id", image.getId());
                map.put("path", image.getPath());
                map.put("uploadTime", format.format(image.getUploadTime().getTime()));
                map.put("filename", image.getOriginalname());
                map.put("password", StringUtils.isEmpty(image.getPassword()) ? "false" : "true");
            } else {
                map.put("status", "failed");
                map.put("message", "密码错误!");
            }
        } else {
            map.put("status", "failed");
            map.put("message", "图片不见了~~~");
        }
        return map;
    }

    @RequestMapping("deleteImageById")
    public @ResponseBody Map<String, Object> deleteImageById(@RequestParam("id") String id) throws Exception {
        LogUtils.LogInfo("ImageHandler.deleteImageById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        boolean res = imageService.deleteImageById(id);
        if (res) {
            map.put("status", "success");
            map.put("message", "删除成功!");
        } else {
            map.put("status", "failed");
            map.put("message", "服务器忙!");
        }
        return map;
    }
}
