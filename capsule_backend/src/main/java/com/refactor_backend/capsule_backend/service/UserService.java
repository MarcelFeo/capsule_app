package com.refactor_backend.capsule_backend.service;

import com.refactor_backend.capsule_backend.domain.User;
import com.refactor_backend.capsule_backend.dto.UserRequest;
import com.refactor_backend.capsule_backend.dto.UserResponse;
import com.refactor_backend.capsule_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    public final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse registerUser(UserRequest request) {
        if (request.email() != null && userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email address already registered");
        }

        User user = request.toEntity();
        User userSaved = userRepository.save(user);
        return UserResponse.fromEntity(userSaved);
    }

    public UserResponse getUserProfile(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserResponse.fromEntity(user);
    }

    public UserResponse updateUser(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.email() != null && !request.email().equals(user.getEmail()) && userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email address already registered");
        }

        request.toFill(user);
        User newUser = userRepository.save(user);
        return UserResponse.fromEntity(newUser);
    }

    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }


}
