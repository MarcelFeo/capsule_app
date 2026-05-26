package com.refactor_backend.capsule_backend.dto;

import com.refactor_backend.capsule_backend.domain.PatientCaregiver;
import com.refactor_backend.capsule_backend.domain.User;

import java.util.UUID;

public record PatientCaregiverResponse(
    UUID id,
    User patient,
    User caregiver
) {

    public static PatientCaregiverResponse fromEntity(UUID id, User patient, User caregiver) {
        return new PatientCaregiverResponse(
            id,
            patient,
            caregiver
        );
    }

    public static PatientCaregiverResponse fromEntity(PatientCaregiver savedPatientCaregiver) {
        return fromEntity(
            savedPatientCaregiver.getId(),
            savedPatientCaregiver.getPatient(),
            savedPatientCaregiver.getCaregiver()
        );
    }
}
