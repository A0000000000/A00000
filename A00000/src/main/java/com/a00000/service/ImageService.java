package com.a00000.service;

import com.a00000.bean.Image;

import java.util.List;

/**
 * 处理与Image相关的Service方法
 */
public interface ImageService {

    /**
     * 向数据库增加记录
     * @param images 数据
     * @return 成功条数
     */
    int saveImages(List<Image> images);

    /**
     * 获得所有的图片信息
     * @return 图片对象的集合
     */
    List<Image> getAllImages();

    /**
     * 通过id 查询一张图片的信息
     * @param id 图片id
     * @return 图片信息的对象
     */
    Image getImageById(String id);

    /**
     * 根据id删除一条图片信息记录
     * @param id 图片id
     * @return 是否删除成功
     */
    boolean deleteImageById(String id);

}
