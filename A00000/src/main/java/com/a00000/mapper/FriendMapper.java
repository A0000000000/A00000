package com.a00000.mapper;

import com.a00000.bean.Friend;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FriendMapper {

    @Insert("insert into t_friend(id, username, qqid, wechatid, email, telephone, createTime) values (#{id}, #{username}, #{qqid}, #{wechatid}, #{email}, #{telephone}, #{createTime})")
    void insertNewFriend(Friend friend) throws Exception;

}
