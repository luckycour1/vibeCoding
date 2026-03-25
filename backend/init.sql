-- 创建数据库
CREATE DATABASE IF NOT EXISTS vibecoding DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vibecoding;

-- 用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    nickname VARCHAR(50) COMMENT '昵称',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    department VARCHAR(50) COMMENT '部门',
    position VARCHAR(50) COMMENT '职位',
    status INT DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 角色表
CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '角色名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    description VARCHAR(200) COMMENT '描述',
    status INT DEFAULT 1 COMMENT '状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 权限表
CREATE TABLE IF NOT EXISTS sys_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '权限名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '权限编码',
    type INT NOT NULL COMMENT '类型 1:菜单 2:按钮',
    path VARCHAR(100) COMMENT '路径',
    icon VARCHAR(50) COMMENT '图标',
    parent_id BIGINT COMMENT '父ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS sys_user_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS sys_role_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_role_perm (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- 插入默认管理员账号 (密码: admin123)
INSERT INTO sys_user (username, password, nickname, email, department, position, status) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '超级管理员', 'admin@vibecoding.com', '技术研发部', '管理员', 1);

-- 插入默认角色
INSERT INTO sys_role (name, code, description, status) VALUES
('超级管理员', 'admin', '拥有所有权限', 1),
('产品经理', 'product_manager', '负责产品规划与设计', 1),
('开发工程师', 'developer', '负责系统开发与维护', 1),
('审核员', 'auditor', '负责内容审核与审批', 1),
('普通用户', 'user', '普通用户', 1);

-- 插入默认权限
INSERT INTO sys_permission (name, code, type, path, icon, parent_id) VALUES
('仪表盘', 'dashboard', 1, '/dashboard', 'dashboard', NULL),
('用户管理', 'user', 1, '/users', 'user', NULL),
('用户列表', 'user:list', 2, NULL, NULL, 2),
('用户新增', 'user:add', 2, NULL, NULL, 2),
('用户编辑', 'user:edit', 2, NULL, NULL, 2),
('用户删除', 'user:delete', 2, NULL, NULL, 2),
('角色管理', 'role', 1, '/roles', 'safety-certificate', NULL),
('角色列表', 'role:list', 2, NULL, NULL, 7),
('角色新增', 'role:add', 2, NULL, NULL, 7),
('角色编辑', 'role:edit', 2, NULL, NULL, 7),
('角色删除', 'role:delete', 2, NULL, NULL, 7),
('系统设置', 'system', 1, '/settings', 'setting', NULL);

-- 给管理员角色分配所有权限
INSERT INTO sys_role_permission (role_id, permission_id) 
SELECT 1, id FROM sys_permission;
