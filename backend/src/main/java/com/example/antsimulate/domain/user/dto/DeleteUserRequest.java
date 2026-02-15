package com.example.antsimulate.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DeleteUserRequest {
    private String password;
}
