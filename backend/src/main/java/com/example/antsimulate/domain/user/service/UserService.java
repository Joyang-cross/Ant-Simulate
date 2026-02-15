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
     *  유저 정보 수정
     **/
    @Transactional
    public void updateUser(Long userId, String name, String nickname){
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.updateProfile(name, nickname);
    }

    /**
     *  비밀번호 변경
     **/
    @Transactional
    public void updatePassword(Long userId, String currentPassword, String changePassword){
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 비밀번호 확인
        if(!passwordEncoder.matches(currentPassword, user.getPassword())){
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        // 변경 전 비밀번호 와 같은지 확인
        if(passwordEncoder.matches(changePassword, user.getPassword())){
            throw new BusinessException(ErrorCode.PASSWORD_NOT_CHANGE);
        }
        String encodedPassword = passwordEncoder.encode(changePassword);

        user.updatePassword(encodedPassword);
    }

    /**
     *  계정 탈퇴
     **/
    @Transactional
    public void deleteUser(Long userId, String password){
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 비밀번호 확인
        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        userRepository.delete(user);
    }
}
