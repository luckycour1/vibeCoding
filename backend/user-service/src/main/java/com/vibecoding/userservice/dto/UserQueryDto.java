package com.vibecoding.userservice.dto;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.vibecoding.comm.dto.SearchPagedDto;
import com.vibecoding.userservice.entity.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户条件查询DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UserQueryDto extends SearchPagedDto {

    // 查询条件
    private String username;
    private String nickname;
    private String email;
    private String phone;
    private Long departmentId;
    private Integer status;

    /**
     * 构建查询条件包装器
     */
    public LambdaQueryWrapper<User> buildWrapper() {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

        if (username != null && !username.trim().isEmpty()) {
            wrapper.like(User::getUsername, username.trim());
        }

        if (nickname != null && !nickname.trim().isEmpty()) {
            wrapper.like(User::getNickname, nickname.trim());
        }

        if (email != null && !email.trim().isEmpty()) {
            wrapper.like(User::getEmail, email.trim());
        }

        if (phone != null && !phone.trim().isEmpty()) {
            wrapper.like(User::getPhone, phone.trim());
        }

        if (departmentId != null) {
            wrapper.eq(User::getDepartmentId, departmentId);
        }

        if (status != null) {
            wrapper.eq(User::getStatus, status);
        }

        return wrapper;
    }
}