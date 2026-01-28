package com.example.antsimulate.domain.stock.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class GetStockPriceDailyResponse {
    private Long stockPriceDailyId;
    private String stockName;
    private LocalDate tradeDate;
    private BigDecimal openPrice;
    private BigDecimal highPrice;
    private BigDecimal lowPrice;
    private BigDecimal closePrice;
    private Long volume;
}
