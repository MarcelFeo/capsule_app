package com.refactor_backend.capsule_backend.dto;

import com.refactor_backend.capsule_backend.domain.User;
import com.refactor_backend.capsule_backend.domain.enums.UserRole;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record UserRequest(
    String name,
    String email,
    String password,
    UserRole role,
    LocalDate birthdate,
    String gender
) {

    public User toEntity() {
        User user = new User();
        toFill(user);
        return user;
    }

    public void toFill(User user) {
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setBirthdate(birthdate);
        user.setGender(gender);
    }

}
