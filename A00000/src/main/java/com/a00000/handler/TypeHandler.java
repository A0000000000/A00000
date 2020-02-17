package com.a00000.handler;

import com.a00000.service.TypeService;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.a00000.bean.Type;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/")
public class TypeHandler {

    @Autowired
    private TypeService typeService;

    @RequestMapping("getTypeById")
    public @ResponseBody Type getTypeById(@RequestParam("id") String id) throws Exception {
        LogUtils.LogInfo("TypeHandler.getTypeById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        return typeService.getTypeById(id);
    }

    @RequestMapping("getAllType")
    public @ResponseBody List<Type> getAllType() throws Exception {
        return typeService.getAllType();
    }

    @RequestMapping("addNewType")
    public @ResponseBody Map<String, Object> addNewType(Type type) throws Exception {
        LogUtils.LogInfo("TypeHandler.addNewType", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        boolean res = typeService.addNewType(type);
        if (res) {
            map.put("status", "success");
            map.put("message", "添加成功!");
        } else {
            map.put("status", "failed");
            map.put("message", "添加失败, 请检查输入是否重名!");
        }
        return map;
    }

    @RequestMapping("deleteTypeById")
    public @ResponseBody Map<String, Object> deleteTypeById(@RequestParam("id") String id) throws Exception {
        LogUtils.LogInfo("TypeHandler.deleteTypeById", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        if (StringUtils.isEmpty(id)) {
            map.put("status", "failed");
            map.put("message", "随笔类型id不能为空!");
        } else if ("0".equals(id)) {
            map.put("status", "failed");
            map.put("message", "不能删除默认类型");
        } else {
            boolean res = typeService.deleteTypeById(id);
            if (res) {
                map.put("status", "success");
                map.put("message", "删除成功!");
            } else {
                map.put("status", "failed");
                map.put("message", "服务器忙!");
            }
        }
        return map;
    }
}
