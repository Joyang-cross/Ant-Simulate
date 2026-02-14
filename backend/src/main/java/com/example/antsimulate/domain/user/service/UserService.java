package com.example.antsimulate.domain.user.service;

import com.example.antsimulate.domain.user.dto.GetUserResponse;
import com.example.antsimulate.domain.user.entity.User;
import com.example.antsimulate.domain.user.repository.UserRepository;
import com.example.antsimulate.global.exception.BusinessException;
import com.example.antsimulate.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     *  유저 정보 조회
     **/
    public GetUserResponse getUser(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return new GetUserResponse(user.getEmail(), user.getName(), user.getNickname());
    }

    /**
     *  비밀번호 변경
     **/
    @Transactional
    public void changePassword(Long userId, String currentPassword, String changePassword){
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if(!passwordEncoder.matches(currentPassword, user.getPassword())){
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        if(passwordEncoder.matches(changePassword, user.getPassword())){
            throw new BusinessException(ErrorCode.PASSWORD_NOT_CHANGE);
        }
        String encodedPassword = passwordEncoder.encode(changePassword);

        user.setPassword(encodedPassword);
    }
}
