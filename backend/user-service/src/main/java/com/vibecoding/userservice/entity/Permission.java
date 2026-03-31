package com.vibecoding.userservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.vibecoding.comm.entity.BaseEntity;
import lombok.Data;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper=false)
@TableName("sys_permission")
public class Permission extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String code;
    private Integer type;
    private String path;
    private String icon;
    private Long parentId;

    @TableField(exist = false)
    private List<Permission> children;

    @TableField(exist = false)
    private Map<String, Object> extra;

    @TableField(exist = false)
    private Boolean selected;
}
