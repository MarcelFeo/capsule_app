package com.refactor_backend.capsule_backend.repository;

import com.refactor_backend.capsule_backend.domain.PatientCaregiver;
import com.refactor_backend.capsule_backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientCaregiverRepository extends JpaRepository<PatientCaregiver, UUID> {

    boolean existsByPatientIdAndCaregiverId(User patient_id, User caregiver_id);

}
