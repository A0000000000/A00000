package com.a00000.mapper;

import com.a00000.bean.Tag;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface TagMapper {

    @Insert("insert into t_tag(id, name, createTime) values (#{id}, #{name}, #{createTime})")
    int insertNewTag(Tag tag) throws Exception;

    @Select("select id, name, createTime from t_tag where name = #{name}")
    Tag selectTagByName(@Param("name") String name) throws Exception;

    @Delete("delete from t_tag where id = #{id}")
    int deleteTagById(@Param("id") String id) throws Exception;

    @Select("<script>select id, name, createTime from t_tag where id in <foreach item='item' index='index' collection='ids' open='(' separator=',' close=')'> #{item} </foreach></script>")
    List<Tag> selectTagByIds(@Param("ids") List<String> ids) throws Exception;

    @Update("update t_tag set name = #{name} where id = #{id}")
    int updateTagById(Tag tag) throws Exception;

    @Select("select id, name, createTime from t_tag where id = #{id}")
    Tag selectTagById(@Param("id") String id) throws Exception;

}
