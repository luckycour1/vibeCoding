package com.vibecoding.comm.dto;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.Data;

/**
 * 分页查询请求基类
 */
@Data
public abstract class SearchPagedDto {

    private Integer pageIndex = 1;
    private Integer pageSize = 10;

    /**
     * 转换为MyBatis Plus分页对象
     */
    public <T> Page<T> toMybatisPage() {
        return new Page<>(pageIndex, pageSize);
    }

    /**
     * 构建查询条件包装器，子类需根据具体查询条件实现
     */
    public abstract <T> LambdaQueryWrapper<T> buildWrapper();
}