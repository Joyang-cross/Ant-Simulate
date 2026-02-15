package com.example.antsimulate.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetUserResponse {
    private String email;
    private String name;
    private String nickname;
}
