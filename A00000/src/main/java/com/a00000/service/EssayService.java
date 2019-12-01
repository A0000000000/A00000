package com.a00000.service;

import com.a00000.bean.Essay;

import java.util.List;

public interface EssayService {

    List<Essay> queryAllEssay();

    Essay queryEssayById(String id);

    boolean deleteEssayById(String id);

    boolean addEssay(Essay essay);

    boolean editEssay(Essay essay);
}
