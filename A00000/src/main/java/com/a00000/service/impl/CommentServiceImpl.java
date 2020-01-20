package com.a00000.service.impl;

import com.a00000.bean.Comment;
import com.a00000.mapper.CommentMapper;
import com.a00000.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Override
    @Transactional
    public List<Comment> getCommentsByEssayId(String essayId) {
        List<Comment> list = null;
        try {
            list = commentMapper.selectCommentsByEssayId(essayId);
        } catch (Exception e) {
        }
        return list;
    }

    @Override
    @Transactional
    public boolean addNewComment(Comment comment) {
        comment.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        comment.setCreateTime(new Date());
        try {
            int count = commentMapper.insertNewComment(comment);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteCommentById(String id) {
        try {
            int count = commentMapper.deleteCommentById(id);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }
}
