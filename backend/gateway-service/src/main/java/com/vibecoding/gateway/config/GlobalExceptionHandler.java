package com.vibecoding.gateway.config;

import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.reactive.result.view.ViewResolver;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * 网关全局异常处理 - 确保所有错误响应都是JSON格式
 */
@Configuration
public class GlobalExceptionHandler {

    @Bean
    public ErrorWebExceptionHandler errorWebExceptionHandler(List<ViewResolver> viewResolvers) {
        return new CustomErrorWebExceptionHandler(viewResolvers);
    }

    private static class CustomErrorWebExceptionHandler implements ErrorWebExceptionHandler {

        private final List<ViewResolver> viewResolvers;

        public CustomErrorWebExceptionHandler(List<ViewResolver> viewResolvers) {
            this.viewResolvers = viewResolvers;
        }

        @Override
        public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
            ServerHttpResponse response = exchange.getResponse();
            
            // 如果响应已经提交，直接返回
            if (response.isCommitted()) {
                return Mono.error(ex);
            }

            // 设置响应状态码和Content-Type
            response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            
            // 根据异常类型设置状态码
            if (ex instanceof ResponseStatusException) {
                response.setStatusCode(((ResponseStatusException) ex).getStatus());
            } else {
                response.setStatusCode(HttpStatus.NOT_FOUND);
            }

            // 构建JSON错误响应
            String errorMessage;
            int statusCode = response.getStatusCode() != null ? response.getStatusCode().value() : 500;
            
            if (ex instanceof org.springframework.cloud.gateway.support.NotFoundException) {
                errorMessage = "服务不可用或路由未找到";
                statusCode = 503;
                response.setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
            } else if (ex.getMessage() != null && ex.getMessage().contains("Connection refused")) {
                errorMessage = "后端服务连接失败";
                statusCode = 503;
                response.setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
            } else {
                errorMessage = ex.getMessage() != null ? ex.getMessage() : "网关内部错误";
            }

            String jsonResponse = String.format(
                "{\"code\":%d,\"message\":\"%s\",\"data\":null}",
                statusCode,
                errorMessage.replace("\"", "\\\"")
            );

            DataBuffer buffer = response.bufferFactory().wrap(jsonResponse.getBytes(StandardCharsets.UTF_8));
            return response.writeWith(Mono.just(buffer));
        }
    }
}
