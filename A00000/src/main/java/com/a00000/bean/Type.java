package com.a00000.bean;

import java.io.Serializable;

/**
 * 随笔类型对应的bean
 */
public class Type implements Serializable {

    // 类型id
    private String id;
    // 类型名称
    private String name;
    // 类型的附加信息
    private String message;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
