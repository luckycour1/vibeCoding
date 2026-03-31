package com.vibecoding.userservice.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vibecoding.comm.common.BusinessException;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.comm.service.BaseEntityService;
import com.vibecoding.userservice.dto.RoleDto;
import com.vibecoding.userservice.entity.Role;
import com.vibecoding.userservice.mapper.RoleMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RoleService extends BaseEntityService<Role, RoleDto> {

    private final RoleMapper roleMapper;
    private final UserService userService;

    // 构造函数
    public RoleService(RoleMapper roleMapper, UserService userService) {
        super(roleMapper, "Role");
        this.roleMapper = roleMapper;
        this.userService = userService;
    }

    @Override
    protected Role syncProperties(Role entity, RoleDto dto) {
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
        // permissions和userCount是瞬态字段，不在此处理
        return entity;
    }

    @Override
    protected Role build() {
        return new Role();
    }

    @Override
    protected Result<String> dbValidate(Long id, RoleDto dto, Role entity) {
        // 检查角色编码唯一性
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Role::getCode, dto.getCode());
        wrapper.ne(id != null && id != 0L, Role::getId, id);
        Role existed = roleMapper.selectOne(wrapper);
        if (existed != null) {
            return Result.badRequest("角色编码已存在");
        }
        return Result.ok(null);
    }

    // 特定业务方法

    /**
     * 获取用户总数（通过userService）
     */
    public long getUserCount() {
        return userService.countAllUsers();
    }

    /**
     * 查询所有角色（包含用户数量统计） - 保留原有方法，但需要调整实现
     */
    public List<Role> findAll() {
        return roleMapper.selectRolesWithUserCount();
    }
}