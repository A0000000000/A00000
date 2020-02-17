package com.a00000.mapper;

import com.a00000.bean.Type;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface TypeMapper {

    @Select("select id, name, message from t_type where id = #{id}")
    Type selectTypeById(@Param("id") String id) throws Exception;

    @Select("select id, name, message from t_type")
    List<Type> selectAllType() throws Exception;

    @Select("select id, name, message from t_type where name = #{name}")
    Type selectTypeByName(@Param("name") String name) throws Exception;

    @Insert("insert into t_type(id, name, message) values (#{id}, #{name}, #{message})")
    int insertNewType(Type type) throws Exception;

    @Delete("delete from t_type where id = #{id}")
    int deleteTypeById(@Param("id") String id) throws Exception;
}
