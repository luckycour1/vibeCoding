package com.vibecoding.userservice.dto;

import lombok.Data;

@Data
public class DepartmentDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Integer status;
    private String createdAt;
}