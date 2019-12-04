package com.a00000.service.impl;

import com.a00000.bean.Friend;
import com.a00000.mapper.FriendMapper;
import com.a00000.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    private FriendMapper friendMapper;

    @Override
    @Transactional
    public boolean addNewFriend(Friend friend) {
        boolean res = false;
        friend.setCreateTime(new Date());
        friend.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        try {
            friendMapper.insertNewFriend(friend);
            res = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }
}
