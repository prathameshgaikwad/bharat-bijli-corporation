package com.prathameshShubham.bharatBijliCorporation.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private Boolean error;
    private String message;
    private T data;
    private int status;


    public ApiResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public static <T> ApiResponse<T> success(T data, String message, int status) {
        return new ApiResponse<>(false, message, data, status);
    }

    public static <T> ApiResponse<T> error(String message, int status) {
        return new ApiResponse<>(true, message, null, status);
    }
}