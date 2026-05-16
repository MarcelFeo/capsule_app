package com.refactor_backend.capsule_backend.dto;

import com.refactor_backend.capsule_backend.domain.Medication;
import com.refactor_backend.capsule_backend.domain.User;

import java.time.LocalDate;
import java.util.UUID;

public record MedicationResponse(
    UUID id,
    String name,
    User user,
    String instruction,
    String dosage,
    String[] daysWeek,
    boolean active,
    LocalDate start_date,
    LocalDate end_date
) {

    public static MedicationResponse fromEntity(Medication medication) {
        return new MedicationResponse(
            medication.getId(),
            medication.getName(),
            medication.getUser(),
            medication.getInstruction(),
            medication.getDosage(),
            medication.getDaysWeek(),
            medication.isActive(),
            medication.getStartDate(),
            medication.getEndDate()
        );
    }

}
