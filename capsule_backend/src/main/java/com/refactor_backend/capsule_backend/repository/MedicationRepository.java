package com.refactor_backend.capsule_backend.repository;

import com.refactor_backend.capsule_backend.domain.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MedicationRepository extends JpaRepository<Medication, UUID> {
}
