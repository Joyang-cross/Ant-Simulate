package com.example.antsimulate.domain.account.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetAccountResponse {
    private Long accountId;
    private long startAsset;
    private long totalAsset;
}
