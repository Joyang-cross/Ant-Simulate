package com.example.antsimulate.domain.user.controller;

import com.example.antsimulate.domain.user.dto.ChangePasswordRequest;
import com.example.antsimulate.domain.user.dto.DeleteUserRequest;
import com.example.antsimulate.domain.user.dto.GetUserResponse;
import com.example.antsimulate.domain.user.dto.UpdateUserRequest;
import com.example.antsimulate.domain.user.service.UserService;
import jakarta.validation.Valid;
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

    @PutMapping("/{userId}")
     public ResponseEntity<Void> updateUser(@PathVariable Long userId,
                                            @Valid @RequestBody UpdateUserRequest request){
        userService.updateUser(userId, request.getName(), request.getNickname());
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PatchMapping("/{userId}/password")
    public ResponseEntity<Void> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordRequest request){
        userService.updatePassword(userId, request.getCurrentPassword(), request.getChangePassword());
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId, @RequestBody DeleteUserRequest request){
        userService.deleteUser(userId, request.getPassword());
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
