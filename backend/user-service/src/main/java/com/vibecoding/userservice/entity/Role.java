package com.vibecoding.userservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.vibecoding.comm.entity.BaseEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("sys_role")
public class Role extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String code;
    private String description;
    private Integer status;
}
