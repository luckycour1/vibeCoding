package com.vibecoding.userservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vibecoding.userservice.entity.Department;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DepartmentMapper extends BaseMapper<Department> {
}