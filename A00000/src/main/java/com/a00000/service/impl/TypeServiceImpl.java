package com.a00000.service.impl;

import com.a00000.bean.Essay;
import com.a00000.bean.Type;
import com.a00000.mapper.EssayMapper;
import com.a00000.mapper.TypeMapper;
import com.a00000.service.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
        ValueOperations vps = redisTemplate.opsForValue();
        Map<String, Type> cache = (Map<String, Type>) vps.get(Type.class.getName());
        if (cache == null) {
            cache = new HashMap<>();
        }
        Type type = cache.get(id);
        try {
            if (type == null) {
                type = typeMapper.selectTypeById(id);
                if (type != null) {
                    cache.put(type.getId(), type);
                }
            }
            vps.set(Type.class.getName(), cache);
        } catch (Exception e) {
        }
        return type;
    }

    @Override
    @Transactional
    public List<Type> getAllType() {
        List<Type> res = null;
        ValueOperations vps = redisTemplate.opsForValue();
        Map<String, Type> cache = (Map<String, Type>) vps.get(Type.class.getName());
        if (cache == null) {
            cache = new HashMap<>();
        }
        try {
            res = typeMapper.selectAllType();
            if (res != null) {
                for (Type type : res) {
                    cache.put(type.getId(), type);
                }
            }
            vps.set(Type.class.getName(), cache);
        } catch (Exception e) {
        }
        return res;
    }

    @Override
    @Transactional
    public boolean addNewType(Type type) {
        try {
            Type tmp = typeMapper.selectTypeByName(type.getName());
            if (tmp != null || !StringUtils.isEmpty(tmp.getId())) {
                return false;
            }
        } catch (Exception e) {
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
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteTypeById(String id) {
        ValueOperations vps = redisTemplate.opsForValue();
        try {
            essayMapper.updateEssayByType(id, "0");
            Map<String, Essay> cache = (Map<String, Essay>) vps.get(Essay.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
            for (Map.Entry<String, Essay> item : cache.entrySet()) {
                if (item.getValue().getTypeid().equals(id)) {
                    cache.remove(item.getKey());
                }
            }
            vps.set(Essay.class.getName(), cache);
        } catch (Exception e) {
        }
        try {
            Map<String, Type> cache = (Map<String, Type>) vps.get(Type.class.getName());
            if (cache == null) {
                cache = new HashMap<>();
            }
            cache.remove(id);
            vps.set(Type.class.getName(), cache);
            int count = typeMapper.deleteTypeById(id);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }
}
