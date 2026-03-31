package com.vibecoding.userservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.vibecoding.comm.entity.BaseEntity;

import java.time.LocalDateTime;

@Data
@TableName("sys_user_role")
public class UserRole extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Long roleId;

}