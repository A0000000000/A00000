package com.a00000.service.impl;

import com.a00000.bean.Type;
import com.a00000.mapper.EssayMapper;
import com.a00000.mapper.TypeMapper;
import com.a00000.service.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
public class TypeServiceImpl implements TypeService {

    @Autowired
    private TypeMapper typeMapper;

    @Autowired
    private EssayMapper essayMapper;

    @Override
    @Transactional
    public Type getTypeById(String id) {
        Type type = null;
        try {
            type = typeMapper.selectTypeById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return type;
    }

    @Override
    @Transactional
    public List<Type> getAllType() {
        List<Type> res = null;
        try {
            res = typeMapper.selectAllType();
        } catch (Exception e) {
            e.printStackTrace();
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
            e.printStackTrace();
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
            e.printStackTrace();
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteTypeById(String id) {
        try {
            essayMapper.updateEssayByType(id, "0");
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            int count = typeMapper.deleteTypeById(id);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
