package com.a00000.mapper;

import com.a00000.bean.Essay;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 用于处理与t_essay表增删改查的Mapper接口
 */
@Mapper
@CacheNamespace(implementation = org.mybatis.caches.ehcache.EhcacheCache.class)
public interface EssayMapper {

    /**
     * 查询t_essay表的数据
     * @param begin 开始位置
     * @param count 查询数量
     * @return Essay的List集合
     * @throws Exception SQL异常
     */
    @Select("select id, title, content, createTime, updateTime, password, creator, typeid from t_essay limit #{begin}, #{count}")
    List<Essay> selectEssay(@Param("begin") Integer begin, @Param("count") Integer count) throws Exception;

    /**
     * 根据id查询t_essay表的数据
     * @param id essay的id
     * @return essay的对象
     * @throws Exception SQL异常
     */
    @Select("select id, title, content, createTime, updateTime, password, creator, typeid from t_essay where id = #{id}")
    Essay selectEssayById(@Param("id") String id) throws Exception;

    /**
     * 根据id删除一条记录
     * @param id id值
     * @return 受影响的行数
     * @throws Exception SQL异常
     */
    @Delete("delete from t_essay where id = #{id}")
    int deleteEssayById(@Param("id") String id) throws Exception;

    /**
     * 向t_essay插入一条数据
     * @param essay 数据对象
     * @return 受影响的行数
     * @throws Exception SQL异常
     */
    @Insert("insert into t_essay(id, title, content, createTime, updateTime, password, creator, typeid) values(#{id}, #{title}, #{content}, #{createTime}, #{updateTime}, #{password}, #{creator}, #{typeid})")
    int insertEssay(Essay essay) throws Exception;

    /**
     * 更新t_essay一条数据
     * @param essay 带更新的对象
     * @return 受影响的行数
     * @throws Exception SQL异常
     */
    @Update("update t_essay set title = #{title}, content = #{content}, createTime = #{createTime}, updateTime = #{updateTime}, password = #{password}, creator = #{creator}, typeid = #{typeid} where id = #{id}")
    int updateEssay(Essay essay) throws Exception;

    /**
     * 删除随笔类型信息辅助方法
     * @param source 随笔类型id
     * @param target 要修改为的id
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Update("update t_essay set typeid = #{target} where typeid = #{source}")
    int updateEssayByType(@Param("source") String source, @Param("target") String target) throws Exception;

    /**
     * 获取所有随笔的数量
     * @return 返回随笔数量
     * @throws Exception SQL异常
     */
    @Select("select count(id) from t_essay")
    Integer selectEssayCount() throws Exception;
}
