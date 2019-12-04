package com.a00000.service.impl;

import com.a00000.bean.Image;
import com.a00000.mapper.ImageMapper;
import com.a00000.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.*;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageMapper imageMapper;

    @Override
    @Transactional
    public int saveImages(HttpServletRequest request, MultipartFile[] images, String password) {
        int count = 0;
        String dictionary = request.getServletContext().getRealPath("images");
        for (MultipartFile image : images) {
            try {
                Image img = new Image();
                img.setId(UUID.randomUUID().toString().replaceAll("-", ""));
                img.setUploadTime(new Date());
                String filename = img.getId() + "-" + image.getOriginalFilename();
                img.setFilename(filename);
                File file = new File(dictionary, filename);
                if (file.exists()) {
                    file.delete();
                }
                image.transferTo(file);
                img.setFullPath(file.getPath());
                img.setPath(request.getContextPath() + "/images/" + img.getFilename());
                img.setPassword(password);
                imageMapper.insertNewImage(img);
                count++;
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return count;
    }

    @Override
    @Transactional
    public List<Image> getAllImageInfo() {
        List<Image> list = null;
        try {
            list = imageMapper.selectAllImage();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    @Transactional
    public Image getImageById(String id) {
        Image image = null;
        try {
            image = imageMapper.selectImageById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return image;
    }


}
