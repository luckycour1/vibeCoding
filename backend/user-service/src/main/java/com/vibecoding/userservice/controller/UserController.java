package com.vibecoding.userservice.controller;

import com.vibecoding.comm.controller.BaseController;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.userservice.dto.UserDto;
import com.vibecoding.userservice.dto.UserQueryDto;
import com.vibecoding.userservice.entity.User;
import com.vibecoding.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController extends BaseController<UserDto, User, UserService, UserQueryDto> {

    public UserController(UserService service) {
        super(service);
    }
}