package com.a00000.service.impl;

import com.a00000.bean.Comment;
import com.a00000.bean.Essay;
import com.a00000.mapper.CommentMapper;
import com.a00000.mapper.EssayMapper;
import com.a00000.service.EssayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class EssayServiceImpl implements EssayService {

    @Autowired
    private EssayMapper essayMapper;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    @Transactional
    public List<Essay> getEssay(Integer page, Integer size) {
        int begin = (page - 1) * size;
        List<Essay> essays = null;
        try {
            essays = essayMapper.selectEssay(begin,  size);
            if (essays != null) {
                ValueOperations vps = redisTemplate.opsForValue();
                Map<String, Essay> cache = (Map<String, Essay>) vps.get(Essay.class.getName());
                if (cache == null) {
                    cache = new HashMap<>();
                }
                for (Essay essay : essays) {
                    cache.put(essay.getId(), essay);
                }
                vps.set(Essay.class.getName(), cache);
            }
        } catch (Exception e) {
        }
        return essays;
    }

    @Override
    @Transactional
    public Essay getEssayById(String id) {
        Essay essay = null;
        try {
            ValueOperations vps = redisTemplate.opsForValue();
            Map<String, Essay> cache = (Map<String, Essay>) vps.get(Essay.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
            essay = cache.get(id);
            if (essay == null) {
                essay = essayMapper.selectEssayById(id);
                if (essay != null) {
                    cache.put(essay.getId(), essay);
                }
            } else {
            }
            vps.set(Essay.class.getName(), cache);
        } catch (Exception e) {
        }
        return essay;
    }

    @Override
    @Transactional
    public boolean deleteEssayById(String id) {
        boolean res = false;
        ValueOperations vps = redisTemplate.opsForValue();
        try {
            Map<String, List<Comment>> cache = (Map<String, List<Comment>>) vps.get(Comment.class.getName());
            if (cache != null) {
                cache.remove(id);
            } else {
                cache = new HashMap<>();
            }
            vps.set(Comment.class.getName(), cache);
            commentMapper.deleteAssetEssay(id);
        } catch (Exception e) {
        }
        try {
            Map<String, Essay> cache = (Map<String, Essay>) vps.get(Essay.class.getName());
            if (cache != null) {
                cache.remove(id);
            } else {
                cache = new HashMap<>();
            }
            vps.set(Essay.class.getName(), cache);
            int count = essayMapper.deleteEssayById(id);
            if (count > 0) {
                res = true;
            }
        } catch (Exception e) {
        }
        return res;
    }

    @Override
    @Transactional
    public boolean addNewEssay(Essay essay) {
        boolean res = false;
        essay.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        essay.setCreateTime(new Date());
        essay.setUpdateTime(new Date());
        if(StringUtils.isEmpty(essay.getPassword())) {
            essay.setPassword(null);
        }
        try {
            int count = essayMapper.insertEssay(essay);
            if (count > 0) {
                res = true;
            }
        } catch (Exception e) {
        }
        return res;
    }

    @Override
    @Transactional
    public boolean updateEssay(Essay essay) {
        Essay target = null;
        try {
            target = essayMapper.selectEssayById(essay.getId());
        } catch (Exception e) {
        }
        if(target == null) {
            return false;
        }
        ValueOperations vps = redisTemplate.opsForValue();
        Map<String, Essay> cache = (Map<String, Essay>) vps.get(Essay.class.getName());
        if (cache != null) {
            cache.remove(target.getId());
        } else {
            cache = new HashMap<>();
        }
        vps.set(Essay.class.getName(), cache);
        target.setUpdateTime(new Date());
        target.setTitle(essay.getTitle());
        target.setCreator(essay.getCreator());
        if (StringUtils.isEmpty(essay.getPassword())) {
            target.setPassword(null);
        } else {
            target.setPassword(essay.getPassword());
        }
        target.setTypeid(essay.getTypeid());
        target.setContent(essay.getContent());
        try {
            int count = essayMapper.updateEssay(target);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }

    @Override
    public Integer getEssayPages(Integer size) {
        Integer count = 0;
        try {
            count = essayMapper.selectEssayCount();
        } catch (Exception e) {
            e.printStackTrace();
        }
        Integer ret = count / size;
        if (count % size > 0) {
            ret++;
        }
        return ret;
    }
}
