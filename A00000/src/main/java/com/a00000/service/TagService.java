package com.a00000.service;

import com.a00000.bean.Tag;

import java.util.List;

public interface TagService {

    int addOrGetTag(Tag tag);

    int deleteTag(String id);

    int updateTag(Tag tag);

    List<Tag> getTagByIds(List<String> ids);

    Tag getTagById(String id);

}
