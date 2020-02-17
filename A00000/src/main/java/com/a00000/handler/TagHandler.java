package com.a00000.handler;

import com.a00000.bean.EssayTag;
import com.a00000.bean.Tag;
import com.a00000.service.EssayTagServiceProxy;
import com.a00000.utils.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

@Controller
@RequestMapping("/")
public class TagHandler {

    @Autowired
    private EssayTagServiceProxy essayTagService;

    @RequestMapping("addTag")
    public @ResponseBody Map<String, Object> addTag(@RequestParam("essayId") String essayId, @RequestParam("tagName") String tagName) throws Exception {
        LogUtils.LogInfo("TagHandler.addTag", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        int res = essayTagService.addEssayTag(essayId, tagName);
        if (res > 0) {
            map.put("status", "success");
            map.put("message", "添加成功!");
        } else {
            map.put("status", "failed");
            map.put("message", "添加失败!");
        }
        return map;
    }

    @RequestMapping("deleteTag")
    public @ResponseBody Map<String, Object> deleteTag(@RequestParam("id") String id) throws Exception {
        LogUtils.LogInfo("TagHandler.deleteTag", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        Map<String, Object> map = new HashMap<>();
        int res = essayTagService.deleteEssayTag(id);
        if (res > 0) {
            map.put("status", "success");
            map.put("message", "删除成功!");
        } else {
            map.put("status", "failed");
            map.put("message", "删除失败!");
        }
        return map;
    }

    @RequestMapping("getTagsByEssayId")
    public @ResponseBody List<Map<String, Object>> getTagsByEssayId(@RequestParam("essayId") String essayId) throws Exception {
        LogUtils.LogInfo("TagHandler.getTagsByEssayId", Thread.currentThread().getStackTrace()[1].getFileName(), Thread.currentThread().getStackTrace()[1].getLineNumber(), new Date());
        List<Map<String, Object>> list = new LinkedList<>();
        Map<EssayTag, Tag> res = essayTagService.getTagByEssayId(essayId);
        for (Map.Entry<EssayTag, Tag> item : res.entrySet()) {
            Map<String, Object> tmp = new HashMap<>();
            tmp.put("id", item.getKey().getId());
            tmp.put("name", item.getValue().getName());
            tmp.put("createTime", item.getKey().getCreateTime());
            tmp.put("essayId", essayId);
            list.add(tmp);
        }
        return list;
    }
}
