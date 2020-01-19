package com.a00000.mapper;

import com.a00000.bean.Type;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 用于处理与t_type表增删改查的Mapper接口
 */
@Mapper
public interface TypeMapper {

    /**
     * 根据id从t_type表查询一条数据
     * @param id 带查询的id
     * @return 随笔对象
     * @throws Exception SQL异常
     */
    @Select("select id, name, message from t_type where id = #{id}")
    Type selectTypeById(@Param("id") String id) throws Exception;

    /**
     * 从t_type表查询所有的随笔类型
     * @return 随笔类型的列表
     * @throws Exception SQL异常
     */
    @Select("select id, name, message from t_type")
    List<Type> selectAllType() throws Exception;

    /**
     * 通过name从t_type中查询一条记录
     * @param name name值
     * @return Type对象
     * @throws Exception SQL异常
     */
    @Select("select id, name, message from t_type where name = #{name}")
    Type selectTypeByName(@Param("name") String name) throws Exception;

    /**
     * 向t_type表插入一条记录
     * @param type 随笔类型对象
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Insert("insert into t_type(id, name, message) values (#{id}, #{name}, #{message})")
    int insertNewType(Type type) throws Exception;

    /**
     * 根据id删除t_type一条记录
     * @param id 随笔类型id
     * @return 受影响行数
     * @throws Exception SQL异常
     */
    @Delete("delete from t_type where id = #{id}")
    int deleteTypeById(@Param("id") String id) throws Exception;
}
