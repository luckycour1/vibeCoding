package com.vibecoding.userservice.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.vibecoding.comm.common.BusinessException;
import com.vibecoding.userservice.entity.Permission;
import com.vibecoding.userservice.entity.RolePermission;
import com.vibecoding.userservice.entity.UserRole;
import com.vibecoding.userservice.mapper.PermissionMapper;
import com.vibecoding.userservice.mapper.RolePermissionMapper;
import com.vibecoding.userservice.mapper.UserRoleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionMapper permissionMapper;
    private final RolePermissionMapper rolePermissionMapper;
    private final UserRoleMapper userRoleMapper;

    /**
     * 获取所有权限（树形结构）
     */
    public List<Permission> getAllPermissionsTree() {
        List<Permission> allPermissions = permissionMapper.selectList(null);
        return buildPermissionTree(allPermissions);
    }

    /**
     * 根据角色ID获取权限ID列表
     */
    public List<Long> getPermissionIdsByRoleId(Long roleId) {
        return rolePermissionMapper.findPermissionIdsByRoleId(roleId);
    }

    /**
     * 根据角色ID获取权限树（包含选中状态）
     */
    public List<Permission> getPermissionsByRoleId(Long roleId) {
        List<Permission> allPermissions = permissionMapper.selectList(null);
        List<Long> selectedPermissionIds = getPermissionIdsByRoleId(roleId);
        Set<Long> selectedSet = new HashSet<>(selectedPermissionIds);

        // 标记选中状态
        for (Permission permission : allPermissions) {
            permission.setSelected(selectedSet.contains(permission.getId()));
        }

        return buildPermissionTree(allPermissions);
    }

    /**
     * 保存角色权限
     */
    @Transactional
    public void saveRolePermissions(Long roleId, List<Long> permissionIds) {
        // 先删除现有权限关联
        rolePermissionMapper.deleteByRoleId(roleId);

        // 批量插入新的权限关联
        if (permissionIds != null && !permissionIds.isEmpty()) {
            rolePermissionMapper.batchInsert(roleId, permissionIds);
        }
    }

    /**
     * 根据用户ID获取菜单权限树（用于前端菜单）
     */
    public List<Permission> getMenuPermissionsByUserId(Long userId) {
        // 1. 获取用户角色ID列表
        List<Long> roleIds = userRoleMapper.findRoleIdsByUserId(userId);
        if (roleIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. 获取角色对应的权限ID列表（去重）
        Set<Long> permissionIds = new HashSet<>();
        for (Long roleId : roleIds) {
            List<Long> rolePermissionIds = rolePermissionMapper.findPermissionIdsByRoleId(roleId);
            permissionIds.addAll(rolePermissionIds);
        }

        // 3. 查询所有权限，过滤出菜单类型（type=1）且用户有权限的
        List<Permission> allPermissions = permissionMapper.selectList(null);
        List<Permission> userPermissions = allPermissions.stream()
                .filter(p -> permissionIds.contains(p.getId()) && p.getType() != null && p.getType() == 1)
                .collect(Collectors.toList());

        // 4. 构建树形结构
        return buildPermissionTree(userPermissions);
    }

    /**
     * 根据用户ID获取所有权限（包括按钮权限）
     */
    public Set<String> getAllPermissionCodesByUserId(Long userId) {
        // 1. 获取用户角色ID列表
        List<Long> roleIds = userRoleMapper.findRoleIdsByUserId(userId);
        if (roleIds.isEmpty()) {
            return Collections.emptySet();
        }

        // 2. 获取角色对应的权限ID列表（去重）
        Set<Long> permissionIds = new HashSet<>();
        for (Long roleId : roleIds) {
            List<Long> rolePermissionIds = rolePermissionMapper.findPermissionIdsByRoleId(roleId);
            permissionIds.addAll(rolePermissionIds);
        }

        // 3. 查询权限编码
        if (permissionIds.isEmpty()) {
            return Collections.emptySet();
        }

        List<Permission> permissions = permissionMapper.selectList(
                new LambdaQueryWrapper<Permission>()
                        .in(Permission::getId, permissionIds)
        );

        return permissions.stream()
                .map(Permission::getCode)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    /**
     * 构建权限树形结构
     */
    private List<Permission> buildPermissionTree(List<Permission> permissions) {
        // 按parentId分组
        Map<Long, List<Permission>> parentMap = permissions.stream()
                .collect(Collectors.groupingBy(p -> p.getParentId() == null ? 0L : p.getParentId()));

        // 构建树
        List<Permission> rootPermissions = parentMap.getOrDefault(0L, Collections.emptyList());
        for (Permission root : rootPermissions) {
            buildTree(root, parentMap);
        }

        return rootPermissions;
    }

    /**
     * 递归构建子树
     */
    private void buildTree(Permission parent, Map<Long, List<Permission>> parentMap) {
        List<Permission> children = parentMap.get(parent.getId());
        if (children != null && !children.isEmpty()) {
            parent.setChildren(children);
            for (Permission child : children) {
                buildTree(child, parentMap);
            }
        }
    }
}