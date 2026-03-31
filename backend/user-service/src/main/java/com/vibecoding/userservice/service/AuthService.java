package com.vibecoding.userservice.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.vibecoding.comm.common.BusinessException;
import com.vibecoding.comm.security.JwtTokenProvider;
import com.vibecoding.comm.security.PasswordUtil;
import com.vibecoding.userservice.dto.LoginRequest;
import com.vibecoding.userservice.dto.LoginVo;
import com.vibecoding.userservice.entity.User;
import com.vibecoding.userservice.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.expiration:7200000}")
    private long jwtExpiration;

    public LoginVo login(LoginRequest request) {
        // 查找用户
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, request.getUsername()));

        if (user == null) {
            throw new BusinessException("用户名或密码错误");
        }

        // 校验密码
        if (!PasswordUtil.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }

        if (user.getStatus() != null && user.getStatus() != 1) {
            throw new BusinessException("账号已被禁用");
        }

        // 获取用户角色
        List<String> roleCodes = userService.getRoleCodesByUserId(user.getId());
        String[] rolesArray = roleCodes.toArray(new String[0]);

        // 生成 Token
        String token = jwtTokenProvider.generateToken(user.getUsername());

        return new LoginVo(
                token,
                generateRefreshToken(user.getId()),
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                rolesArray // 用户实际角色
        );
    }

    /**
     * 刷新 Token
     */
    public LoginVo refreshToken(String refreshToken) {
        try {
            // 验证 refresh token
            String subject = jwtTokenProvider.validateTokenAndGetSubject(refreshToken);
            if (subject == null || !subject.startsWith("refresh:")) {
                throw new BusinessException("无效的 refresh_token");
            }

            Long userId = Long.parseLong(subject.replace("refresh:", ""));
            User user = userMapper.selectById(userId);

            if (user == null) {
                throw new BusinessException("用户不存在");
            }

            if (user.getStatus() != null && user.getStatus() != 1) {
                throw new BusinessException("账号已被禁用");
            }

            // 获取用户角色
            List<String> roleCodes = userService.getRoleCodesByUserId(user.getId());
            String[] rolesArray = roleCodes.toArray(new String[0]);

            // 生成新的 token 和 refresh token
            String newToken = jwtTokenProvider.generateToken(user.getUsername());
            String newRefreshToken = generateRefreshToken(userId);

            return new LoginVo(
                    newToken,
                    newRefreshToken,
                    user.getId(),
                    user.getUsername(),
                    user.getNickname(),
                    rolesArray // 用户实际角色
            );
        } catch (Exception e) {
            throw new BusinessException("refresh_token 无效或已过期");
        }
    }

    /**
     * 生成 Refresh Token
     */
    private String generateRefreshToken(Long userId) {
        return jwtTokenProvider.generateToken("refresh:" + userId);
    }
}
