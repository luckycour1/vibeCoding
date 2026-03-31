package com.vibecoding.comm.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vibecoding.comm.dto.PageResult;
import com.vibecoding.comm.dto.Result;
import com.vibecoding.comm.dto.SearchPagedDto;
import com.vibecoding.comm.entity.BaseEntity;
import com.vibecoding.comm.util.JsonUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * 通用的CRUD服务基类
 * @param <T> 实体类型，需继承BaseEntity
 * @param <M> DTO类型，用于创建和更新
 */
@Slf4j
@AllArgsConstructor
public abstract class BaseEntityService<T extends BaseEntity, M> {

    protected final BaseMapper<T> baseMapper;
    protected final String entityName;

    public Result<T> find(long id) {
        return Result.ok(baseMapper.selectById(id));
    }

    public Result<T> create(M dto) {
        Result<String> validateResult = dbValidate(null, dto, null);
        if (!validateResult.isSuccess()) {
            return Result.badRequest(validateResult.getMsg());
        }

        T record = syncProperties(build(), dto);
        baseMapper.insert(record);
        log.info("Inserted {} - {}", entityName, JsonUtil.toJsonStr(record));
        return Result.ok(record);
    }

    public Result<T> update(long id, M dto) {
        T part = baseMapper.selectById(id);
        if (part == null) return Result.badRequest("请求Id不存在 - " + id);

        Result<String> validateResult = dbValidate(id, dto, part);
        if (!validateResult.isSuccess()) {
            return Result.badRequest(validateResult.getMsg());
        }

        baseMapper.updateById(syncProperties(part, dto));
        log.info("Update {} - Id: {}, latest: {}", entityName, id, JsonUtil.toJsonStr(part));
        return Result.ok(part);
    }

    protected Result<String> dbValidate(Long id, M dto, T part) {
        // 子类可重写此方法，进行更新前的db数据校验
        return Result.ok(null);
    }

    public <C extends SearchPagedDto> PageResult<T> pageQuery(C condition) {
        Page<T> page = condition.toMybatisPage();
        baseMapper.selectPage(page, condition.buildWrapper());
        return PageResult.From(page);
    }

    /**
     * 分页查询，支持将查询结果转换为Dto对象列表，默认不进行转换；
     * 直接返回实体列表。子类可重写mapper方法，实现实体到Dto的转换逻辑。
     *
     * @param condition 分页查询条件
     * @return 分页结果，包含Dto对象列表
     */
    @SuppressWarnings("unchecked")
    public <C extends SearchPagedDto, D> PageResult<D> pageForDto(C condition) {
        Page<T> entityPage = condition.toMybatisPage();
        baseMapper.selectPage(entityPage, condition.buildWrapper());
        List<D> dtoRecords = mapper(entityPage.getRecords(), condition);
        Page<D> dtoPage = (Page<D>) entityPage;
        dtoPage.setRecords(dtoRecords);
        return PageResult.From(dtoPage);
    }

    @SuppressWarnings("unchecked")
    public <C extends SearchPagedDto, D> List<D> mapper(List<T> records, C condition) {
        // 默认不进行转换，直接返回实体
        return (List<D>) records;
    }

    public Result<Long> delete(long id) {
        int affectRows = baseMapper.deleteById(id);
        boolean isOk = affectRows > 0;
        log.info("Done delete {} - id: {} - isOk: {}", entityName, id, isOk);
        return isOk ? Result.ok(id) : Result.badRequest("记录不存在 - " + id);
    }

    public Result<List<T>> queryAll() {
        return Result.ok(baseMapper.selectList(new LambdaQueryWrapper<>()));
    }

    /**
     * 同步DTO属性到实体
     * @param entity 实体对象
     * @param dto DTO对象
     * @return 更新后的实体
     */
    protected abstract T syncProperties(T entity, M dto);

    /**
     * 构建新的实体实例
     */
    protected abstract T build();
}