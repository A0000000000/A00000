package com.a00000.service;

import com.a00000.bean.EssayTag;
import com.a00000.bean.Tag;

import java.util.Map;

public interface EssayTagServiceProxy {

    int addEssayTag(String essayId, String tagName);

    int deleteEssayTag(String id);

    Map<EssayTag, Tag> getTagByEssayId(String essayId);

}
