# CRUD 代码生成提示词系统

## 概述
本项目提供了一套完整的 CRUD 代码生成提示词，可以根据数据库表结构、服务名和目录信息，自动生成 Spring Boot + MyBatis Plus 的完整 CRUD 代码。

## 文件说明

### 1. `crud-generator.md`
**完整生成器文档**：包含详细的代码生成规范、命名约定、代码模板和使用说明。适用于需要深入了解生成逻辑的开发人员。

### 2. `crud-template.md`
**快速生成模板**：提供了一个可以直接复制粘贴的模板格式。用户只需按格式填写表结构和服务信息，即可生成完整代码。适用于快速生成 CRUD 代码。

### 3. `crud-example.md`
**使用示例**：包含多个完整的使用示例，展示了如何填写模板和预期的生成结果。适用于学习和参考。

## 使用方法

### 方法一：使用快速模板（推荐）
1. 打开 `crud-template.md` 文件
2. 复制模板内容到 Claude 对话
3. 按格式填写表结构、服务信息和生成选项
4. 发送给 Claude，等待生成完整代码

### 方法二：使用详细文档
1. 阅读 `crud-generator.md` 了解生成规范
2. 按文档中的输入格式提供信息
3. Claude 将按规范生成代码

### 方法三：参考示例
1. 查看 `crud-example.md` 中的示例
2. 按示例格式修改自己的需求
3. 发送给 Claude 生成代码

## 生成内容

根据输入信息，系统将生成以下文件：

1. **实体类 (Entity)** - 继承 `BaseEntity`，包含字段映射和表名注解
2. **Mapper 接口** - 继承 `BaseMapper<Entity>`，包含 `@Mapper` 注解
3. **Service 类** - 包含 `@Service` 注解，实现完整的 CRUD 业务逻辑
4. **Controller 类** - 包含 `@RestController` 注解，实现 RESTful API
5. **DTO 类**（可选）- 用于数据传输和展示

## 项目规范

生成的代码遵循以下项目规范：

1. **统一响应格式**：使用 `Result<T>` 包装响应数据
2. **业务异常处理**：使用 `BusinessException` 处理业务异常
3. **逻辑删除**：使用 `is_deleted` 字段，类型为 `BOOLEAN`
4. **公共字段**：所有实体继承 `BaseEntity`，包含创建人、创建时间、更新人、更新时间
5. **密码加密**：密码字段自动添加 `PasswordUtil.encode()` 加密
6. **唯一性校验**：唯一字段自动添加重复校验逻辑

## 命名约定

| 元素 | 命名规则 | 示例 |
|------|----------|------|
| 表名 | 蛇形命名，带前缀 | `sys_user` |
| 实体类 | 大驼峰，去除前缀 | `User` |
| 实体变量 | 小驼峰 | `user` |
| Mapper 接口 | 实体类名 + Mapper | `UserMapper` |
| Service 类 | 实体类名 + Service | `UserService` |
| Controller 类 | 实体类名 + Controller | `UserController` |
| DTO 类 | 实体类名 + DTO | `UserDTO` |

## 快速示例

生成部门管理 CRUD 代码：

```markdown
=== CRUD 生成请求 ===

表结构:
表名: sys_department
字段列表:
- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(50) NOT NULL UNIQUE COMMENT '部门名称'
- code: VARCHAR(50) NOT NULL UNIQUE COMMENT '部门编码'
- description: VARCHAR(200) COMMENT '描述'
- status: INT DEFAULT 1 COMMENT '状态 0:禁用 1:启用'

服务信息:
服务名: department
服务目录: com.vibecoding.userservice
基础路径: /api/department

生成选项:
- 生成DTO: true
- 生成分页查询: true
- 生成统计方法: true

特殊字段说明:
- 唯一字段: name, code
- 枚举字段: status (0:禁用, 1:启用)
```

## 注意事项

1. **表名前缀**：系统会自动去除 `sys_`、`tbl_` 等常见前缀
2. **字段类型映射**：数据库类型会自动映射到 Java 类型
3. **逻辑删除**：所有实体都包含 `isDeleted` 字段
4. **公共字段**：无需在表结构中列出，继承 `BaseEntity` 自动包含
5. **密码字段**：会自动添加 `@JsonIgnore` 和加密逻辑

## 扩展功能

如需生成更复杂的功能，可以在生成选项中启用：

- **关联查询**：处理外键关联关系
- **分页查询**：生成分页查询方法和参数
- **统计方法**：生成各种统计查询方法
- **导入导出**：生成 Excel 导入导出功能
- **权限控制**：添加 Spring Security 权限注解

## 支持与反馈

如果在使用过程中遇到问题，或需要定制生成规则，请参考项目代码结构或联系开发人员。