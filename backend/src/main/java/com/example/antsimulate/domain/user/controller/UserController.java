package com.example.antsimulate.domain.user.controller;

import com.example.antsimulate.domain.user.dto.ChangePasswordRequest;
import com.example.antsimulate.domain.user.dto.GetUserResponse;
import com.example.antsimulate.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<GetUserResponse> getUser(@PathVariable Long userId){
        GetUserResponse response = userService.getUser(userId);
        return ResponseEntity.ok(response); // 200 OK
    }

    @PatchMapping("/{userId}/password")
    public ResponseEntity<Void> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordRequest request){
        userService.changePassword(userId, request.getCurrentPassword(), request.getChangePassword());
        return ResponseEntity.noContent().build();
    }
}
