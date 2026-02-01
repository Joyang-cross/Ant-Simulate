package com.example.antsimulate.kiwoom.client;

import com.example.antsimulate.kiwoom.dto.KiwoomQuoteDto;
import com.example.antsimulate.kiwoom.message.KiwoomWsMessageParser;
import com.example.antsimulate.kiwoom.service.KiwoomTokenService;
import com.example.antsimulate.kiwoom.service.QuoteBroadcastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

@Slf4j
@Component
@RequiredArgsConstructor
public class KiwoomWsClient implements WebSocket.Listener{
    // TODO: 키움 REST API 실제 엔드포인트로 교체
    private static final URI WS_URI =
            URI.create("wss://api.kiwoom.com:10000/api/dostk/websocket");

    // java 표준 WebSocket 클라이언트 생성용
    private final HttpClient httpClient = HttpClient.newHttpClient();

    // 키움 access token 관리 서비스
    private final KiwoomTokenService kiwoomTokenService;

    // 현재 연결된 WebSocket 인스턴스
    private WebSocket webSocket;

    // 키움 원본 메시지를 DTO로 변환
    private final KiwoomWsMessageParser kiwoomWsMessageParser;

    // 변환된 DTO를 STOMP로 브로드캐스트
    private final QuoteBroadcastService quoteBroadcastService;

    // 토큰 인증 성공 여부
    private boolean authenticated = false;

    /**
     *  키움 WebSocket 서버에 연결을 시작하는 메서드
     *  - 서버가 기동될 때 1회 호출
     *  - 실제 실시간 통신의 시작점
     */
    public void connect(){
        log.info("[KIWOOM-WS] connecting...");
        httpClient.newWebSocketBuilder()
                .buildAsync(WS_URI, this)
                .thenAccept(ws ->{
                    this.webSocket = ws;
                    log.info("[KIWOOM-WS] connected");
                });
    }

    /**
     * 키움 WebSocket 서버로 텍스트 메시지를 전송하는 메서드
     * - 이후 REG / REMOVE 같은 구독 메시지를 보내는 용도로 사용
     */
    public void send(String text){
        if(webSocket == null){
            log.warn("[KIWOOM-WS] send failed - not connected");
            return;
        }
        webSocket.sendText(text, true);
    }

    /**
     * WebSocket 연결이 성공적으로 수립되었을 때 자동으로 호출
     * - 이후 메시지를 계속 수신하기 위해 request(1)을 반드시 호출해야 함
     */
    @Override
    public void onOpen(WebSocket webSocket){
        log.info("[KIWOOM-WS] on open");

        this.webSocket = webSocket;

        String token = kiwoomTokenService.getAccessToken();
        sendTokenMessage(token);

        webSocket.request(1);
    }

    /**
     * 키움 서버로부터 텍스트 메시지를 수신했을 때 호출
     * - 실시간 시세 데이터가 이 메서드로 들어옴
     */
    @Override
    public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last){
        log.debug("[KIWOOM-WS] recv={}", data);
        String raw = data.toString();

        if(isPing(raw)){
            echoPong(webSocket, raw);
            webSocket.request(1);
            return CompletableFuture.completedFuture(null);
        }

        if(!authenticated && isLoginSuccess(raw)){
            authenticated = true;
            log.info("[KIWOOM-WS] token authenticated");
            webSocket.request(1);
            return CompletableFuture.completedFuture(null);
        } else if (authenticated){
            KiwoomQuoteDto dto = kiwoomWsMessageParser.parse(raw);
            if(dto != null){
                quoteBroadcastService.broadcast(dto);
            }
        }

        webSocket.request(1);
        return CompletableFuture.completedFuture(null);
    }

    /**
     * WebSocket 통신 중 오류가 발생했을 때 호출
     * - 네트워크 오류, 서버 오류 등
     */
    @Override
    public void onError(WebSocket webSocket, Throwable error){
        log.error("[KIWOOM-WS] error", error);
    }

    /**
     * WebSocket 연결이 종료되었을때 호출
     * - 서버 종료, 네으퉈크 끊김, 정상종료 모두 포함
     */
    @Override
    public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason){
        log.warn("[KIWOOM-WS] closed {} {}", statusCode, reason);
        return CompletableFuture.completedFuture(null);
    }

    private void sendTokenMessage(String token){
        String payload = """
                {
                    "trnm" : "LOGIN",
                    "token" : "%s"
                }
                """.formatted(token);
        webSocket.sendText(payload, true);
        log.info("[KIWOOM-WS] token message sent");
    }

    private boolean isLoginSuccess(String message){
        return message.contains("\"trnm\":\"LOGIN\"") && message.contains("\"return_code\":0");
    }

    /**
     * 연결 시 메시지 PING 확인
     */
    private boolean isPing(String message){
        return message.contains("\"trnm\":\"PING\"");
    }

    /**
     * 연결유지 메시지 전송
     */
    private void echoPong(WebSocket webSocket, String pingMessage){
        webSocket.sendText(pingMessage, true);
        log.debug("[KIWOOM-WS] ping echoed");
    }
}