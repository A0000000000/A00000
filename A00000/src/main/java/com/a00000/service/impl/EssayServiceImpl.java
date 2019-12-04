package com.a00000.service.impl;

import com.a00000.bean.Essay;
import com.a00000.mapper.EssayMapper;
import com.a00000.service.EssayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class EssayServiceImpl implements EssayService {

    @Autowired
    private EssayMapper essayMapper;


    @Override
    @Transactional
    public List<Essay> queryAllEssay() {
        List<Essay> res = null;
        try {
            res = essayMapper.selectAllEssay();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    @Override
    @Transactional
    public Essay queryEssayById(String id) {
        Essay essay = null;
        try {
            essay = essayMapper.selectEssayById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return essay;
    }

    @Override
    @Transactional
    public boolean deleteEssayById(String id) {
        try {
            essayMapper.deleteEssayById(id);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    @Transactional
    public boolean addEssay(Essay essay) {
        essay.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        essay.setCreateTime(new Date());
        try {
            essayMapper.insertEssay(essay);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    @Transactional
    public boolean editEssay(Essay essay) {
        try {
            Essay target = essayMapper.selectEssayById(essay.getId());
            target.setTitle(essay.getTitle());
            target.setContent(essay.getContent());
            target.setCreator(essay.getCreator());
            target.setPassword(essay.getPassword());
            essayMapper.updateEssay(target);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
