package com.vibecoding.comm.controller;

import com.vibecoding.comm.dto.PageResult;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.comm.dto.SearchPagedDto;
import com.vibecoding.comm.entity.BaseEntity;
import com.vibecoding.comm.service.BaseEntityService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 通用的CRUD控制器基类
 * @param <M> DTO类型，用于创建和更新
 * @param <T> 实体类型，需继承BaseEntity
 * @param <S> 服务类型，需继承BaseEntityService<T, M>
 * @param <C> 分页查询条件类型，需继承SearchPagedDto
 */
@AllArgsConstructor
public class BaseController<M, T extends BaseEntity, S extends BaseEntityService<T, M>, C extends SearchPagedDto> {
    protected final S service;

    @Operation(description = "根据id, 查询对应的记录")
    @GetMapping("find")
    public Result<T> find(@RequestParam long id) {
        return service.find(id);
    }

    @Operation(description = "分页查询")
    @PostMapping("/page")
    public PageResult<T> page(@Valid @RequestBody C dto) {
        return service.pageQuery(dto);
    }

    @Operation(description = "分页查询Dto")
    @PostMapping("/pageForDto")
    public <D> PageResult<D> pageForDto(@RequestBody C dto) {
        return service.pageForDto(dto);
    }

    @Operation(description = "创建记录")
    @PostMapping("/create")
    public Result<T> create(@Valid @RequestBody M dto) {
        return service.create(dto);
    }

    @Operation(description = "根据id，对应更新记录")
    @PutMapping("/update")
    public Result<T> update(@RequestParam long id, @Valid @RequestBody M dto) {
        return service.update(id, dto);
    }

    @Operation(description = "根据id删除对应的记录")
    @DeleteMapping("/delete")
    public Result<Long> delete(@RequestParam long id) {
        return service.delete(id);
    }

    @Operation(description = "查询所有记录")
    @GetMapping("/query")
    public Result<List<T>> queryAll() {
        return service.queryAll();
    }
}