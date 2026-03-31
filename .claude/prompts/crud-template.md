# CRUD 代码生成模板

请根据以下模板生成完整的 Spring Boot + MyBatis Plus CRUD 代码。按格式填写信息后，我会生成 Entity、Mapper、Service、Controller 和 DTO 代码。

## 模板开始
```
=== CRUD 生成请求 ===

表结构:
表名: [在此填写表名，如 sys_product]
字段列表:
- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- [字段1名]: [字段1类型] [约束] COMMENT '[字段1注释]'
- [字段2名]: [字段2类型] [约束] COMMENT '[字段2注释]'
- [字段3名]: [字段3类型] [约束] COMMENT '[字段3注释]'
[更多字段...]

服务信息:
服务名: [在此填写服务名，如 product]
服务目录: [在此填写Java包路径，如 com.vibecoding.productservice]
基础路径: [在此填写Controller基础路径，如 /api/product]

生成选项:
- 生成DTO: [true/false]
- 生成分页查询: [true/false]
- 生成统计方法: [true/false]
- 生成关联查询: [true/false] (如有外键字段)
- 生成导入导出: [true/false]
- 生成权限控制: [true/false]

特殊字段说明:
- 唯一字段: [列出所有唯一约束字段，用于生成校验逻辑]
- 外键字段: [列出所有外键字段及关联表]
- 枚举字段: [列出所有枚举字段及取值说明]
- 密码字段: [列出密码字段，会添加加密和忽略序列化逻辑]

=== 模板结束 ===
```

## 使用示例

### 示例1：生成部门管理CRUD
```
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
- 生成关联查询: false
- 生成导入导出: false
- 生成权限控制: true

特殊字段说明:
- 唯一字段: name, code
- 外键字段: 无
- 枚举字段: status (0:禁用, 1:启用)
- 密码字段: 无
```

### 示例2：生成产品管理CRUD
```
=== CRUD 生成请求 ===

表结构:
表名: sys_product
字段列表:
- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(100) NOT NULL COMMENT '产品名称'
- sku: VARCHAR(50) NOT NULL UNIQUE COMMENT 'SKU编码'
- price: DECIMAL(10,2) NOT NULL COMMENT '价格'
- stock: INT DEFAULT 0 COMMENT '库存数量'
- category_id: BIGINT COMMENT '分类ID'
- description: TEXT COMMENT '描述'
- status: INT DEFAULT 1 COMMENT '状态 1:上架 0:下架'

服务信息:
服务名: product
服务目录: com.vibecoding.productservice
基础路径: /api/product

生成选项:
- 生成DTO: true
- 生成分页查询: true
- 生成统计方法: true
- 生成关联查询: true
- 生成导入导出: true
- 生成权限控制: true

特殊字段说明:
- 唯一字段: sku
- 外键字段: category_id (关联 sys_category 表)
- 枚举字段: status (1:上架, 0:下架)
- 密码字段: 无
```

## 生成的文件结构

根据输入信息，我会生成以下文件：

1. **实体类 (Entity)**
   - 路径: `[服务目录]/entity/[实体类名].java`
   - 继承 `BaseEntity`
   - 包含 `@TableName` 注解
   - 包含所有字段映射

2. **Mapper接口**
   - 路径: `[服务目录]/mapper/[实体类名]Mapper.java`
   - 继承 `BaseMapper<实体类>`
   - 包含 `@Mapper` 注解

3. **Service类**
   - 路径: `[服务目录]/service/[实体类名]Service.java`
   - 包含 `@Service` 和 `@RequiredArgsConstructor`
   - 包含完整的 CRUD 方法
   - 包含业务逻辑和校验

4. **Controller类**
   - 路径: `[服务目录]/controller/[实体类名]Controller.java`
   - 包含 `@RestController` 和 `@RequestMapping`
   - 包含 RESTful 端点
   - 返回 `ResponseEntity<Result<T>>`

5. **DTO类 (如启用)**
   - 路径: `[服务目录]/dto/[实体类名]DTO.java`
   - 包含需要暴露的字段
   - 用于数据传输和展示

## 命名转换规则

| 输入 | 转换规则 | 示例 |
|------|----------|------|
| 表名 | 去除前缀，下划线转大驼峰 | `sys_department` → `Department` |
| 字段名 | 下划线转小驼峰 | `create_time` → `createTime` |
| 实体变量名 | 实体类名首字母小写 | `Department` → `department` |
| 包路径 | 按服务目录组织 | `com.vibecoding.userservice` |

## 快速开始

1. 复制模板到 Claude 对话
2. 填写表结构、服务信息和生成选项
3. 等待生成完整代码
4. 复制代码到对应目录
5. 根据需要微调代码