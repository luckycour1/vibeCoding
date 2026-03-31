package com.vibecoding.userservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.vibecoding.comm.entity.BaseEntity;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("sys_role")
public class Role extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String code;
    private String description;
    private Integer status;

    @TableField(exist = false)
    private List<String> permissions;

    @TableField(exist = false)
    private Integer userCount;
}
