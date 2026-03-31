package com.vibecoding.userservice.dto;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.vibecoding.comm.dto.SearchPagedDto;
import com.vibecoding.userservice.entity.Role;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RoleQueryDto extends SearchPagedDto {

    private String name;
    private String code;
    private Integer status;

    @Override
    public LambdaQueryWrapper<Role> buildWrapper() {
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();

        if (name != null && !name.trim().isEmpty()) {
            wrapper.like(Role::getName, name.trim());
        }

        if (code != null && !code.trim().isEmpty()) {
            wrapper.like(Role::getCode, code.trim());
        }

        if (status != null) {
            wrapper.eq(Role::getStatus, status);
        }

        return wrapper;
    }
}