package com.vibecoding.userservice.controller;

import com.vibecoding.comm.dto.Result;
import com.vibecoding.userservice.dto.LoginRequest;
import com.vibecoding.userservice.dto.LoginResponse;
import com.vibecoding.userservice.entity.User;
import com.vibecoding.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Result<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/list")
    public ResponseEntity<Result<List<User>>> list() {
        return ResponseEntity.ok(Result.success(userService.findAll()));
    }

    @PostMapping("/add")
    public ResponseEntity<Result<User>> add(@RequestBody User user) {
        return ResponseEntity.ok(Result.success(userService.save(user)));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Result<User>> update(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(Result.success(userService.update(id, user)));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Result<Void>> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(Result.success("删除成功", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Result<User>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(Result.success(userService.findById(id)));
    }
}
