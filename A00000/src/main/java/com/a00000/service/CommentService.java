package com.a00000.service;

import com.a00000.bean.Comment;

import java.util.List;

/**
 * 处理与评论相关的Service接口
 */
public interface CommentService {

    /**
     * 根据随笔id查询该随笔对应的评论
     * @param essayId 随笔id
     * @return 评论列表
     */
    List<Comment> getCommentsByEssayId(String essayId);

    /**
     * 向数据库增加一条新评论
     * @param comment 评论对象
     * @return 是否增加成功
     */
    boolean addNewComment(Comment comment);

    /**
     * 根据id删除一条评论
     * @param id 评论id
     * @return 是否删除成功
     */
    boolean deleteCommentById(String id);
}
