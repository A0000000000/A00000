package com.a00000.service.impl;

import com.a00000.bean.Essay;
import com.a00000.bean.Type;
import com.a00000.mapper.EssayMapper;
import com.a00000.mapper.TypeMapper;
import com.a00000.service.TypeService;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class TypeServiceImpl implements TypeService {

    @Autowired
    private TypeMapper typeMapper;

    @Autowired
    private EssayMapper essayMapper;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    @Transactional
    public Type getTypeById(String id) {
        LogUtils.LogInfo("TypeService.getTypeById", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        Type type = null;
        ValueOperations vps = null;
        Map<String, Type> cache = null;
        try {
            LogUtils.LogInfo("TypeService.getTypeById.getTypeCache", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
            vps = redisTemplate.opsForValue();
            cache = (Map<String, Type>) vps.get(Type.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
            type = cache.get(id);
        } catch (Exception e) {
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        try {
            if (type == null) {
                type = typeMapper.selectTypeById(id);
                if (type != null) {
                    try {
                        cache.put(type.getId(), type);
                        vps.set(Type.class.getName(), cache);
                    } catch (Exception e) {
                        LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
                    }
                }
            } else {
                LogUtils.LogInfo("TypeService.getTypeById.getTypeCache From Redis Success", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return type;
    }

    @Override
    @Transactional
    public List<Type> getAllType() {
        LogUtils.LogInfo("TypeService.getAllType", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        List<Type> res = null;
        ValueOperations vps = null;
        Map<String, Type> cache = null;
        try {
            vps = redisTemplate.opsForValue();
            cache = (Map<String, Type>) vps.get(Type.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
        } catch (Exception e) {
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        try {
            res = typeMapper.selectAllType();
            if (res != null) {
                try {
                    for (Type type : res) {
                        cache.put(type.getId(), type);
                    }
                    vps.set(Type.class.getName(), cache);
                } catch (Exception e) {
                    LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
                }
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return res;
    }

    @Override
    @Transactional
    public boolean addNewType(Type type) {
        LogUtils.LogInfo("TypeService.addNewType", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        try {
            Type tmp = typeMapper.selectTypeByName(type.getName());
            if (tmp != null || !StringUtils.isEmpty(tmp.getId())) {
                return false;
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        type.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        try {
            int count = typeMapper.insertNewType(type);
            if (count > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteTypeById(String id) {
        LogUtils.LogInfo("TypeService.deleteTypeById", Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        try {
            ValueOperations vps = redisTemplate.opsForValue();
            Map<String, Essay> cacheEssay = (Map<String, Essay>) vps.get(Essay.class.getName());
            if (cacheEssay == null) {
                cacheEssay = new HashMap<>();
            }
            for (Map.Entry<String, Essay> item : cacheEssay.entrySet()) {
                if (id.equals(item.getValue().getTypeid())) {
                    cacheEssay.get(item.getKey()).setTypeid("0");
                }
            }
            vps.set(Essay.class.getName(), cacheEssay);
            Map<String, Type> cacheType = (Map<String, Type>) vps.get(Type.class.getName());
            if (cacheType == null) {
                cacheType = new HashMap<>();
            }
            cacheType.remove(id);
            vps.set(Type.class.getName(), cacheType);
        } catch (Exception e) {
            LogUtils.LogWarning(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        try {
            essayMapper.updateEssayByType(id, "0");
            int count = typeMapper.deleteTypeById(id);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
            LogUtils.LogError(e, Thread.currentThread().getStackTrace()[0].getFileName(), Thread.currentThread().getStackTrace()[0].getLineNumber(), new Date());
        }
        return false;
    }
}
