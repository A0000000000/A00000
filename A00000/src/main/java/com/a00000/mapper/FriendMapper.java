package com.a00000.mapper;

import com.a00000.bean.Friend;
import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface FriendMapper {

    @Insert("insert into t_friend(id, username, qqid, wechatid, email, telephone, createTime) values (#{id}, #{username}, #{qqid}, #{wechatid}, #{email}, #{telephone}, #{createTime})")
    int insertNewFriend(Friend friend) throws Exception;
}
