package com.a00000.handler;

import com.a00000.bean.Friend;
import com.a00000.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/")
public class FriendHandler {

    @Autowired
    private FriendService friendService;

    @RequestMapping("addNewFriend")
    public @ResponseBody Map<String, Object> addNewFriend(Friend friend) throws Exception {
        Map<String, Object> map = new HashMap<>();
        if (StringUtils.isEmpty(friend.getUsername())) {
            map.put("status", "failed");
            map.put("message", "称呼不能为空哦!");
        } else if (StringUtils.isEmpty(friend.getQqid()) && StringUtils.isEmpty(friend.getWechatid()) && StringUtils.isEmpty(friend.getEmail()) && StringUtils.isEmpty(friend.getTelephone())) {
            map.put("status", "failed");
            map.put("message", "请至少留下一项联系方式!");
        } else {
            boolean res = friendService.addNewFriend(friend);
            if (res) {
                map.put("status", "success");
                map.put("message", "添加成功!");
            } else {
                map.put("status", "failed");
                map.put("message", "服务器忙!");
            }
        }
        return map;
    }

}
