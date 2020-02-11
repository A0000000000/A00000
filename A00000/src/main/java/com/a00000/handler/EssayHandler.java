package com.a00000.handler;

import com.a00000.bean.Essay;
import com.a00000.service.EssayService;
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

/**
 * 随笔的控制器, 用于处理与随笔相关的请求
 */
@Controller
@RequestMapping("/")
public class EssayHandler {

    // 注入Service对象
    @Autowired
    private EssayService essayService;

    /**
     * 处理获取某页随笔的方法
     * @param page 第page页
     * @return 返回JSON格式的数据
     * @throws Exception 类型转换出错等异常
     */
    @RequestMapping("getAllEssayTitle")
    public @ResponseBody List<Map<String, Object>> getAllEssayTitle(@RequestParam(value = "page", required = false) Integer page, @RequestParam(value = "size", required = false) Integer size) throws Exception {
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

    /**
     * 判断一篇随笔是否具有密码保护
     * @param id 随笔id
     * @return JSON格式的数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("isHavePassword")
    public @ResponseBody Map<String, Object> isHavePassword(@RequestParam("id") String id) throws Exception {
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

    /**
     * 根据id查询一篇随笔
     * @param id 随笔id
     * @param password 随笔密码
     * @return JSON格式数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("getEssayById")
    public @ResponseBody Map<String, Object> getEssayById(@RequestParam("id") String id, @RequestParam(value = "password", required = false) String password) throws Exception {
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

    /**
     * 根据id删除一篇随笔
     * @param id 随笔id
     * @return JSON格式数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("deleteEssayById")
    public @ResponseBody Map<String, Object> deleteEssayById(@RequestParam("id") String id) throws Exception {
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

    /**
     * 向数据库中增加一条随笔
     * @param essay 随笔对象
     * @return JSON格式数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("addNewEssay")
    public @ResponseBody Map<String, Object> addNewEssay(Essay essay) throws Exception {
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

    /**
     * 向数据库更新一条随笔
     * @param essay 随笔对象
     * @return JSON格式数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("updateEssay")
    public @ResponseBody Map<String, Object> updateEssay(Essay essay) throws Exception {
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

    /**
     * 获取随笔的页数
     * @param size 每页的数量
     * @return JSON格式数据
     * @throws Exception SQL异常
     */
    @RequestMapping("getPagesCount")
    public @ResponseBody Map<String, Object> getPagesCount(@RequestParam(value = "size", required = false) Integer size) throws Exception {
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
