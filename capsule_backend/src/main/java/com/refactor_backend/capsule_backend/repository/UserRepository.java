package com.refactor_backend.capsule_backend.repository;

import com.refactor_backend.capsule_backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
