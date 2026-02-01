package com.example.antsimulate.kiwoom.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KiwoomTokenRequest {

    @JsonProperty("grant_type")
    private String grantType;

    private String appkey;

    private String secretkey;
}
