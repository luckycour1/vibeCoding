package com.vibecoding.userservice.dto;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.vibecoding.comm.dto.SearchPagedDto;
import com.vibecoding.userservice.entity.Department;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class DepartmentQueryDto extends SearchPagedDto {

    private String name;
    private String code;
    private Integer status;

    @Override
    public LambdaQueryWrapper<Department> buildWrapper() {
        LambdaQueryWrapper<Department> wrapper = new LambdaQueryWrapper<>();

        if (name != null && !name.trim().isEmpty()) {
            wrapper.like(Department::getName, name.trim());
        }

        if (code != null && !code.trim().isEmpty()) {
            wrapper.like(Department::getCode, code.trim());
        }

        if (status != null) {
            wrapper.eq(Department::getStatus, status);
        }

        return wrapper;
    }
}