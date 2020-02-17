package com.a00000.service;

import com.a00000.bean.Comment;

import java.util.List;

public interface CommentService {

    List<Comment> getCommentsByEssayId(String essayId);

    boolean addNewComment(Comment comment);

    boolean deleteCommentById(String id);
}
