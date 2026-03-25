package com.vibecoding.userservice.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserInfo user;

    @Data
    public static class UserInfo {
        private Long userId;
        private String username;
        private String nickname;
        private String[] roles;
    }
}
