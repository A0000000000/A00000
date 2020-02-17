package com.a00000.mapper;

import com.a00000.bean.Image;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface ImageMapper {

    @Insert("insert into t_image(id, filename, originalname, path, uploadTime, password) values (#{id}, #{filename}, #{originalname}, #{path}, #{uploadTime}, #{password})")
    int insertNewImage(Image image) throws Exception;

    @Select("select id, filename, originalname, path, uploadTime, password from t_image")
    List<Image> selectAllImages() throws Exception;

    @Select("select id, filename, originalname, path, uploadTime, password from t_image where id = #{id}")
    Image selectImageById(@Param("id") String id) throws Exception;

    @Delete("delete from t_image where id = #{id}")
    int deleteImageById(@Param("id") String id) throws Exception;
}
