package com.a00000.mapper;

import com.a00000.bean.Friend;
import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

/**
 * 对t_friend表进行增删改查的Mapper接口
 */
@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface FriendMapper {

    /**
     * 向t_friend表增加一条记录
     * @param friend Friend对象
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Insert("insert into t_friend(id, username, qqid, wechatid, email, telephone, createTime) values (#{id}, #{username}, #{qqid}, #{wechatid}, #{email}, #{telephone}, #{createTime})")
    int insertNewFriend(Friend friend) throws Exception;
}
