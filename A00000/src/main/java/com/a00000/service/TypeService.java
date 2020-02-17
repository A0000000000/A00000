package com.a00000.service;

import com.a00000.bean.Type;

import java.util.List;

public interface TypeService {

    Type getTypeById(String id);

    List<Type> getAllType();

    boolean addNewType(Type type);

    boolean deleteTypeById(String id);
}
