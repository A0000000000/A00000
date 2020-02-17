package com.a00000.mapper;

import com.a00000.bean.Essay;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface EssayMapper {

    @Select("select id, title, content, createTime, updateTime, password, creator, typeid from t_essay limit #{begin}, #{count}")
    List<Essay> selectEssay(@Param("begin") Integer begin, @Param("count") Integer count) throws Exception;

    @Select("select id, title, content, createTime, updateTime, password, creator, typeid from t_essay where id = #{id}")
    Essay selectEssayById(@Param("id") String id) throws Exception;

    @Delete("delete from t_essay where id = #{id}")
    int deleteEssayById(@Param("id") String id) throws Exception;

    @Insert("insert into t_essay(id, title, content, createTime, updateTime, password, creator, typeid) values(#{id}, #{title}, #{content}, #{createTime}, #{updateTime}, #{password}, #{creator}, #{typeid})")
    int insertEssay(Essay essay) throws Exception;

    @Update("update t_essay set title = #{title}, content = #{content}, createTime = #{createTime}, updateTime = #{updateTime}, password = #{password}, creator = #{creator}, typeid = #{typeid} where id = #{id}")
    int updateEssay(Essay essay) throws Exception;

    @Update("update t_essay set typeid = #{target} where typeid = #{source}")
    int updateEssayByType(@Param("source") String source, @Param("target") String target) throws Exception;

    @Select("select count(id) from t_essay")
    Integer selectEssayCount() throws Exception;
}
