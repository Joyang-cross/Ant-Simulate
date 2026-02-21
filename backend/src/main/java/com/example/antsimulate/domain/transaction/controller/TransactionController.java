package com.example.antsimulate.domain.transaction.controller;

import com.example.antsimulate.domain.transaction.dto.CreateTransactionRequest;
import com.example.antsimulate.domain.transaction.dto.GetTransactionResponse;
import com.example.antsimulate.domain.transaction.entity.TransactionType;
import com.example.antsimulate.domain.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<GetTransactionResponse>> getTransactionList(@PathVariable Long userId){
        List<GetTransactionResponse> transactionResponseList = transactionService.getTransactionList(userId);
        return ResponseEntity.ok(transactionResponseList);
    }

    @PostMapping("/{userId}/{stockItemId}")
    public ResponseEntity<Void> createTransaction(@PathVariable Long userId,
                                              @PathVariable Long stockItemId,
                                              @RequestBody CreateTransactionRequest request){
        transactionService.createTransaction(userId, stockItemId, request.getTransactionType(), request.getQuantity());
        return ResponseEntity.noContent().build();
    }
}
