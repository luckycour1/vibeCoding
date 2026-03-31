package com.vibecoding.userservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String phone;
    private String department;
    private Long departmentId;
    private String position;
    private Integer status;
    private String createdAt;
    private String password;
    private List<String> roles;
}
