package com.a00000.service.impl;

import com.a00000.bean.Image;
import com.a00000.mapper.ImageMapper;
import com.a00000.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageMapper imageMapper;

    @Autowired
    private RedisTemplate redisTemplate;

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
        ValueOperations vps = redisTemplate.opsForValue();
        Map<String, Image> cache = (Map<String, Image>) vps.get(Image.class.getName());
        if (cache == null) {
            cache = new HashMap<>();
        }
        try {
            list = imageMapper.selectAllImages();
            for (Image image : list) {
                cache.put(image.getId(), image);
            }
            vps.set(Image.class.getName(), cache);
        } catch (Exception e) {
        }
        return list;
    }

    @Override
    @Transactional
    public Image getImageById(String id) {
        Image image = null;
        ValueOperations vps = redisTemplate.opsForValue();
        Map<String, Image> cache = (Map<String, Image>) vps.get(Image.class.getName());
        if (cache == null) {
            cache = new HashMap<>();
        }
        try {
            image = cache.get(id);
            if (image == null) {
                image = imageMapper.selectImageById(id);
            }
            vps.set(Image.class.getName(), cache);
        } catch (Exception e) {
        }
        return image;
    }

    @Override
    @Transactional
    public boolean deleteImageById(String id) {
        ValueOperations vps = redisTemplate.opsForValue();
        Map<String, Image> cache = (Map<String, Image>) vps.get(Image.class.getName());
        if (cache == null) {
            cache = new HashMap<>();
        }
        try {
            cache.remove(id);
            int count = imageMapper.deleteImageById(id);
            vps.set(Image.class.getName(), cache);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }
}
