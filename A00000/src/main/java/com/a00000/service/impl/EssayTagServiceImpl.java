package com.a00000.service.impl;

import com.a00000.bean.EssayTag;
import com.a00000.mapper.EssayTagMapper;
import com.a00000.service.EssayTagService;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class EssayTagServiceImpl implements EssayTagService {

    @Autowired
    private EssayTagMapper essayTagMapper;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    @Transactional
    public int addTagOnEssay(EssayTag et) {
        LogUtils.LogInfo("EssayTagServiceImpl.addTagOnEssay", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        int res = 0;
        et.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        et.setCreateTime(new Date());
        try {
            res = essayTagMapper.insertEssayTag(et);
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return res;
    }

    @Override
    @Transactional
    public int deleteTagEssay(String id) {
        LogUtils.LogInfo("EssayTagServiceImpl.deleteTagEssay", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        int res = 0;
        try {
            ValueOperations vps = redisTemplate.opsForValue();
            Map<String, EssayTag> cache = (Map<String, EssayTag>) vps.get(EssayTag.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
            cache.remove(id);
            vps.set(EssayTag.class.getName(), cache);
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        try {
            res = essayTagMapper.deleteEssayTabById(id);
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return res;
    }

    @Override
    @Transactional
    public List<EssayTag> getEssayTagsByEssayId(String id) {
        LogUtils.LogInfo("EssayTagServiceImpl.getEssayTagsByEssayId", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        List<EssayTag> list = null;
        try {
            list = essayTagMapper.selectEssayTagByEssayId(id);
            if (list != null) {
                ValueOperations vps = null;
                Map<String, EssayTag> cache = null;
                try {
                    vps = redisTemplate.opsForValue();
                    cache = (Map<String, EssayTag>) vps.get(EssayTag.class.getName());
                } catch (Exception e) {
                    this.redisTemplate = null;
                    LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
                }
                if (cache == null) {
                    cache = new HashMap<>();
                }
                for (EssayTag et : list) {
                    if (et != null) {
                        cache.put(et.getId(), et);
                    }
                }
                try {
                    vps.set(EssayTag.class.getName(), cache);
                } catch (Exception e) {
                    this.redisTemplate = null;
                    LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
                }
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return list;
    }

    @Override
    @Transactional
    public EssayTag getEssayTagById(String id) {
        LogUtils.LogInfo("EssayTagServiceImpl.getEssayTagById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        EssayTag et = null;
        ValueOperations vps = null;
        Map<String, EssayTag> cache = null;
        try {
            vps = redisTemplate.opsForValue();
            cache = (Map<String, EssayTag>) vps.get(EssayTag.class.getName());
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        if (cache == null) {
            cache = new HashMap<>();
        }
        et = cache.get(id);
        if (et == null) {
            try {
                et = essayTagMapper.getEssayTagById(id);
                if (et != null) {
                    cache.put(et.getId(), et);
                }
            } catch (Exception e) {
                LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
        }
        try {
            vps.set(EssayTag.class.getName(), cache);
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return et;
    }

}
