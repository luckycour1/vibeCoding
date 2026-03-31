package com.vibecoding.userservice.controller;

import com.vibecoding.comm.dto.Result;
import com.vibecoding.userservice.entity.Permission;
import com.vibecoding.userservice.entity.User;
import com.vibecoding.userservice.service.PermissionService;
import com.vibecoding.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/permission")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;
    private final UserService userService;

    /**
     * 获取所有权限树
     */
    @GetMapping("/tree")
    public ResponseEntity<Result<List<Permission>>> getAllPermissionTree() {
        return ResponseEntity.ok(Result.success(permissionService.getAllPermissionsTree()));
    }

    /**
     * 获取角色权限树（包含选中状态）
     */
    @GetMapping("/role/{roleId}")
    public ResponseEntity<Result<List<Permission>>> getPermissionsByRoleId(@PathVariable Long roleId) {
        return ResponseEntity.ok(Result.success(permissionService.getPermissionsByRoleId(roleId)));
    }

    /**
     * 保存角色权限
     */
    @PostMapping("/role/{roleId}")
    public ResponseEntity<Result<Void>> saveRolePermissions(
            @PathVariable Long roleId,
            @RequestBody List<Long> permissionIds) {
        permissionService.saveRolePermissions(roleId, permissionIds);
        return ResponseEntity.ok(Result.success("保存成功", null));
    }

    /**
     * 获取当前用户的菜单权限树（用于前端菜单）
     */
    @GetMapping("/user/menu")
    public ResponseEntity<Result<List<Permission>>> getUserMenuPermissions(HttpServletRequest request) {
        User user = getCurrentUser(request);
        if (user == null) {
            return ResponseEntity.ok(Result.success(null));
        }
        List<Permission> menuPermissions = permissionService.getMenuPermissionsByUserId(user.getId());
        return ResponseEntity.ok(Result.success(menuPermissions));
    }

    /**
     * 获取当前用户的所有权限编码（用于按钮权限）
     */
    @GetMapping("/user/codes")
    public ResponseEntity<Result<Set<String>>> getUserPermissionCodes(HttpServletRequest request) {
        User user = getCurrentUser(request);
        if (user == null) {
            return ResponseEntity.ok(Result.success(null));
        }
        Set<String> permissionCodes = permissionService.getAllPermissionCodesByUserId(user.getId());
        return ResponseEntity.ok(Result.success(permissionCodes));
    }

    /**
     * 从请求头获取当前用户信息
     */
    private User getCurrentUser(HttpServletRequest request) {
        String username = request.getHeader("X-User-Username");
        if (username == null || username.isEmpty()) {
            return null;
        }
        return userService.findByUsername(username);
    }
}