package com.a00000.mapper;

import com.a00000.bean.EssayTag;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface EssayTagMapper {

    @Insert("insert into t_essay_tag(id, essayId, tagId, createTime) values (#{id}, #{essayId}, #{tagId}, #{createTime})")
    int insertEssayTag(EssayTag essayTag) throws Exception;

    @Select("select id, essayId, tagId, createTime from t_essay_tag where essayId = #{essayId}")
    List<EssayTag> selectEssayTagByEssayId(@Param("essayId") String essayId) throws Exception;

    @Delete("delete from t_essay_tag where id = #{id}")
    int deleteEssayTabById(@Param("id") String id) throws Exception;

    @Select("select id, essayId, tagId, createTime from t_essay_tag where id = #{id}")
    EssayTag getEssayTagById(@Param("id") String id) throws Exception;

}
