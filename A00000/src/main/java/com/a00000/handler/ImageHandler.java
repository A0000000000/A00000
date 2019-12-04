package com.a00000.handler;

import com.a00000.bean.Image;
import com.a00000.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/")
public class ImageHandler {

    @Autowired
    private ImageService imageService;

    @RequestMapping("imageUpload")
    public @ResponseBody Map<String, Object> imageUpload(HttpServletRequest request, @RequestParam(value = "password", required = false) String password, @RequestParam("images") MultipartFile[] images) {
        Map<String, Object> map = new HashMap<>();
        if (images == null || images.length <= 0) {
            map.put("status", "failed");
            map.put("message", "请至少选择一张图片!");
        } else {
            int count = imageService.saveImages(request, images, password);
            if (count == images.length) {
                map.put("status", "success");
                map.put("message", "上传成功!");
            } else {
                map.put("status", "middle");
                map.put("success", count);
                map.put("failed", images.length - count);
            }
        }
        return map;
    }

    @RequestMapping("getAllImage")
    public @ResponseBody List<Map<String, Object>> getAllImage() throws Exception {
        List<Map<String, Object>> list = new ArrayList<>();
        List<Image> images = imageService.getAllImageInfo();
        for (Image image : images) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", image.getId());
            map.put("filename", image.getFilename());
            map.put("password", StringUtils.isEmpty(image.getPassword()) ? "false" : "true");
            list.add(map);
        }
        return list;
    }

    @RequestMapping("getImageById")
    public @ResponseBody Map<String, Object> getImageById(@RequestParam("id") String id, @RequestParam("password") String password) throws Exception {
        Map<String, Object> map = new HashMap<>();
        Image image = imageService.getImageById(id);
        if (image == null) {
            map.put("status", "failed");
            map.put("message", "图片不见了~~~");
        } else {
            if (StringUtils.isEmpty(image.getPassword()) || image.getPassword().equals(password)) {
                map.put("status", "success");
                map.put("filename", image.getFilename());
                map.put("path", image.getPath());
                map.put("uploadTime", image.getUploadTime().toString());
            } else {
                map.put("status", "failed");
                map.put("message", "密码错误!");
            }
        }
        return map;
    }

}
