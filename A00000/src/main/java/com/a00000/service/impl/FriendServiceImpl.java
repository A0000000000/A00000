package com.a00000.service.impl;

import com.a00000.bean.Friend;
import com.a00000.mapper.FriendMapper;
import com.a00000.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    private FriendMapper friendMapper;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    @Transactional
    public boolean addNewFriend(Friend friend) {
        friend.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        friend.setCreateTime(new Date());
        try {
            int count = friendMapper.insertNewFriend(friend);
            if (count > 0) {
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }
}
