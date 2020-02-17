package com.a00000.service;

import com.a00000.bean.EssayTag;

import java.util.List;

public interface EssayTagService {

    int addTagOnEssay(EssayTag et);

    int deleteTagEssay(String id);

    List<EssayTag> getEssayTagsByEssayId(String id);

    EssayTag getEssayTagById(String id);

}
