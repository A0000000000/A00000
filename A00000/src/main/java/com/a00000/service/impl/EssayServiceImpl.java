package com.a00000.service.impl;

import com.a00000.bean.Essay;
import com.a00000.mapper.CommentMapper;
import com.a00000.mapper.EssayMapper;
import com.a00000.service.EssayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class EssayServiceImpl implements EssayService {

    @Autowired
    private EssayMapper essayMapper;

    @Autowired
    private CommentMapper commentMapper;

    @Override
    @Transactional
    public List<Essay> getEssay(Integer page) {
        int begin = (page - 1) * 10;
        List<Essay> essays = null;
        try {
            essays = essayMapper.selectEssay(begin, 10);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return essays;
    }

    @Override
    @Transactional
    public Essay getEssayById(String id) {
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
        boolean res = false;
        try {
            commentMapper.deleteAssetEssay(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            int count = essayMapper.deleteEssayById(id);
            if (count > 0) {
                res = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
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
            e.printStackTrace();
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
            e.printStackTrace();
        }
        if(target == null) {
            return false;
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
            e.printStackTrace();
        }
        return false;
    }
}
