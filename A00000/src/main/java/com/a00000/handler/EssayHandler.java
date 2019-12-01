package com.a00000.handler;

import com.a00000.bean.Essay;
import com.a00000.service.EssayService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.*;

@Controller
@RequestMapping("/")
public class EssayHandler {

    @Autowired
    private EssayService essayService;


    @RequestMapping("getAllEssayList")
    public @ResponseBody List<Map<String, Object>> getAllEssayList() throws Exception {
        List<Map<String, Object>> res = new ArrayList<>();
        List<Essay> essays = essayService.queryAllEssay();
        for (Essay essay : essays) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", essay.getId());
            map.put("title", essay.getTitle());
            map.put("password", StringUtils.isEmpty(essay.getPassword()) ? "false" : "true");
            res.add(map);
        }
        return res;
    }

    @RequestMapping("getEssayById")
    public @ResponseBody Map<String, Object> getEssayById(@RequestParam("id") String id, @RequestParam("password") String password) throws Exception {
        Map<String, Object> map = new HashMap<>();
        Essay essay = essayService.queryEssayById(id);
        if (essay != null) {
            if(StringUtils.isEmpty(essay.getPassword()) || essay.getPassword().equals(password)) {
                map.put("status", "success");
                map.put("title", essay.getTitle());
                map.put("creator", essay.getCreator());
                map.put("createTime", essay.getCreateTime().toString());
            } else {
                map.put("status", "failed");
                map.put("message", "密码错误!");
            }
        } else {
            map.put("status", "failed");
            map.put("message", "文章不见了~~~~");
        }
        return map;
    }

    @RequestMapping("getEssayContentById")
    public void getEssayContentById(HttpServletResponse response, @RequestParam("id") String id, @RequestParam("password") String password) throws Exception {
        Essay essay = essayService.queryEssayById(id);
        if (essay != null) {
            if(StringUtils.isEmpty(essay.getPassword()) || essay.getPassword().equals(password)) {
                response.getWriter().write(essay.getContent());
            } else {
                response.getWriter().write("密码错误!");
            }
        } else {
            response.getWriter().write("内容不见了~~~~");
        }
    }

    @RequestMapping("deleteEssay")
    public @ResponseBody Map<String, Object> deleteEssay(@Param("id") String id) throws Exception {
        Map<String, Object> map = new HashMap<>();
        boolean res = essayService.deleteEssayById(id);
        if (res) {
            map.put("status", "success");
            map.put("message", "删除成功!");
        } else {
            map.put("status", "failed");
            map.put("message", "服务器忙!");
        }
        return map;
    }

    @RequestMapping("addNewEssay")
    public @ResponseBody Map<String, Object> addNewEssay(Essay essay) throws Exception {
        Map<String, Object> map = new HashMap<>();
        if (essay != null) {
            boolean res = essayService.addEssay(essay);
            if (res) {
                map.put("status", "success");
                map.put("message", "添加成功");
            } else {
                map.put("status", "failed");
                map.put("message", "服务器忙!");
            }
        } else {
            map.put("status", "failed");
            map.put("message", "随笔不能为空!");
        }
        return map;
    }

    @RequestMapping("updateEssay")
    public @ResponseBody Map<String, Object> updateEssay(Essay essay) throws Exception {
        Map<String, Object> map = new HashMap<>();
        if (essay != null) {
            boolean res = essayService.editEssay(essay);
            if (res) {
                map.put("status", "success");
                map.put("message", "修改成功");
            } else {
                map.put("status", "failed");
                map.put("message", "服务器忙!");
            }
        } else {
            map.put("status", "failed");
            map.put("message", "随笔不能为空!");
        }
        return map;
    }

}
