package com.a00000.service;


import com.a00000.bean.Essay;

import java.util.List;

/**
 * 用于处理与Essay相关的Service方法
 */
public interface EssayService {
    /**
     * 用于获取随笔的内容
     * @param page 获取第page页的随笔内容
     * @return 返回随笔的List集合
     */
    List<Essay> getEssay(Integer page);

    /**
     * 通过id查询一篇随笔
     * @param id 随笔id
     * @return 随笔对象
     */
    Essay getEssayById(String id);

    /**
     * 根据id删除一篇随笔
     * @param id 随笔id
     * @return 是否删除成功
     */
    boolean deleteEssayById(String id);

    /**
     * 向数据库插入一条随笔
     * @param essay 随笔对象
     * @return 是否插入成功
     */
    boolean addNewEssay(Essay essay);

    /**
     * 向数据库更新一条随笔
     * @param essay 随笔对象
     * @return 是否更新成功
     */
    boolean updateEssay(Essay essay);

}
