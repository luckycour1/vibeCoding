package com.vibecoding.userservice.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String phone;
    private String department;
    private String position;
    private Integer status;
    private String createdAt;
}
