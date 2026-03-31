# CRUD 代码生成器提示词

## 概述
这是一个用于生成 Spring Boot + MyBatis Plus CRUD 代码的提示词模板。根据提供的表结构、服务名和目录信息，自动生成完整的 Entity、Mapper、Service、Controller 和 DTO 代码。

## 输入格式
请按以下格式提供信息：

### 1. 表结构
提供数据库表的 SQL CREATE 语句或字段描述：
```
表名: [表名]
字段:
- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(50) NOT NULL COMMENT '名称'
- code: VARCHAR(50) NOT NULL UNIQUE COMMENT '编码'
- description: VARCHAR(200) COMMENT '描述'
- status: INT DEFAULT 1 COMMENT '状态 0:禁用 1:启用'
[其他字段...]
```

### 2. 服务信息
```
服务名: [服务名，如 user-service,gateway-servcie 等]
服务目录: [Java包路径，如 com.vibecoding.userservice]
基础路径: [Controller的基础路径，如 /api/[服务名]]
```

### 3. 生成选项（可选）
```
生成DTO: [true/false] - 是否生成DTO（包括新增修改DTO、分页查询DTO、条件查询DTO）
生成分页查询: [true/false] - 是否生成分页查询方法
生成统计方法: [true/false] - 是否生成统计方法
```

## 代码生成规范

### 1. 实体类 (Entity)
- 类名：表名转驼峰 + Entity（如 `sys_user` → `User`）
- 继承 `BaseEntity`
- 添加 `@TableName("表名")` 注解
- 使用 Lombok `@Data`
- 字段映射使用 `@TableField`（如 `is_deleted`）
- 逻辑删除字段：`@TableField("is_deleted") @TableLogic private boolean isDeleted = false;`
- 非数据库字段：`@TableField(exist = false)`

```java
package [服务目录].entity;

import com.baomidou.mybatisplus.annotation.*;
import com.vibecoding.comm.entity.BaseEntity;
import lombok.Data;

@Data
@TableName("[表名]")
public class [实体类名] extends BaseEntity {
    @TableId(type = IdType.AUTO)
    private Long id;

    // 其他字段...
    @TableField("is_deleted")
    @TableLogic
    private boolean isDeleted = false;
}
```

### 2. Mapper 接口
- 接口名：实体类名 + Mapper
- 继承 `BaseMapper<实体类>`
- 添加 `@Mapper` 注解

```java
package [服务目录].mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import [服务目录].entity.[实体类名];
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface [实体类名]Mapper extends BaseMapper<[实体类名]> {
}
```

### 3. Service 类
- 类名：实体类名 + Service
- 继承 `BaseEntityService<[实体类名], [实体类名]Dto>`
- 添加 `@Service` 和 `@RequiredArgsConstructor`
- 使用 MyBatis Plus 的 `IService` 进行数据库操作
- 实现抽象方法 `syncProperties` 和 `build`
- 可重写 `dbValidate` 方法进行数据校验

```java
package [服务目录].service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.comm.service.BaseEntityService;
import [服务目录].entity.[实体类名];
import [服务目录].mapper.[实体类名]Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class [实体类名]Service extends BaseEntityService<[实体类名], [实体类名]Dto> {

    private final [实体类名]Mapper [实体变量名]Mapper;

    // 使用 MyBatis Plus 的 ServiceImpl 作为 IService 实现
    private final com.baomidou.mybatisplus.extension.service.IService<[实体类名]> baseService = 
        new ServiceImpl<[实体类名], [实体变量名]Mapper>() {
            @Override
            public [实体变量名]Mapper getBaseMapper() {
                return [实体变量名]Mapper;
            }
        };

    public [实体类名]Service() {
        super(null, "[实体名]"); // 需要在构造函数中调用 super
        // 实际项目中应在 @PostConstruct 中初始化 baseService
    }

    @Override
    protected [实体类名] syncProperties([实体类名] entity, [实体类名]Dto dto) {
        // 将 DTO 属性同步到实体
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        // 同步其他字段...
        return entity;
    }

    @Override
    protected [实体类名] build() {
        return new [实体类名]();
    }

    @Override
    protected Result<String> dbValidate(Long id, [实体类名]Dto dto, [实体类名] entity) {
        // 数据校验逻辑
        if (id == null) {
            // 新增校验
            if ([实体变量名]Mapper.selectCount(new LambdaQueryWrapper<[实体类名]>()
                    .eq([实体类名]::getCode, dto.getCode())) > 0) {
                return Result.badRequest("编码已存在");
            }
        } else {
            // 更新校验
            if ([实体变量名]Mapper.selectCount(new LambdaQueryWrapper<[实体类名]>()
                    .eq([实体类名]::getCode, dto.getCode())
                    .ne([实体类名]::getId, id)) > 0) {
                return Result.badRequest("编码已存在");
            }
        }
        return Result.ok(null);
    }
}
```

### 4. Controller 类
- 类名：实体类名 + Controller
- 继承 `BaseController<[实体类名]Dto, [实体类名], [实体类名]Service, [实体类名]PageDto>`
- 添加 `@RestController`, `@RequestMapping("[基础路径]")`, `@RequiredArgsConstructor`
- 使用统一的 CRUD 接口：`/find`, `/page`, `/pageForDto`, `/create`, `/update`, `/delete`, `/query`
- 无需手动实现 CRUD 方法，继承基类即可

```java
package [服务目录].controller;

import com.vibecoding.comm.controller.BaseController;
import [服务目录].dto.[实体类名]Dto;
import [服务目录].dto.[实体类名]PageDto;
import [服务目录].entity.[实体类名];
import [服务目录].service.[实体类名]Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("[基础路径]")
@RequiredArgsConstructor
public class [实体类名]Controller extends BaseController<[实体类名]Dto, [实体类名], [实体类名]Service, [实体类名]PageDto> {
    
    private final [实体类名]Service [实体变量名]Service;

    public [实体类名]Controller([实体类名]Service service) {
        super(service);
    }
}
```

