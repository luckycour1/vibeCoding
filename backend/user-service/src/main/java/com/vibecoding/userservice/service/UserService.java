package com.vibecoding.userservice.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vibecoding.comm.common.BusinessException;
import com.vibecoding.comm.security.PasswordUtil;
import com.vibecoding.comm.service.BaseEntityService;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.userservice.dto.UserDto;
import com.vibecoding.userservice.entity.Role;
import com.vibecoding.userservice.entity.User;
import com.vibecoding.userservice.mapper.RoleMapper;
import com.vibecoding.userservice.mapper.UserMapper;
import com.vibecoding.userservice.mapper.UserRoleMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService extends BaseEntityService<User, UserDto> {

    private final UserMapper userMapper;
    private final UserRoleMapper userRoleMapper;
    private final RoleMapper roleMapper;

    // 构造函数，创建ServiceImpl传递给父类
    public UserService(UserMapper userMapper, UserRoleMapper userRoleMapper, RoleMapper roleMapper) {
        super(userMapper, "User");
        this.userMapper = userMapper;
        this.userRoleMapper = userRoleMapper;
        this.roleMapper = roleMapper;
    }

    @Override
    protected User syncProperties(User entity, UserDto dto) {
        entity.setUsername(dto.getUsername());
        entity.setNickname(dto.getNickname());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setDepartment(dto.getDepartment());
        entity.setDepartmentId(dto.getDepartmentId());
        entity.setPosition(dto.getPosition());
        entity.setStatus(dto.getStatus());
        // 处理密码：如果dto中有密码，则加密设置；否则保持原密码
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            String password = dto.getPassword().trim();
            // 如果密码为空字符串，使用默认密码123456
            if (password.isEmpty()) {
                password = "123456";
            }
            entity.setPassword(PasswordUtil.encode(password));
        }
        // roles字段是瞬态的，不在syncProperties中处理
        return entity;
    }

    @Override
    protected User build() {
        return new User();
    }

    @Override
    protected Result<String> dbValidate(Long id, UserDto dto, User entity) {
        // 检查用户名唯一性
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, dto.getUsername());
        wrapper.ne(id != null && id != 0L, User::getId, id);
        User existed = userMapper.selectOne(wrapper);
        if (existed != null) {
            return Result.badRequest("用户名已存在");
        }
        return Result.ok(null);
    }

    @Override
    @Transactional
    public Result<User> create(UserDto dto) {
        // 调用父类创建用户
        Result<User> result = super.create(dto);
        if (!result.isSuccess()) {
            return result;
        }
        User savedUser = result.getData();
        // 处理角色关系
        saveUserRoles(savedUser.getId(), dto.getRoles());
        return result;
    }

    @Override
    @Transactional
    public Result<User> update(long id, UserDto dto) {
        // 调用父类更新用户
        com.vibecoding.comm.dto.Result<User> result = super.update(id, dto);
        if (!result.isSuccess()) {
            return result;
        }
        // 处理角色关系
        saveUserRoles(id, dto.getRoles());
        return result;
    }

    // 以下为特定业务方法

    public User findByUsername(String username) {
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
        if (user != null) {
            // 设置角色编码列表
            user.setRoles(getRoleCodesByUserId(user.getId()));
        }
        return user;
    }

    public List<String> getRoleCodesByUserId(Long userId) {
        List<Long> roleIds = userRoleMapper.findRoleIdsByUserId(userId);
        if (roleIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Role> roles = roleMapper.selectList(new LambdaQueryWrapper<Role>()
                .in(Role::getId, roleIds));
        return roles.stream()
                .map(Role::getCode)
                .collect(Collectors.toList());
    }

    /**
     * 获取用户总数
     */
    public long countAllUsers() {
        return userMapper.selectCount(null);
    }

    /**
     * 获取指定部门的用户数量
     */
    public long countUsersByDepartmentId(Long departmentId) {
        return userMapper.selectCount(new LambdaQueryWrapper<User>()
                .eq(departmentId != null, User::getDepartmentId, departmentId));
    }

    /**
     * 获取所有部门的用户数量统计
     */
    public long countAllUsersInDepartments() {
        return userMapper.selectCount(new LambdaQueryWrapper<User>()
                .isNotNull(User::getDepartmentId));
    }

    /**
     * 保存用户角色关系
     */
    private void saveUserRoles(Long userId, List<String> roleCodes) {
        if (roleCodes == null || roleCodes.isEmpty()) {
            return;
        }

        // 先删除现有角色关系
        userRoleMapper.deleteByUserId(userId);

        // 将角色编码转换为角色ID
        List<Long> roleIds = new ArrayList<>();
        for (String roleCode : roleCodes) {
            Role role = roleMapper.selectOne(new LambdaQueryWrapper<Role>()
                    .eq(Role::getCode, roleCode));
            if (role != null) {
                roleIds.add(role.getId());
            }
        }

        // 批量插入新的角色关系
        userRoleMapper.batchInsert(userId, roleIds);
    }
}