package com.vibecoding.userservice.controller;

import com.vibecoding.comm.controller.BaseController;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.userservice.dto.RoleDto;
import com.vibecoding.userservice.dto.RoleQueryDto;
import com.vibecoding.userservice.entity.Role;
import com.vibecoding.userservice.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/role")
@Slf4j
public class RoleController extends BaseController<RoleDto, Role, RoleService, RoleQueryDto> {

    public RoleController(RoleService service) {
        super(service);
    }

    @Operation(description = "获取用户总数")
    @GetMapping("/stats/user-count")
    public ResponseEntity<Result<Long>> getUserCount() {
        long count = service.getUserCount();
        return ResponseEntity.ok(Result.success(count));
    }

    @Operation(description = "查询所有角色（包含用户数量统计）")
    @GetMapping("/list")
    public ResponseEntity<Result<List<Role>>> list() {
        List<Role> roles = service.findAll();
        return ResponseEntity.ok(Result.success(roles));
    }
}