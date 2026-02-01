package com.example.antsimulate.kiwoom.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class KiwoomWsMessageFactory {
    private final ObjectMapper objectmapper = new ObjectMapper();

    public String buildReg(String symbol){
        Map<String, Object> message = Map.of(
                "trnm", "REG",
                "grp_no", "1",
                "refresh", "1",
                "data", List.of(
                        Map.of(
                                "item", List.of(symbol),
                                "type", List.of("0B")
                        )
                )
        );

        return toJson(message);
    }

    public String buildRemove(String symbol){
        Map<String, Object> message = Map.of(
                "trnm", "REMOVE",
                "grp_no", "1",
                "data", List.of(
                        Map.of(
                                "item", List.of(symbol),
                                "type", List.of("0B")
                        )
                )
        );

        return toJson(message);
    }

    private String toJson(Map<String, Object> message) {
        try{
            String json = objectmapper.writeValueAsString(message);
            log.debug("Kiwoom WS message created: {}", json);
            return json;
        } catch (JsonProcessingException e){
            log.error("Failed to serialize Kiwoom WS message", e);
            throw new IllegalStateException("Kiwoom WS message serialization failed");
        }
    }
}
