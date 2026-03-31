package com.vibecoding.comm.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

/**
 * MyBatis-Plus 公共字段自动填充处理器
 * 适用于所有继承 BaseEntity 的表
 */
@Component
public class MybatisPlusMetaObjectHandler implements MetaObjectHandler {

    /**
     * 获取当前操作用户名
     */
    private String getCurrentUsername() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String username = request.getHeader("X-User-Username");
            if (username != null && !username.isEmpty()) {
                return username;
            }
        }
        return "system";
    }

    @Override
    public void insertFill(MetaObject metaObject) {
        // 严格模式填充策略,默认有值不覆盖,如果提供的值为null也不填充
        String username = getCurrentUsername();
        this.strictInsertFill(metaObject, "createUserId", String.class, username);
        this.strictInsertFill(metaObject, "createUserName", String.class, username);
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateUserId", String.class, username);
        this.strictInsertFill(metaObject, "updateUserName", String.class, username);
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "isDeleted", Boolean.class, false);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        // 通用填充 - 直接覆盖
        String username = getCurrentUsername();
        this.setFieldValByName("updateUserId", username, metaObject);
        this.setFieldValByName("updateUserName", username, metaObject);
        this.setFieldValByName("updateTime", LocalDateTime.now(), metaObject);
    }
}
