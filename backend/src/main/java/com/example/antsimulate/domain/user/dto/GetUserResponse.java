package com.example.antsimulate.domain.user.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class GetUserResponse {
    private String email;
    private String name;
    private String nickname;
}
