package com.a00000.service.impl;

import com.a00000.bean.Comment;
import com.a00000.mapper.CommentMapper;
import com.a00000.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    @Transactional
    public List<Comment> getCommentsByEssayId(String essayId) {
        List<Comment> list = null;
        ValueOperations vps = redisTemplate.opsForValue();
        Map<String, List<Comment>> cache = (Map<String, List<Comment>>) vps.get(Comment.class.getName());
        if (cache == null) {
            cache = new HashMap<>();
        }
        try {
            list = cache.get(essayId);
            if (list == null) {
                list = commentMapper.selectCommentsByEssayId(essayId);
                cache.put(essayId, list);
            }
            vps.set(Comment.class.getName(), cache);
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
            Map<String, List<Comment>> cache = new HashMap<>();
            ValueOperations vps = redisTemplate.opsForValue();
            vps.set(Comment.class.getName(), cache);
            int count = commentMapper.deleteCommentById(id);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }
}
