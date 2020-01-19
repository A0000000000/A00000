package com.a00000.service;

import com.a00000.bean.Type;

import java.util.List;

/**
 * 用于处理与Type相关的Service方法
 */
public interface TypeService {

    /**
     * 根据id获得一个随笔类型对象
     * @param id 随笔类型的id
     * @return 随笔类型对象
     */
    Type getTypeById(String id);

    /**
     * 获得所有的随笔类型
     * @return 随笔类型的列表
     */
    List<Type> getAllType();

    /**
     *
     * @param type
     * @return
     */
    boolean addNewType(Type type);

    /**
     * 通过id删除一条随笔类型记录
     * @param id 随笔类型id
     * @return 是否删除成功
     */
    boolean deleteTypeById(String id);
}
