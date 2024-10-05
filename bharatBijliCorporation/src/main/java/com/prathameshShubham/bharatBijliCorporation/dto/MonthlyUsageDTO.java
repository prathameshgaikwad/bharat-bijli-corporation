package com.prathameshShubham.bharatBijliCorporation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MonthlyUsageDTO {
    private String month;
    private int year;
    private Double unitsConsumed;

}
