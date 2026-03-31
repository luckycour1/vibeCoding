package com.vibecoding.userservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import com.vibecoding.comm.entity.BaseEntity;


@Data
@TableName("sys_user")
@JsonIgnoreProperties({"password"})
public class User extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;
    @JsonIgnore
    private String password;
    private String nickname;
    private String email;
    private String phone;
    private String department;
    private Long departmentId;
    private String position;
    private Integer status;

    @TableField(exist = false)
    private java.util.List<String> roles;

}
