package com.refactor_backend.capsule_backend.repository;

import com.refactor_backend.capsule_backend.domain.Medication;
import com.refactor_backend.capsule_backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MedicationRepository extends JpaRepository<Medication, UUID> {

    boolean existsByUserAndName(User user, String name);

    List<Medication> findAllByUserOrderByStartDateDesc(User user);

}
