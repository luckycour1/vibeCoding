# Vibe Coding 运维手册

## 1. 环境要求

### 硬件要求
- CPU: 4 核+
- 内存: 8GB+
- 磁盘: 50GB+

### 软件要求
- Docker: 20.10+
- Docker Compose: 2.0+
- JDK: 17 (Amazon Corretto 17)
- Maven: 3.8+

## 2. 快速部署

### 2.1 克隆项目
```bash
git clone https://github.com/luckycour1/vibeCoding.git
cd vibeCoding
```

### 2.2 构建业务服务
```bash
# 构建用户服务
cd backend/user-service
mvn clean package -DskipTests

# 构建网关服务
cd ../gateway-service
mvn clean package -DskipTests
```

### 2.3 启动所有服务
```bash
# 启动中间件（ infra）
docker-compose --profile infra up -d

# 启动业务服务（business）
docker-compose --profile business up -d

# 或者一次性启动全部
docker-compose up -d
```

### 2.4 验证服务
```bash
docker ps
```

## 3. 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 | http://localhost:3000 | React 开发服务 |
| 网关 | http://localhost:8080 | API 网关 |
| Nacos | http://localhost:8848 | 服务注册/配置中心 (nacos/nacos) |
| MySQL | localhost:3306 | 数据库 (root/root) |
| Redis | localhost:6379 | 缓存 |
| Kafka | localhost:9092 | 消息队列 |
| Kafka UI | http://localhost:8088 | Kafka 管理界面 |
| Prometheus | http://localhost:9090 | 监控 |
| Grafana | http://localhost:3000 | 可视化 (admin/admin) |
| Loki | http://localhost:3100 | 日志聚合 |

## 4. Docker Compose 命令

### 4.1 常用命令
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f [服务名]

# 重启服务
docker-compose restart [服务名]

# 查看服务状态
docker-compose ps
```

### 4.2 分环境启动
```bash
# 只启动中间件
docker-compose --profile infra up -d

# 只启动业务服务
docker-compose --profile business up -d

# 停止中间件
docker-compose --profile infra down

# 停止业务服务
docker-compose --profile business down
```

### 4.3 重新构建
```bash
# 重新构建并启动
docker-compose build --no-cache [服务名]
docker-compose up -d [服务名]
```

## 5. 服务日志

日志目录: `/mnt/e/workApp/all-logs/`

```
/mnt/e/workApp/all-logs/
├── gateway/          # 网关服务日志
├── user/            # 用户服务日志
├── prometheus/      # 监控数据
├── nacos/           # Nacos 日志
└── (spring-cloud)/ # 其他服务日志
```

### 查看日志
```bash
# 查看用户服务日志
tail -f /mnt/e/workApp/all-logs/user/user-service.log

# 查看网关日志
tail -f /mnt/e/workApp/all-logs/gateway/gateway-service.log
```

## 6. 监控配置

### 6.1 Prometheus
- 地址: http://localhost:9090
- 配置文件: `./backend/prometheus.yml`

### 6.2 Grafana
- 地址: http://localhost:3000
- 用户名: admin
- 密码: admin

### 6.3 Loki 日志查询
- 地址: http://localhost:3100
- 可通过 Grafana 集成查询日志

### 6.4 Kafka UI
- 地址: http://localhost:8088
- 查看 Kafka 消息和主题

## 7. 数据库

### 7.1 连接信息
- Host: localhost
- Port: 3306
- Database: vibecoding
- Username: root
- Password: root

### 7.2 初始化数据
初始化脚本: `./backend/init.sql`

默认账号:
- 用户名: admin
- 密码: admin123 (BCrypt 加密)

### 7.3 常用 SQL
```sql
-- 查看所有用户
SELECT * FROM vibecoding.sys_user;

-- 查看所有角色
SELECT * FROM vibecoding.sys_role;

-- 查看所有权限
SELECT * FROM vibecoding.sys_permission;
```

## 8. 常见问题

### 8.1 端口占用
```bash
# 查看端口占用
netstat -tlnp | grep [端口号]

# 停止占用端口的容器
docker-compose stop [服务名]
```

### 8.2 容器无法启动
```bash
# 查看容器日志
docker-compose logs [服务名]

# 检查配置
docker-compose config
```

### 8.3 Nacos 无法启动
```bash
# 检查 MySQL 是否就绪
docker-compose logs mysql

# 等待 MySQL 启动完成后再启动 Nacos
docker-compose up -d nacos
```

### 8.4 清理环境
```bash
# 停止并删除所有容器
docker-compose down

# 删除卷（数据会被清除）
docker-compose down -v

# 删除未使用的镜像
docker image prune -a
```

## 9. API 接口

### 9.1 认证接口
```
POST /api/user/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

响应:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 7200,
  "user": {
    "userId": 1,
    "username": "admin",
    "nickname": "超级管理员",
    "roles": ["admin"]
  }
}
```

### 9.2 授权
后续请求需要在 Header 中添加:
```
Authorization: Bearer <token>
```

### 9.3 用户接口
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/user/list | 用户列表 |
| POST | /api/user/add | 添加用户 |
| PUT | /api/user/update/{id} | 更新用户 |
| DELETE | /api/user/delete/{id} | 删除用户 |

### 9.4 角色接口
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/role/list | 角色列表 |
| POST | /api/role/add | 添加角色 |
| PUT | /api/role/update/{id} | 更新角色 |
| DELETE | /api/role/delete/{id} | 删除角色 |

## 10. 备份与恢复

### 10.1 备份 MySQL
```bash
docker exec mysql mysqldump -u root -proot vibecoding > backup.sql
```

### 10.2 恢复 MySQL
```bash
docker exec -i mysql mysql -u root -proot vibecoding < backup.sql
```

### 10.3 备份 Redis
```bash
docker exec redis redis-cli SAVE
docker cp redis:/data/dump.rdb ./backup.rdb
```

## 11. 扩展

### 11.1 增加服务
1. 在 `./backend/` 下创建新的微服务模块
2. 添加 Dockerfile
3. 在 `docker-compose.yml` 中添加服务配置
4. 在网关配置中添加路由

### 11.2 集群部署
- 使用 Docker Swarm 或 Kubernetes
- 配置 Nginx 负载均衡
- 使用外部数据库集群

---

**版本**: v1.0
**更新日期**: 2026-03-25
**维护人**: 罗超的助手 🦞
