package com.example.antsimulate.kiwoom.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KiwoomTokenResponse {

    /** 처리 결과 코드를 담는다 */
    @JsonProperty("return_code")
    private Integer returnCode;

    /** 처리 결과 메시지를 담는다 */
    @JsonProperty("return_msg")
    private String returnMsg;

    @JsonProperty("token")
    private String token;

    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("expires_dt")
    private String expiresDt;
}
