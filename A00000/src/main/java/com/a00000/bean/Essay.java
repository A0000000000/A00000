package com.a00000.bean;

import java.io.Serializable;
import java.util.Date;

/**
 * 随笔对应的bean
 */
public class Essay implements Serializable {

    // 随笔id
    private String id;
    // 随笔的标题
    private String title;
    // 随笔内容
    private String content;
    // 随笔创建时间
    private Date createTime;
    // 随笔的最后更新时间
    private Date updateTime;
    // 随笔密码
    private String password;
    // 随笔建立者
    private String creator;
    // 随笔类型
    private String typeid;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getTypeid() {
        return typeid;
    }

    public void setTypeid(String typeid) {
        this.typeid = typeid;
    }
}
