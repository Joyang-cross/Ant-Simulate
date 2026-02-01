package com.example.antsimulate.kiwoom.runner;

import com.example.antsimulate.kiwoom.client.KiwoomWsClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class KiwoomWsStartController {
    private final KiwoomWsClient kiwoomWsClient;

    @GetMapping("/debug/kiwoom-ws/connect")
    public String connect(){
        log.info("[BOOT] start Kiwoom WebSocket");
        kiwoomWsClient.connect();
        return "start";
    }
}
