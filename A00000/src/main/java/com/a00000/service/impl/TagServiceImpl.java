package com.a00000.service.impl;

import com.a00000.bean.Tag;
import com.a00000.mapper.TagMapper;
import com.a00000.service.TagService;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private RedisTemplate redisTemplate;


    @Override
    @Transactional
    public int addOrGetTag(Tag tag) {
        if (tag == null || StringUtils.isEmpty(tag.getName())) {
            return 0;
        }
        int res = 0;
        ValueOperations vps = null;
        Map<String, Tag> cache = null;
        try {
            vps = redisTemplate.opsForValue();
            cache = (Map<String, Tag>) vps.get(Tag.class.getName());
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e,  Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        if (cache == null) {
            cache = new HashMap<>();
        }
        for (Map.Entry<String, Tag> item : cache.entrySet()) {
            if (tag.getName().equals(item.getValue().getName())) {
                tag.setId(item.getValue().getId());
                tag.setCreateTime(item.getValue().getCreateTime());
                if (!StringUtils.isEmpty(tag.getId())) {
                    res = 1;
                }
                break;
            }
        }
        if (res == 0) {
            try {
                Tag tmp = tagMapper.selectTagByName(tag.getName());
                if (tmp != null) {
                    tag.setId(tmp.getId());
                    tag.setCreateTime(tmp.getCreateTime());
                    if (!StringUtils.isEmpty(tag.getId())) {
                        res = 1;
                        if (cache != null) {
                            cache.put(tmp.getId(), tmp);
                        }
                    }
                }
            } catch (Exception e) {
                LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
        }
        if (res == 0) {
            tag.setId(UUID.randomUUID().toString().replaceAll("-", ""));
            tag.setCreateTime(new Date());
            try {
                res = tagMapper.insertNewTag(tag);
            } catch (Exception e) {
                LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
        }
        try {
            vps.set(Tag.class.getName(), cache);
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e,  Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return res;
    }

    @Override
    @Transactional
    public int deleteTag(String id) {
        int res = 0;
        if (!StringUtils.isEmpty(id)) {
            try {
                ValueOperations vps = redisTemplate.opsForValue();
                Map<String, Tag> cache = (Map<String, Tag>) vps.get(Tag.class.getName());
                if (cache == null) {
                    cache = new HashMap<>();
                }
                cache.remove(id);
                vps.set(Tag.class.getName(), cache);
            } catch (Exception e) {
                this.redisTemplate = null;
                LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
            try {
                res = tagMapper.deleteTagById(id);
            } catch (Exception e) {
                LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
        }
        return res;
    }

    @Override
    @Transactional
    public int updateTag(Tag tag) {
        int res = 0;
        if (!(StringUtils.isEmpty(tag.getId()) || StringUtils.isEmpty(tag.getName()))) {
            try {
                ValueOperations vps = redisTemplate.opsForValue();
                Map<String, Tag> cache = (Map<String, Tag>) vps.get(Tag.class.getName());
                if (cache == null) {
                    cache = new HashMap<>();
                }
                cache.remove(tag.getId());
                vps.set(Tag.class.getName(), cache);
            } catch (Exception e) {
                this.redisTemplate = null;
                LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
            try {
                Tag tmp = tagMapper.selectTagById(tag.getId());
                tmp.setName(tag.getName());
                res = tagMapper.updateTagById(tmp);
            } catch (Exception e) {
                LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
        }
        return res;
    }

    @Override
    @Transactional
    public List<Tag> getTagByIds(List<String> ids) {
        LogUtils.LogInfo("TagServiceImpl.getTagByIds", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        List<Tag> list = null;
        try {
            list = tagMapper.selectTagByIds(ids);
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return list;
    }

    @Override
    @Transactional
    public Tag getTagById(String id) {
        LogUtils.LogInfo("TagServiceImpl.getTagById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Tag tag = null;
        ValueOperations vps = null;
        Map<String, Tag> cache = null;
        try {
            vps = redisTemplate.opsForValue();
            cache = (Map<String, Tag>) vps.get(Tag.class.getName());
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        if (cache == null) {
            cache = new HashMap<>();
        }
        tag = cache.get(id);
        if (tag == null) {
            try {
                tag = tagMapper.selectTagById(id);
            } catch (Exception e) {
                LogUtils.LogError(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
            }
            if (tag != null) {
                cache.put(id, tag);
            }
        }
        try {
            vps.set(Tag.class.getName(), cache);
        } catch (Exception e) {
            this.redisTemplate = null;
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        }
        return tag;
    }

}
