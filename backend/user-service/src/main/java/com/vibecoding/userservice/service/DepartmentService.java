package com.vibecoding.userservice.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vibecoding.comm.common.BusinessException;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.comm.service.BaseEntityService;
import com.vibecoding.userservice.dto.DepartmentDto;
import com.vibecoding.userservice.entity.Department;
import com.vibecoding.userservice.mapper.DepartmentMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DepartmentService extends BaseEntityService<Department, DepartmentDto> {

    private final DepartmentMapper departmentMapper;
    private final UserService userService;

    // 构造函数
    public DepartmentService(DepartmentMapper departmentMapper, UserService userService) {
        super(departmentMapper, "Department");
        this.departmentMapper = departmentMapper;
        this.userService = userService;
    }

    @Override
    protected Department syncProperties(Department entity, DepartmentDto dto) {
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
        return entity;
    }

    @Override
    protected Department build() {
        return new Department();
    }

    @Override
    protected Result<String> dbValidate(Long id, DepartmentDto dto, Department entity) {
        // 检查部门编码唯一性
        LambdaQueryWrapper<Department> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Department::getCode, dto.getCode());
        wrapper.ne(id != null && id != 0L, Department::getId, id);
        Department existed = departmentMapper.selectOne(wrapper);
        if (existed != null) {
            return Result.badRequest("部门编码已存在");
        }
        return Result.ok(null);
    }

    // 特定业务方法

    /**
     * 查询启用的部门列表
     */
    public List<Department> findEnabled() {
        return departmentMapper.selectList(new LambdaQueryWrapper<Department>()
                .eq(Department::getStatus, 1));
    }

    /**
     * 根据编码查询部门
     */
    public Department findByCode(String code) {
        return departmentMapper.selectOne(new LambdaQueryWrapper<Department>()
                .eq(Department::getCode, code));
    }

    /**
     * 获取所有部门的员工总数
     */
    public long getEmployeeCount() {
        return userService.countAllUsers();
    }
}