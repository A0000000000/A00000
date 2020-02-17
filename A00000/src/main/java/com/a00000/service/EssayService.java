package com.a00000.service;


import com.a00000.bean.Essay;

import java.util.List;

public interface EssayService {

    List<Essay> getEssay(Integer page, Integer size);

    Essay getEssayById(String id);

    boolean deleteEssayById(String id);

    boolean addNewEssay(Essay essay);

    boolean updateEssay(Essay essay);

    Integer getEssayPages(Integer size);
}
