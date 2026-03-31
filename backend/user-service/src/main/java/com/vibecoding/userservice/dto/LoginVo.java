package com.vibecoding.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginVo {

    private String token;
    private String refreshToken;
    private Long userId;
    private String username;
    private String nickname;
    private String[] roles;
}
