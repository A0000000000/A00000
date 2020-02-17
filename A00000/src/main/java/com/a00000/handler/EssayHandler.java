package com.a00000.handler;

import com.a00000.bean.Essay;
import com.a00000.service.EssayService;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping("/")
public class EssayHandler {

    @Autowired
    private EssayService essayService;

    @RequestMapping("getAllEssayTitle")
    public @ResponseBody List<Map<String, Object>> getAllEssayTitle(@RequestParam(value = "page", required = false) Integer page, @RequestParam(value = "size", required = false) Integer size) throws Exception {
        LogUtils.LogInfo("EssayHandler.getAllEssayTitle", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        if (page == null || page <= 0) {
            page = 1;
        }
        if (size == null || size <= 0) {
            size = 10;
        }
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Map<String, Object>> res = new ArrayList<>();
        List<Essay> essays = essayService.getEssay(page, size);
        essays.stream().forEach(essay -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", essay.getId());
            map.put("title", essay.getTitle());
            map.put("password", StringUtils.isEmpty(essay.getPassword()) ? "false" : "true");
            map.put("typeid", essay.getTypeid());
            map.put("creator", essay.getCreator());
            map.put("createTime", format.format(essay.getCreateTime().getTime()));
            map.put("updateTime", format.format(essay.getUpdateTime().getTime()));
            res.add(map);
        });
        return res;
    }

    @RequestMapping("isHavePassword")
    public @ResponseBody Map<String, Object> isHavePassword(@RequestParam("id") String id) throws Exception {
        LogUtils.LogInfo("EssayHandler.isHavePassword", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        Essay essay = essayService.getEssayById(id);
        if (essay == null) {
            map.put("status", "failed");
            map.put("message", "随笔不见了~~~");
        } else {
            map.put("status", "success");
            if(StringUtils.isEmpty(essay.getPassword())) {
                map.put("message", "false");
            } else {
                map.put("message", "true");
            }
        }
        return map;
    }

    @RequestMapping("getEssayById")
    public @ResponseBody Map<String, Object> getEssayById(@RequestParam("id") String id, @RequestParam(value = "password", required = false) String password) throws Exception {
        LogUtils.LogInfo("EssayHandler.getEssayById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        Essay essay = essayService.getEssayById(id);
        if (essay == null) {
            map.put("status", "failed");
            map.put("message", "随笔不见了~~~");
        } else {
            map.put("status", "success");
            if(StringUtils.isEmpty(essay.getPassword()) || essay.getPassword().equals(password)) {
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                map.put("message", "success");
                map.put("id", essay.getId());
                map.put("title", essay.getTitle());
                map.put("content", essay.getContent());
                map.put("createTime", format.format(essay.getCreateTime().getTime()));
                map.put("updateTime", format.format(essay.getUpdateTime().getTime()));
                map.put("password", StringUtils.isEmpty(essay.getPassword()) ? "false" : "true");
                map.put("creator", essay.getCreator());
                map.put("typeid", essay.getTypeid());
            } else {
                map.put("message", "密码错误!");
            }
        }
        return map;
    }

    @RequestMapping("deleteEssayById")
    public @ResponseBody Map<String, Object> deleteEssayById(@RequestParam("id") String id) throws Exception {
        LogUtils.LogInfo("EssayHandler.deleteEssayById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        boolean res = essayService.deleteEssayById(id);
        if (res) {
            map.put("status", "success");
            map.put("message", "删除成功");
        } else {
            map.put("status", "failed");
            map.put("message", "服务器忙");
        }
        return map;
    }

    @RequestMapping("addNewEssay")
    public @ResponseBody Map<String, Object> addNewEssay(Essay essay) throws Exception {
        LogUtils.LogInfo("EssayHandler.addNewEssay", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        boolean res = essayService.addNewEssay(essay);
        if (res) {
            map.put("status", "success");
            map.put("message", "添加成功");
        } else {
            map.put("status", "failed");
            map.put("message", "服务器忙");
        }
        return map;
    }

    @RequestMapping("updateEssay")
    public @ResponseBody Map<String, Object> updateEssay(Essay essay) throws Exception {
        LogUtils.LogInfo("EssayHandler.updateEssay", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        boolean res = essayService.updateEssay(essay);
        if (res) {
            map.put("status", "success");
            map.put("message", "更新成功!");
        } else {
            map.put("status", "failed");
            map.put("message", "服务器忙!");
        }
        return map;
    }

    @RequestMapping("getPagesCount")
    public @ResponseBody Map<String, Object> getPagesCount(@RequestParam(value = "size", required = false) Integer size) throws Exception {
        LogUtils.LogInfo("EssayHandler.getPagesCount", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        if (size == null || size <= 0) {
            size = 10;
        }
        Map<String, Object> map = new HashMap<>();
        Integer pages = essayService.getEssayPages(size);
        map.put("status", "success");
        map.put("pages", pages);
        return map;
    }

}
