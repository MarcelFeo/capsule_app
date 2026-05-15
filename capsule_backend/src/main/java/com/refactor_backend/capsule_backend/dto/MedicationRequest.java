package com.refactor_backend.capsule_backend.dto;

import com.refactor_backend.capsule_backend.domain.Medication;
import com.refactor_backend.capsule_backend.domain.User;

import java.time.LocalDate;

public record MedicationRequest(
    String name,
    User user,
    String instruction,
    String dosage,
    String[] daysWeek,
    LocalDate start_date
) {

    public Medication toEntity() {
        Medication medication = new Medication();
        toFill(medication);
        return medication;
    }

    public void toFill(Medication medication) {
        medication.setName(name);
        medication.setUser(user);
        medication.setInstruction(instruction);
        medication.setDosage(dosage);
        medication.setDaysWeek(daysWeek);
        medication.setStart_date(start_date);
    }

}
