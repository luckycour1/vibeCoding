# CRUD 生成示例

## 如何使用 CRUD 生成器

### 步骤1：准备输入信息
收集以下信息：
1. 数据库表结构（SQL CREATE语句或字段描述）
2. 服务名称（如：user、role、department等）
3. Java包路径（如：com.vibecoding.userservice）
4. Controller基础路径（如：/api/department）

### 步骤2：调用生成器
使用以下格式向 Claude 提供信息：

```
请根据以下信息生成完整的 CRUD 代码：

表名: sys_department
字段:
- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(50) NOT NULL UNIQUE COMMENT '部门名称'
- code: VARCHAR(50) NOT NULL UNIQUE COMMENT '部门编码'
- description: VARCHAR(200) COMMENT '描述'
- status: INT DEFAULT 1 COMMENT '状态 0:禁用 1:启用'

服务名: department
服务目录: com.vibecoding.userservice
基础路径: /api/department

生成选项:
- 生成DTO: true
- 生成分页查询: false
- 生成统计方法: true
```

### 步骤3：验证生成的代码
检查生成的代码是否符合项目规范：
1. 实体类是否继承 `BaseEntity`
2. 是否包含 `@TableName` 注解
3. 逻辑删除字段是否为 `isDeleted`
4. 业务异常是否正确处理
5. 响应格式是否为 `Result<T>`

## 完整示例

### 输入：
```
请根据以下信息生成完整的 CRUD 代码：

表名: sys_product
字段:
- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(100) NOT NULL COMMENT '产品名称'
- sku: VARCHAR(50) NOT NULL UNIQUE COMMENT 'SKU编码'
- price: DECIMAL(10,2) NOT NULL COMMENT '价格'
- stock: INT DEFAULT 0 COMMENT '库存数量'
- category_id: BIGINT COMMENT '分类ID'
- description: TEXT COMMENT '描述'
- status: INT DEFAULT 1 COMMENT '状态 1:上架 0:下架'

服务名: product
服务目录: com.vibecoding.productservice
基础路径: /api/product

生成选项:
- 生成DTO: true
- 生成分页查询: true
- 生成统计方法: true
```

### 预期输出：
Claude 将生成以下文件：

1. **Product.java** (实体类)
2. **ProductMapper.java** (Mapper接口)
3. **ProductService.java** (Service类)
4. **ProductController.java** (Controller类)
5. **ProductDTO.java** (DTO类)

## 常见问题

### 1. 如何处理关联关系？
如果表有关联字段（如 `category_id`），在实体类中添加相应字段：
```java
private Long categoryId;

@TableField(exist = false)
private String categoryName; // 关联查询时使用
```

在 Service 中添加关联查询逻辑。

### 2. 如何生成分页查询？
在 Service 中添加分页方法：
```java
public Page<实体类> findPage(PageRequest pageRequest) {
    Page<实体类> page = new Page<>(pageRequest.getPage(), pageRequest.getSize());
    return mapper.selectPage(page, null);
}
```

在 Controller 中添加分页端点。

### 3. 如何生成统计方法？
在 Service 中添加统计方法：
```java
public long countByStatus(Integer status) {
    return mapper.selectCount(new LambdaQueryWrapper<实体类>()
            .eq(status != null, 实体类::getStatus, status));
}
```

## 提示词使用技巧

1. **字段注释要清晰**：字段的 COMMENT 会用于生成代码注释
2. **唯一字段要标注**：唯一约束字段需要在 Service 中添加校验逻辑
3. **关联字段要说明**：如果是外键字段，说明关联的表
4. **枚举字段要说明**：如果有状态字段，说明枚举值的含义
5. **密码字段特殊处理**：如果是密码字段，需要添加 `@JsonIgnore` 和加密逻辑

## 扩展功能

如需生成更复杂的代码，可以添加以下选项：
- 生成导入导出功能
- 生成权限注解（如 `@PreAuthorize`）
- 生成缓存逻辑
- 生成消息队列处理
- 生成单元测试

只需在生成选项中添加相应配置即可。