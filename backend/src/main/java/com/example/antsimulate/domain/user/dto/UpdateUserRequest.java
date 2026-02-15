package com.example.antsimulate.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateUserRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String nickname;
}
