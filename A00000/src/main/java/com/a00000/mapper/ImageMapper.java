package com.a00000.mapper;

import com.a00000.bean.Image;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ImageMapper {

    @Insert("insert into t_image(id, filename, fullPath, path, uploadTime, password) values (#{id}, #{filename}, #{fullPath}, #{path}, #{uploadTime}, #{password})")
    void insertNewImage(Image image) throws Exception;

    @Select("select id, filename, password from t_image")
    List<Image> selectAllImage() throws Exception;

    @Select("select * from t_image where id = #{id}")
    Image selectImageById(@Param("id") String id) throws Exception;
}
