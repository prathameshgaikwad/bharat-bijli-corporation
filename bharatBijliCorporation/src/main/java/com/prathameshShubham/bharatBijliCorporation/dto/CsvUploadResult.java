package com.prathameshShubham.bharatBijliCorporation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CsvUploadResult {
    private int successCount;
    private int failureCount;
    private List<String> errorMessages;
}
