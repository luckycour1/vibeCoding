package com.vibecoding.userservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vibecoding.userservice.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.type.JdbcType;

import java.util.List;

@Mapper
public interface RoleMapper extends BaseMapper<Role> {

    @Select("SELECT r.*, COUNT(ur.user_id) as userCount FROM sys_role r LEFT JOIN sys_user_role ur ON r.id = ur.role_id GROUP BY r.id")
    @Results({
        @Result(column = "id", property = "id"),
        @Result(column = "name", property = "name"),
        @Result(column = "code", property = "code"),
        @Result(column = "description", property = "description"),
        @Result(column = "status", property = "status"),
        @Result(column = "userCount", property = "userCount", jdbcType = JdbcType.INTEGER)
    })
    List<Role> selectRolesWithUserCount();
}
