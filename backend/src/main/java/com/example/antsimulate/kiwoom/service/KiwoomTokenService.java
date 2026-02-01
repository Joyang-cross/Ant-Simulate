package com.example.antsimulate.kiwoom.service;

import com.example.antsimulate.kiwoom.client.KiwoomAuthClient;
import com.example.antsimulate.kiwoom.dto.KiwoomTokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class KiwoomTokenService {
    private final KiwoomAuthClient kiwoomAuthClient;
    private String accessToken;
    private Instant expiresAt;

    public String getAccessToken(){
        if(isExpired()) issueNewToken();
        return accessToken;
    }

    private boolean isExpired(){
        if(accessToken == null || expiresAt == null){
            return true;
        }
        return Instant.now().isAfter(expiresAt);
    }

    private void issueNewToken(){
        log.info("[KIWOOM-AUTH] issue new access token");

        KiwoomTokenResponse response = kiwoomAuthClient.issueAccessToken();
        log.info("[KIWOOM-RESPONSE] response code={} msg={}", response.getReturnCode(), response.getReturnMsg());
        if (response == null || response.getToken() == null){
            throw new IllegalStateException("키움 access token 발급 실패");
        }

        this.accessToken = response.getToken();
        this.expiresAt = parseExpiresDt(response.getExpiresDt());

        log.info("[KIWOOM-AUTH] token issued (expiresAt={})", expiresAt);
    }

    private Instant parseExpiresDt(String expiresDt){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime localDateTime = LocalDateTime.parse(expiresDt, formatter);
        return localDateTime.atZone(ZoneId.of("Asia/Seoul")).toInstant();
    }
}
