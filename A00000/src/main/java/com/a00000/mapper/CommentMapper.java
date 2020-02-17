package com.a00000.mapper;

import com.a00000.bean.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface CommentMapper {

    @Select("select id, username, content, createTime, essayId from t_comment where essayId = #{essayId}")
    List<Comment> selectCommentsByEssayId(@Param("essayId") String essayId) throws Exception;

    @Insert("insert into t_comment(id, username, content, createTime, essayId) values (#{id}, #{username}, #{content}, #{createTime}, #{essayId})")
    int insertNewComment(Comment comment) throws Exception;

    @Delete("delete from t_comment where id = #{id}")
    int deleteCommentById(@Param("id") String id) throws Exception;

    @Delete("delete from t_comment where essayId = #{essayId}")
    int deleteAssetEssay(@Param("essayId") String essayId) throws Exception;
}