### 5. DTO 类（根据规范生成三种DTO）

#### 5.1 新增/修改DTO（{实体类名}Dto）
- 类名：实体类名 + Dto（注意大小写）
- 使用 Lombok `@Data`
- 包含新增和修改操作需要的字段
- 添加必要的验证注解

```java
package [服务目录].dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class [实体类名]Dto {
    private Long id;
    
    @NotBlank(message = "名称不能为空")
    private String name;
    
    @NotBlank(message = "编码不能为空")
    private String code;
    
    private String description;
    
    @NotNull(message = "状态不能为空")
    private Integer status;
    
    // 其他业务字段...
}
```

#### 5.2 分页查询DTO（{实体类名}PageDto）
- 类名：实体类名 + PageDto
- 继承 `SearchPagedDto`
- 包含分页参数和查询条件字段
- 实现 `buildWrapper()` 方法构建查询条件

```java
package [服务目录].dto;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.vibecoding.comm.dto.basic.req.SearchPagedDto;
import [服务目录].entity.[实体类名];
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class [实体类名]PageDto extends SearchPagedDto {
    
    // 查询条件字段
    private String name;
    private String code;
    private Integer status;
    
    @Override
    public <T> LambdaQueryWrapper<T> buildWrapper() {
        LambdaQueryWrapper<[实体类名]> wrapper = new LambdaQueryWrapper<>();
        
        if (name != null && !name.trim().isEmpty()) {
            wrapper.like([实体类名]::getName, name.trim());
        }
        
        if (code != null && !code.trim().isEmpty()) {
            wrapper.like([实体类名]::getCode, code.trim());
        }
        
        if (status != null) {
            wrapper.eq([实体类名]::getStatus, status);
        }
        
        // 按创建时间倒序
        wrapper.orderByDesc([实体类名]::getCreateTime);
        
        return (LambdaQueryWrapper<T>) wrapper;
    }
}
```

#### 5.3 条件查询DTO（{实体类名}QueryDto）
- 类名：实体类名 + QueryDto
- 使用 Lombok `@Data`
- 包含查询条件字段，用于非分页查询
- 可提供 `buildWrapper()` 方法

```java
package [服务目录].dto;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import [服务目录].entity.[实体类名];
import lombok.Data;

@Data
public class [实体类名]QueryDto {
    
    // 查询条件字段
    private String name;
    private String code;
    private Integer status;
    
    public LambdaQueryWrapper<[实体类名]> buildWrapper() {
        LambdaQueryWrapper<[实体类名]> wrapper = new LambdaQueryWrapper<>();
        
        if (name != null && !name.trim().isEmpty()) {
            wrapper.like([实体类名]::getName, name.trim());
        }
        
        if (code != null && !code.trim().isEmpty()) {
            wrapper.like([实体类名]::getCode, code.trim());
        }
        
        if (status != null) {
            wrapper.eq([实体类名]::getStatus, status);
        }
        
        return wrapper;
    }
}
```

## 命名约定
- **实体类名**：表名转大驼峰（`sys_user` → `User`）
- **实体变量名**：实体类名首字母小写（`User` → `user`）
- **包路径**：`[服务目录].entity`, `[服务目录].mapper`, `[服务目录].service`, `[服务目录].controller`, `[服务目录].dto`
- **DTO命名规范**：
  - 新增/修改DTO：`{实体类名}Dto`（如 `UserDto`）
  - 分页查询DTO：`{实体类名}PageDto`（如 `UserPageDto`）
  - 条件查询DTO：`{实体类名}QueryDto`（如 `UserQueryDto`）
- **表名到类名转换规则**：
  - 去除前缀（如 `sys_`, `tbl_`）
  - 下划线转驼峰
  - 首字母大写
- **Controller路径**：使用统一的CRUD接口路径，继承`BaseController`自动获得：
  - `GET /find` - 根据ID查询
  - `POST /page` - 分页查询
  - `POST /pageForDto` - 分页查询并转换为DTO
  - `POST /create` - 创建记录
  - `PUT /update` - 更新记录
  - `DELETE /delete` - 删除记录
  - `GET /query` - 查询所有记录

## 示例

### 输入：
```
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

生成DTO: true
生成分页查询: true
```

### 输出：
将生成以下文件：
1. `Department.java` (Entity)
2. `DepartmentMapper.java` (Mapper)
3. `DepartmentService.java` (Service) - 继承 `BaseEntityService<Department, DepartmentDto>`
4. `DepartmentController.java` (Controller) - 继承 `BaseController<DepartmentDto, Department, DepartmentService, DepartmentPageDto>`
5. `DepartmentDto.java` (新增/修改DTO)
6. `DepartmentPageDto.java` (分页查询DTO)
7. `DepartmentQueryDto.java` (条件查询DTO，可选)

## 使用说明
1. 复制此提示词到 Claude 对话中
2. 按格式提供表结构、服务信息和生成选项
3. Claude 将生成完整的 CRUD 代码
4. 根据需要调整生成的代码

## 注意事项
1. 所有实体必须继承 `BaseEntity`，包含公共字段（创建人、创建时间、更新人、更新时间、逻辑删除）
2. 逻辑删除字段使用 `is_deleted`，类型为 `BOOLEAN`
3. 业务异常使用 `BusinessException`
4. 统一响应格式使用 `Result<T>`
5. 密码字段需要加密处理（如使用 `PasswordUtil.encode()`）
6. 唯一字段需要在校验逻辑