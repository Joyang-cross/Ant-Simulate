package com.example.antsimulate.kiwoom.client;

import com.example.antsimulate.kiwoom.dto.KiwoomTokenRequest;
import com.example.antsimulate.kiwoom.dto.KiwoomTokenResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
public class KiwoomAuthClient {
    @Value("${kiwoom.base-url}")
    private String baseUrl;

    @Value("${kiwoom.appkey}")
    private String appkey;

    @Value("${kiwoom.secretkey}")
    private String secretkey;

    /**
     * 키움 REST API로 access token 발급 요청
     */
    public KiwoomTokenResponse issueAccessToken() {
        RestClient restClient = RestClient.builder().baseUrl(baseUrl).build();

        KiwoomTokenRequest request = KiwoomTokenRequest.builder()
                .grantType("client_credentials")
                .appkey(appkey)
                .secretkey(secretkey)
                .build();

        log.info("[KIWOOM_AUTH] issue token request");

        return restClient.post()
                .uri("/oauth2/token")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .onStatus(status -> status.isError(), (req, res) -> {
                    log.error("[KIWOOM-AUTH] status={}", res.getStatusCode());
                })
                .body(KiwoomTokenResponse.class);
    }
}
