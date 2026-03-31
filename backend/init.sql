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
    department VARCHAR(50) COMMENT '部门 (兼容旧字段)',
    department_id BIGINT COMMENT '部门ID',
    position VARCHAR(50) COMMENT '职位',
    status INT DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
    create_user_id VARCHAR(50) COMMENT '创建人ID',
    create_user_name VARCHAR(50) COMMENT '创建人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_user_id VARCHAR(50) COMMENT '更新人ID',
    update_user_name VARCHAR(50) COMMENT '更新人姓名',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '逻辑删除标记 false:未删除 true:已删除',
    INDEX idx_username (username),
    INDEX idx_status (status),
    INDEX idx_department_id (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 部门表
CREATE TABLE IF NOT EXISTS sys_department (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '部门名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '部门编码',
    description VARCHAR(200) COMMENT '描述',
    status INT DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
    create_user_id VARCHAR(50) COMMENT '创建人ID',
    create_user_name VARCHAR(50) COMMENT '创建人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_user_id VARCHAR(50) COMMENT '更新人ID',
    update_user_name VARCHAR(50) COMMENT '更新人姓名',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '逻辑删除标记 false:未删除 true:已删除',
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 角色表
CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '角色名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    description VARCHAR(200) COMMENT '描述',
    status INT DEFAULT 1 COMMENT '状态',
    create_user_id VARCHAR(50) COMMENT '创建人ID',
    create_user_name VARCHAR(50) COMMENT '创建人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_user_id VARCHAR(50) COMMENT '更新人ID',
    update_user_name VARCHAR(50) COMMENT '更新人姓名',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '逻辑删除标记 false:未删除 true:已删除',
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
    create_user_id VARCHAR(50) COMMENT '创建人ID',
    create_user_name VARCHAR(50) COMMENT '创建人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_user_id VARCHAR(50) COMMENT '更新人ID',
    update_user_name VARCHAR(50) COMMENT '更新人姓名',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '逻辑删除标记 false:未删除 true:已删除',
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS sys_user_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    create_user_id VARCHAR(50) COMMENT '创建人ID',
    create_user_name VARCHAR(50) COMMENT '创建人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_user_id VARCHAR(50) COMMENT '更新人ID',
    update_user_name VARCHAR(50) COMMENT '更新人姓名',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除标记 false:未删除 true:已删除',
    UNIQUE KEY uk_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS sys_role_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    create_user_id VARCHAR(50) COMMENT '创建人ID',
    create_user_name VARCHAR(50) COMMENT '创建人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_user_id VARCHAR(50) COMMENT '更新人ID',
    update_user_name VARCHAR(50) COMMENT '更新人姓名',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除标记 false:未删除 true:已删除',
    UNIQUE KEY uk_role_perm (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- 插入默认部门 (使用 INSERT IGNORE 避免重复)
INSERT IGNORE INTO sys_department (name, code, description, status) VALUES
('技术研发部', 'tech', '负责技术研发与系统维护', 1),
('产品设计部', 'product', '负责产品规划与设计', 1),
('生产制造部', 'manufacture', '负责生产制造与工艺', 1),
('质量管理部', 'quality', '负责质量管理与检验', 1),
('市场运营部', 'marketing', '负责市场推广与运营', 1);

-- 插入默认管理员账号 (密码: admin123)
INSERT INTO sys_user (username, password, nickname, email, department, department_id, position, status)
VALUES ('admin', '$2a$10$yZh6gcLTmqZaaCyMSxNVWe27B.IhKxN94th3Aa71i6.67cH82dJg6', '超级管理员', 'admin@vibecoding.com', '技术研发部', 1, '管理员', 1);

-- 插入默认角色 (使用 INSERT IGNORE 避免重复)
INSERT IGNORE INTO sys_role (name, code, description, status) VALUES
('超级管理员', 'admin', '拥有所有权限', 1),
('产品经理', 'product_manager', '负责产品规划与设计', 1),
('开发工程师', 'developer', '负责系统开发与维护', 1),
('审核员', 'auditor', '负责内容审核与审批', 1),
('普通用户', 'user', '普通用户', 1);

-- 给管理员用户分配超级管理员角色 (user_id=1, role_id=1)
INSERT IGNORE INTO sys_user_role (user_id, role_id) VALUES (1, 1);

-- 插入默认权限
INSERT INTO sys_permission (name, code, type, path, icon, parent_id) VALUES
('首页', 'home', 1, '/', 'home', NULL),
('仪表盘', 'dashboard', 1, '/dashboard', 'dashboard', NULL),
('用户管理', 'user-management', 1, NULL, 'user', NULL),
('用户列表', 'user', 1, '/users', 'team', 3),
('角色管理', 'role', 1, '/roles', 'safety-certificate', 3),
('部门管理', 'department', 1, '/departments', 'team', 3),
('系统设置', 'system', 1, NULL, 'setting', NULL),
('个人设置', 'settings', 1, '/settings', 'setting', 7),
-- 用户列表按钮权限
('用户新增', 'user:add', 2, NULL, NULL, 4),
('用户编辑', 'user:edit', 2, NULL, NULL, 4),
('用户删除', 'user:delete', 2, NULL, NULL, 4),
('用户查看', 'user:view', 2, NULL, NULL, 4),
-- 角色管理按钮权限
('角色新增', 'role:add', 2, NULL, NULL, 5),
('角色编辑', 'role:edit', 2, NULL, NULL, 5),
('角色删除', 'role:delete', 2, NULL, NULL, 5),
('角色查看', 'role:view', 2, NULL, NULL, 5),
-- 部门管理按钮权限
('部门新增', 'department:add', 2, NULL, NULL, 6),
('部门编辑', 'department:edit', 2, NULL, NULL, 6),
('部门删除', 'department:delete', 2, NULL, NULL, 6),
('部门查看', 'department:view', 2, NULL, NULL, 6);

-- 给管理员角色分配所有权限
INSERT INTO sys_role_permission (role_id, permission_id)
SELECT 1, id FROM sys_permission;

-- 给产品经理分配权限 (可以查看用户、部门信息，不能修改系统核心数据)
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
(2, 1),  -- 首页
(2, 2),  -- 仪表盘
(2, 3),  -- 用户管理 (父菜单)
(2, 4),  -- 用户列表
(2, 12), -- 用户查看
(2, 6),  -- 部门管理
(2, 20), -- 部门查看
(2, 7),  -- 系统设置 (父菜单)
(2, 8);  -- 个人设置

-- 给开发工程师分配权限 (可以管理用户、角色、部门，但不需要系统设置)
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
(3, 1),  -- 首页
(3, 2),  -- 仪表盘
(3, 3),  -- 用户管理 (父菜单)
(3, 4),  -- 用户列表
(3, 9),  -- 用户新增
(3, 10), -- 用户编辑
(3, 11), -- 用户删除
(3, 12), -- 用户查看
(3, 5),  -- 角色管理
(3, 13), -- 角色新增
(3, 14), -- 角色编辑
(3, 15), -- 角色删除
(3, 16), -- 角色查看
(3, 6),  -- 部门管理
(3, 17), -- 部门新增
(3, 18), -- 部门编辑
(3, 19), -- 部门删除
(3, 20), -- 部门查看
(3, 7),  -- 系统设置 (父菜单)
(3, 8);  -- 个人设置

-- 给审核员分配权限 (可以查看用户信息，进行审核操作)
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
(4, 1),  -- 首页
(4, 2),  -- 仪表盘
(4, 3),  -- 用户管理 (父菜单)
(4, 4),  -- 用户列表
(4, 12), -- 用户查看
(4, 10), -- 用户编辑 (用于审核操作)
(4, 7),  -- 系统设置 (父菜单)
(4, 8);  -- 个人设置

-- 给普通用户分配基本权限
INSERT INTO sys_role_permission (role_id, permission_id) VALUES
(5, 1),  -- 首页
(5, 7),  -- 系统设置 (父菜单)
(5, 8);  -- 个人设置
