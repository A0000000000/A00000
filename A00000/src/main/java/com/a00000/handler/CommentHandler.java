package com.a00000.handler;

import com.a00000.bean.Comment;
import com.a00000.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***
 * 评论相关的控制器
 */
@Controller
@RequestMapping("/")
public class CommentHandler {

    @Autowired
    private CommentService commentService;

    /**
     * 处理获取某篇随笔的评论
     * @param essayId 随笔id
     * @return JSON格式数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("getCommentsByEssayId")
    public @ResponseBody List<Map<String, Object>> getCommentsByEssayId(@RequestParam("essayId") String essayId) throws Exception {
        List<Map<String, Object>> list = new ArrayList<>();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Comment> comments = commentService.getCommentsByEssayId(essayId);
        for (Comment comment : comments) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", comment.getId());
            map.put("username", comment.getUsername());
            map.put("content", comment.getContent());
            map.put("createTime", format.format(comment.getCreateTime().getTime()));
            list.add(map);
        }
        return list;
    }

    /**
     * 向数据库增加一条评论
     * @param comment 评论对象
     * @return JSON格式数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("addNewComment")
    public @ResponseBody Map<String, Object> addNewComment(Comment comment) throws Exception {
        Map<String, Object> map = new HashMap<>();
        if (comment == null || StringUtils.isEmpty(comment.getEssayId())) {
            map.put("status", "failed");
            map.put("message", "评论出错, 未能绑定到指定id上!");
        } else {
            boolean res = commentService.addNewComment(comment);
            if (res) {
                map.put("status", "success");
                map.put("message", "评论成功!");
            } else {
                map.put("status", "failed");
                map.put("message", "服务器忙!");
            }
        }
        return map;
    }

    /**
     * 根据id删除一条评论
     * @param id 评论id
     * @return JSON格式数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("deleteCommentById")
    public @ResponseBody Map<String, Object> deleteCommentById(@RequestParam("id") String id) throws Exception {
        Map<String, Object> map = new HashMap<>();
        boolean res = commentService.deleteCommentById(id);
        if (res) {
            map.put("status", "success");
            map.put("message", "删除成功!");
        } else {
            map.put("status", "failed");
            map.put("message", "服务器忙!");
        }
        return map;
    }
}
