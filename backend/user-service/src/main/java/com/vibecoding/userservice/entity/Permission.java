package com.vibecoding.userservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("sys_permission")
public class Permission {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String code;
    private Integer type;
    private String path;
    private String icon;
    private Long parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
