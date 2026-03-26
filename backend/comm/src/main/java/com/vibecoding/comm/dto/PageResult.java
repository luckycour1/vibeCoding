package com.vibecoding.comm.dto;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;

import java.util.List;

/**
 * 分页响应
 */
@Data
public class PageResult<T> extends Result<List<T>> {
    private PageDto pageInfo;

    public static <T> PageResult<T> ok(IPage<T> page) {
        PageResult<T> result = new PageResult<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(page.getRecords());
        result.setPageInfo(PageDto.from(page));
        return result;
    }

    public static <T> PageResult<T> ok(List<T> data, PageDto pageInfo) {
        PageResult<T> result = new PageResult<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        result.setPageInfo(pageInfo);
        return result;
    }

    public static <T> PageResult<T> errorPage(String message) {
        PageResult<T> result = new PageResult<>();
        result.setCode(500);
        result.setMessage(message);
        result.setData(null);
        return result;
    }

    public static <T> PageResult<T> errorPage(int code, String message) {
        PageResult<T> result = new PageResult<>();
        result.setCode(code);
        result.setMessage(message);
        result.setData(null);
        return result;
    }
}
