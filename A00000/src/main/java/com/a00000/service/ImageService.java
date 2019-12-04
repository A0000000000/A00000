package com.a00000.service;

import com.a00000.bean.Image;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface ImageService {

    int saveImages(HttpServletRequest request, MultipartFile[] images, String password);

    List<Image> getAllImageInfo();

    Image getImageById(String id);
}
