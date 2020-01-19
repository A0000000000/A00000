package com.a00000.handler;

import com.a00000.service.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.a00000.bean.Type;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 随笔类型的控制器, 用于处理与随笔类型相关的请求
 */
@Controller
@RequestMapping("/")
public class TypeHandler {

    @Autowired
    private TypeService typeService;

    /**
     * 根据id获得随笔类型的数据
     * @param id 随笔类型的id
     * @return JSON数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("getTypeById")
    public @ResponseBody Type getTypeById(@RequestParam("id") String id) throws Exception {
        return typeService.getTypeById(id);
    }

    /**
     * 获取所有的随笔类型
     * @return JSON数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("getAllType")
    public @ResponseBody List<Type> getAllType() throws Exception {
        return typeService.getAllType();
    }

    /**
     * 增加一条新类型
     * @param type 类型对象
     * @return JSON格式的数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("addNewType")
    public @ResponseBody Map<String, Object> addNewType(Type type) throws Exception {
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

    /**
     * 根据id删除一条记录
     * @param id 随笔类型id
     * @return JSON格式数据
     * @throws Exception 控制器可能出现的异常
     */
    @RequestMapping("deleteTypeById")
    public @ResponseBody Map<String, Object> deleteTypeById(@RequestParam("id") String id) throws Exception {
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
