package com.a00000.service.impl;

import com.a00000.bean.EssayTag;
import com.a00000.bean.Tag;
import com.a00000.service.EssayTagService;
import com.a00000.service.EssayTagServiceProxy;
import com.a00000.service.TagService;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EssayTagServiceProxyImpl implements EssayTagServiceProxy {

    @Autowired
    private TagService tagService;

    @Autowired
    private EssayTagService essayTagService;

    @Override
    public int addEssayTag(String essayId, String tagName) {
        LogUtils.LogInfo("EssayTagServiceProxyImpl.addEssayTag", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        int res = 0;
        Tag tag = new Tag();
        tag.setName(tagName);
        EssayTag et = new EssayTag();
        et.setEssayId(essayId);
        res = tagService.addOrGetTag(tag);
        if (res != 0) {
            et.setTagId(tag.getId());
            res = essayTagService.addTagOnEssay(et);
        }
        return res;
    }

    @Override
    public int deleteEssayTag(String id) {
        LogUtils.LogInfo("EssayTagServiceProxyImpl.deleteEssayTag", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        int res = 0;
        res = essayTagService.deleteTagEssay(id);
        return res;
    }

    @Override
    public Map<EssayTag, Tag> getTagByEssayId(String essayId) {
        LogUtils.LogInfo("EssayTagServiceProxyImpl.getTagByEssayId", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<EssayTag, Tag> res = new HashMap<>();
        List<EssayTag> ets = essayTagService.getEssayTagsByEssayId(essayId);
        if (ets != null) {
            for (EssayTag et : ets) {
                Tag tag = tagService.getTagById(et.getTagId());
                if (tag != null) {
                    res.put(et, tag);
                }
            }
        }
        return res;
    }

}
