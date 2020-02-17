package com.a00000.handler;

import com.a00000.bean.Friend;
import com.a00000.service.FriendService;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/")
public class FriendHandler {

    @Autowired
    private FriendService friendService;

    @RequestMapping("addNewFriend")
    public @ResponseBody Map<String, Object> addNewFriend(Friend friend) throws Exception {
        LogUtils.LogInfo("FriendHandler.addNewFriend", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        boolean res = friendService.addNewFriend(friend);
        if (res) {
            map.put("status", "success");
            map.put("message", "记录成功!");
        } else {
            map.put("status", "failed");
            map.put("message", "服务器忙!");
        }
        return map;
    }

}
