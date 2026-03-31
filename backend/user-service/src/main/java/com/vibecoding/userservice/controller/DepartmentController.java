package com.vibecoding.userservice.controller;

import com.vibecoding.comm.controller.BaseController;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.userservice.dto.DepartmentDto;
import com.vibecoding.userservice.dto.DepartmentQueryDto;
import com.vibecoding.userservice.entity.Department;
import com.vibecoding.userservice.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/department")
@Slf4j
public class DepartmentController extends BaseController<DepartmentDto, Department, DepartmentService, DepartmentQueryDto> {

    public DepartmentController(DepartmentService service) {
        super(service);
    }

    @Operation(description = "获取启用的部门列表")
    @GetMapping("/enabled")
    public ResponseEntity<Result<List<Department>>> enabled() {
        List<Department> enabledDepartments = service.findEnabled();
        return ResponseEntity.ok(Result.success(enabledDepartments));
    }

    @Operation(description = "获取所有部门的员工总数")
    @GetMapping("/stats/employee-count")
    public ResponseEntity<Result<Long>> getEmployeeCount() {
        long count = service.getEmployeeCount();
        return ResponseEntity.ok(Result.success(count));
    }
}