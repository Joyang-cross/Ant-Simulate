package com.example.antsimulate.domain.backtest.service;

import com.example.antsimulate.domain.backtest.dto.BacktestRequest;
import com.example.antsimulate.domain.backtest.dto.BacktestResponse;
import com.example.antsimulate.global.exception.BusinessException;
import com.example.antsimulate.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class BacktestService {

    private final RestClient restClient;

    public BacktestResponse executeBacktest(BacktestRequest request) {
        log.info("execute backtest : {}", request.ticker());

        return restClient.post()
                .uri("/backtest")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    log.error("FastAPI Error: {} {}", res.getStatusCode(), res.getStatusText());
                    throw new BusinessException(ErrorCode.BACKTEST_API_ERROR);
                })
                .body(BacktestResponse.class);
    }

}
