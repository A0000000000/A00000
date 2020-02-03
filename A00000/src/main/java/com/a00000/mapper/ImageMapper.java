package com.a00000.mapper;

import com.a00000.bean.Image;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 处理与t_image表相关的增删改查的Mapper接口
 */
@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface ImageMapper {

    /**
     * 向t_image表增加一条数据
     * @param image Image对象
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Insert("insert into t_image(id, filename, originalname, path, uploadTime, password) values (#{id}, #{filename}, #{originalname}, #{path}, #{uploadTime}, #{password})")
    int insertNewImage(Image image) throws Exception;

    /**
     * 获得t_image中所有的数据
     * @return image集合
     * @throws Exception SQL异常
     */
    @Select("select id, filename, originalname, path, uploadTime, password from t_image")
    List<Image> selectAllImages() throws Exception;

    /**
     * 根据id查询一条t_image的一条数据
     * @param id image的id
     * @return Image对象
     * @throws Exception SQL异常
     */
    @Select("select id, filename, originalname, path, uploadTime, password from t_image where id = #{id}")
    Image selectImageById(@Param("id") String id) throws Exception;

    /**
     * 根据id删除t_image表的一条记录
     * @param id id值
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Delete("delete from t_image where id = #{id}")
    int deleteImageById(@Param("id") String id) throws Exception;
}
