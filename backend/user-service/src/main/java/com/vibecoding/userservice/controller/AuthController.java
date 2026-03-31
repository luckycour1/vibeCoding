package com.vibecoding.userservice.controller;

import com.vibecoding.comm.dto.Result;
import com.vibecoding.userservice.dto.LoginRequest;
import com.vibecoding.userservice.dto.LoginVo;
import com.vibecoding.userservice.dto.RefreshTokenRequest;
import com.vibecoding.userservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public Result<LoginVo> login(@RequestBody LoginRequest request) {
        LoginVo loginVo = authService.login(request);
        return Result.success(loginVo);
    }

    @PostMapping("/refresh-token")
    public Result<LoginVo> refreshToken(@RequestBody RefreshTokenRequest request) {
        // 从请求中获取 refresh token 并验证
        if (request == null || request.getRefreshToken() == null || request.getRefreshToken().isEmpty()) {
            return Result.unauthorized("refresh_token 不能为空");
        }

        try {
            // 验证 refresh token 并生成新的 access token
            LoginVo newTokens = authService.refreshToken(request.getRefreshToken().trim());
            return Result.success(newTokens);
        } catch (Exception e) {
            return Result.unauthorized("refresh_token 无效或已过期，请重新登录");
        }
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        // 可以在这里添加 token 黑名单逻辑
        return Result.success("登出成功", null);
    }
}
