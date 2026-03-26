package com.vibecoding.comm.dto;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;

/**
 * 分页数据
 */
@Data
public class PageDto {
    private int rowsCount;
    private int pageIndex;
    private int pageSize;
    private int totalCount;
    private int pageCount;

    public static PageDto from(IPage<?> page) {
        PageDto dto = new PageDto();
        dto.setRowsCount(page.getRecords().size());
        dto.setPageIndex((int) page.getCurrent());
        dto.setPageSize((int) page.getSize());
        dto.setPageCount((int) page.getPages());
        dto.setTotalCount((int) page.getTotal());
        return dto;
    }

    public static PageDto from(IPage<?> page, long total) {
        PageDto dto = new PageDto();
        dto.setRowsCount(page.getRecords().size());
        dto.setPageIndex((int) page.getCurrent());
        dto.setPageSize((int) page.getSize());
        dto.setPageCount((int) page.getPages());
        dto.setTotalCount((int) total);
        return dto;
    }
}
