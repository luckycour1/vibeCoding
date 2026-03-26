package com.vibecoding.comm.common;

/**
 * 自定义业务异常
 */
public class BusinessException extends RuntimeException {
    
    private int code = 400;
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
    
    public int getCode() {
        return code;
    }
    
    public void setCode(int code) {
        this.code = code;
    }
}
