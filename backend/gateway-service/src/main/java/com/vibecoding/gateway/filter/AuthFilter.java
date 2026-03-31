package com.vibecoding.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

/**
 * 网关认证过滤器 - 本地验证 JWT Token
 */
@Component
public class AuthFilter implements GlobalFilter, Ordered {

    private static final List<String> WHITE_LIST = Arrays.asList(
            "/api/user/login",
            "/api/user/register",
            "/api/user/refresh-token",
            "/api/role/list"
    );

    private static final Logger log = LoggerFactory.getLogger(AuthFilter.class);

    @Value("${jwt.secret:vibecoding-secret-key-for-jwt-token-generation}")
    private String secret;

    private SecretKey getSigningKey() {
        log.debug("JWT secret length: {}", secret.length());
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        log.debug("Key bytes length before padding: {}", keyBytes.length);
        if (keyBytes.length < 64) {
            byte[] padded = new byte[64];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            for (int i = keyBytes.length; i < 64; i++) {
                padded[i] = (byte) (i + 1);
            }
            keyBytes = padded;
            log.debug("Key bytes after padding length: {}", keyBytes.length);
        }
        log.debug("Final key bytes length: {}", keyBytes.length);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        log.debug("AuthFilter processing request: {} {}", request.getMethod(), path);
        String method = request.getMethod().name();

        // 放行 OPTIONS 预检请求
        if ("OPTIONS".equals(method)) {
            return chain.filter(exchange);
        }

        // 白名单直接放行
        if (WHITE_LIST.stream().anyMatch(path::startsWith)) {
            log.debug("Path {} is in white list, skipping auth", path);
            return chain.filter(exchange);
        }

        // 获取 token
        log.debug("Checking authorization header");
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("Authorization header missing or invalid: {}", authHeader);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        log.debug("Token extracted (first 20 chars): {}", token.substring(0, Math.min(token.length(), 20)));

        // 本地验证 token
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            log.debug("Token validation successful, username: {}", claims.getSubject());
            // 将用户信息添加到请求头中
            String username = claims.getSubject();
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Username", username)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            log.debug("Token validation failed: {}", e.getMessage(), e);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
