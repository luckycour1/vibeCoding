package com.vibecoding.userservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vibecoding.userservice.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
