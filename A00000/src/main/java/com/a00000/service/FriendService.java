package com.a00000.service;

import com.a00000.bean.Friend;

/**
 * friend相关的Service方法
 */
public interface FriendService {

    /**
     * 增加一位新朋友
     * @param friend Friend对象
     * @return 是否增加成功
     */
    boolean addNewFriend(Friend friend);

}
