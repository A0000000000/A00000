package com.a00000.mapper;

import com.a00000.bean.Essay;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface EssayMapper {

    @Select("select * from t_essay")
    List<Essay> selectAllEssay() throws Exception;

    @Select("select * from t_essay where id = #{id}")
    Essay selectEssayById(@Param("id") String id) throws Exception;

    @Delete("delete from t_essay where id = #{id}")
    void deleteEssayById(@Param("id") String id) throws Exception;

    @Insert("insert into t_essay (id, title, content, createTime, password, creator) values(#{id}, #{title}, #{content}, #{createTime}, #{password}, #{creator})")
    void insertEssay(Essay essay) throws Exception;

    @Update("update t_essay set title = #{title}, content = #{content}, createTime = #{createTime}, password = #{password}, creator = #{creator} where id = #{id}")
    void updateEssay(Essay essay) throws Exception;
}
