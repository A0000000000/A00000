package com.a00000.service;

import com.a00000.bean.Image;

import java.util.List;

public interface ImageService {

    int saveImages(List<Image> images);

    List<Image> getAllImages();

    Image getImageById(String id);

    boolean deleteImageById(String id);

}
