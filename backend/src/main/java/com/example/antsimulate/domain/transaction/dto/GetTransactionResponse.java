package com.example.antsimulate.domain.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@AllArgsConstructor
public class GetTransactionResponse {
    private String stockSymbol;
    private String stockName;
    private String transactionType;
    private int price;
    private int quantity;
    private OffsetDateTime createdAt;
}
