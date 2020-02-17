package com.a00000.service.impl;

import com.a00000.bean.Comment;
import com.a00000.bean.Essay;
import com.a00000.bean.EssayTag;
import com.a00000.mapper.CommentMapper;
import com.a00000.mapper.EssayMapper;
import com.a00000.service.EssayService;
import com.a00000.utils.LogUtils;
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
        LogUtils.LogInfo("EssayServiceImpl.getEssay", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
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
            this.redisTemplate = null;
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return essays;
    }

    @Override
    @Transactional
    public Essay getEssayById(String id) {
        LogUtils.LogInfo("EssayServiceImpl.getEssayById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Essay essay = null;
        try {
            ValueOperations vps = null;
            Map<String, Essay> cache = null;
            try {
                vps = redisTemplate.opsForValue();
                cache = (Map<String, Essay>) vps.get(Essay.class.getName());
                if (cache == null) {
                    cache = new HashMap<>();
                }
                essay = cache.get(id);
            } catch (Exception e) {
                this.redisTemplate = null;
                LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
            if (essay == null) {
                essay = essayMapper.selectEssayById(id);
                try {
                    if (essay != null) {
                        cache.put(essay.getId(), essay);
                        vps.set(Essay.class.getName(), cache);
                    }
                } catch (Exception e) {
                    this.redisTemplate = null;
                    LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
                }
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return essay;
    }

    @Override
    @Transactional
    public boolean deleteEssayById(String id) {
        LogUtils.LogInfo("EssayServiceImpl.deleteEssayById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        boolean res = false;
        try {
            ValueOperations vps = redisTemplate.opsForValue();
            Map<String, List<Comment>> cacheComment = (Map<String, List<Comment>>) vps.get(Comment.class.getName());
            if (cacheComment != null) {
                cacheComment.remove(id);
            } else {
                cacheComment = new HashMap<>();
            }
            vps.set(Comment.class.getName(), cacheComment);
            Map<String, Essay> cacheEssay = (Map<String, Essay>) vps.get(Essay.class.getName());
            if (cacheEssay != null) {
                cacheEssay.remove(id);
            } else {
                cacheEssay = new HashMap<>();
            }
            vps.set(Essay.class.getName(), cacheEssay);
            Map<String, EssayTag> cacheEssayTag = new HashMap<>();
            vps.set(EssayTag.class.getName(), cacheEssayTag);
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        try {
            commentMapper.deleteAssetEssay(id);
            int count = essayMapper.deleteEssayById(id);
            if (count > 0) {
                res = true;
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return res;
    }

    @Override
    @Transactional
    public boolean addNewEssay(Essay essay) {
        LogUtils.LogInfo("EssayServiceImpl.addNewEssay", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
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
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return res;
    }

    @Override
    @Transactional
    public boolean updateEssay(Essay essay) {
        LogUtils.LogInfo("EssayServiceImpl.updateEssay", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Essay target = null;
        try {
            target = essayMapper.selectEssayById(essay.getId());
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        if(target == null) {
            return false;
        }
        try {
            ValueOperations vps = redisTemplate.opsForValue();
            Map<String, Essay> cache = (Map<String, Essay>) vps.get(Essay.class.getName());
            if (cache != null) {
                cache.remove(target.getId());
            } else {
                cache = new HashMap<>();
            }
            vps.set(Essay.class.getName(), cache);
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
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
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return false;
    }

    @Override
    public Integer getEssayPages(Integer size) {
        LogUtils.LogInfo("EssayServiceImpl.getEssayPages", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Integer count = 0;
        try {
            count = essayMapper.selectEssayCount();
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        Integer ret = count / size;
        if (count % size > 0) {
            ret++;
        }
        return ret;
    }
}
