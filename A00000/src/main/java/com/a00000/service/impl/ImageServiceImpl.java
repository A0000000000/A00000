package com.a00000.service.impl;

import com.a00000.bean.Image;
import com.a00000.mapper.ImageMapper;
import com.a00000.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageMapper imageMapper;

    @Override
    @Transactional
    public int saveImages(List<Image> images) {
        int count = 0;
        for (Image image : images) {
            if (image != null) {
                image.setId(UUID.randomUUID().toString().replaceAll("-", ""));
                image.setUploadTime(new Date());
                if (StringUtils.isEmpty(image.getPassword())) {
                    image.setPassword(null);
                }
                try {
                    int res = imageMapper.insertNewImage(image);
                    if (res > 0) {
                        count++;
                    }
                } catch (Exception e) {
                }
            }
        }
        return count;
    }

    @Override
    @Transactional
    public List<Image> getAllImages() {
        List<Image> list = null;
        try {
            list = imageMapper.selectAllImages();
        } catch (Exception e) {
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
        }
        return image;
    }

    @Override
    @Transactional
    public boolean deleteImageById(String id) {
        try {
            int count = imageMapper.deleteImageById(id);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }
}
