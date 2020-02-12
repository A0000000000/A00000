package com.a00000.service.impl;

import com.a00000.bean.Comment;
import com.a00000.mapper.CommentMapper;
import com.a00000.service.CommentService;
import com.a00000.utils.LogUtils;
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
        LogUtils.LogInfo("CommentServiceImpl.getCommentsByEssayId", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        List<Comment> list = null;
        ValueOperations vps = null;
        Map<String, List<Comment>> cache = null;
        try {
            vps = redisTemplate.opsForValue();
            cache = (Map<String, List<Comment>>) vps.get(Comment.class.getName());
        } catch (Exception e) {
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        if (cache == null) {
            cache = new HashMap<>();
        }
        try {
            list = cache.get(essayId);
            if (list == null) {
                list = commentMapper.selectCommentsByEssayId(essayId);
                cache.put(essayId, list);
            }
            try {
                vps.set(Comment.class.getName(), cache);
            } catch (Exception e) {
                LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return list;
    }

    @Override
    @Transactional
    public boolean addNewComment(Comment comment) {
        LogUtils.LogInfo("CommentServiceImpl.addNewComment", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        comment.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        comment.setCreateTime(new Date());
        try {
            int count = commentMapper.insertNewComment(comment);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteCommentById(String id) {
        LogUtils.LogInfo("CommentServiceImpl.deleteCommentById", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        try {
            try {
                Map<String, List<Comment>> cache = new HashMap<>();
                ValueOperations vps = redisTemplate.opsForValue();
                vps.set(Comment.class.getName(), cache);
            } catch (Exception e) {
                LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
            }
            int count = commentMapper.deleteCommentById(id);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return false;
    }
}
