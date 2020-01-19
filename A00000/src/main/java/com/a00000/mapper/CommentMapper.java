package com.a00000.mapper;

import com.a00000.bean.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 处理与t_comment表相关的Mapper接口
 */
@Mapper
public interface CommentMapper {

    /**
     * 根据随笔id查询t_comment表对应的数据
     * @param essayId 随笔id
     * @return Comment对象列表
     * @throws Exception SQL异常
     */
    @Select("select id, username, content, createTime, essayId from t_comment where essayId = #{essayId}")
    List<Comment> selectCommentsByEssayId(@Param("essayId") String essayId) throws Exception;

    /**
     * 向t_comment插入一条新数据
     * @param comment Comment对象
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Insert("insert into t_comment(id, username, content, createTime, essayId) values (#{id}, #{username}, #{content}, #{createTime}, #{essayId})")
    int insertNewComment(Comment comment) throws Exception;

    /**
     * 根据id删除t_comment表的一条数据
     * @param id Comment的id
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Delete("delete from t_comment where id = #{id}")
    int deleteCommentById(@Param("id") String id) throws Exception;

    /**
     * 辅助t_essay表删除
     * @param essayId 删除的随笔id
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Delete("delete from t_comment where essayId = #{essayId}")
    int deleteAssetEssay(@Param("essayId") String essayId) throws Exception;
}
