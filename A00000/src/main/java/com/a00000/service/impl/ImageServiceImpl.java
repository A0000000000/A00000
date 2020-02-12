package com.a00000.service.impl;

import com.a00000.bean.Image;
import com.a00000.mapper.ImageMapper;
import com.a00000.service.ImageService;
import com.a00000.utils.LogUtils;
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
        LogUtils.LogInfo("ImageServiceImpl.saveImages", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
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
                    LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
                }
            }
        }
        return count;
    }

    @Override
    @Transactional
    public List<Image> getAllImages() {
        LogUtils.LogInfo("ImageServiceImpl.getAllImages", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        List<Image> list = null;
        ValueOperations vps = null;
        Map<String, Image> cache = null;
        try {
            vps = redisTemplate.opsForValue();
            cache = (Map<String, Image>) vps.get(Image.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
        } catch (Exception e) {
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        try {
            list = imageMapper.selectAllImages();
            if (list != null) {
                try {
                    for (Image image : list) {
                        if (image != null) {
                            cache.put(image.getId(), image);
                        }
                    }
                    vps.set(Image.class.getName(), cache);
                } catch (Exception e) {
                    LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
                }
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return list;
    }

    @Override
    @Transactional
    public Image getImageById(String id) {
        LogUtils.LogInfo("ImageServiceImpl.getImageById", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        Image image = null;
        ValueOperations vps = null;
        Map<String, Image> cache = null;
        try {
            vps = redisTemplate.opsForValue();
            cache = (Map<String, Image>) vps.get(Image.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
            image = cache.get(id);
        } catch (Exception e) {
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        try {
            if (image == null) {
                image = imageMapper.selectImageById(id);
                try {
                    if (image != null) {
                        cache.put(image.getId(), image);
                        vps.set(Image.class.getName(), cache);
                    }
                } catch (Exception e) {
                    LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
                }
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return image;
    }

    @Override
    @Transactional
    public boolean deleteImageById(String id) {
        LogUtils.LogInfo("ImageServiceImpl.deleteImageById", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        try {
            ValueOperations vps = redisTemplate.opsForValue();
            Map<String, Image> cache = (Map<String, Image>) vps.get(Image.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
            cache.remove(id);
            vps.set(Image.class.getName(), cache);
        } catch (Exception e) {
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        try {
            int count = imageMapper.deleteImageById(id);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return false;
    }
}
