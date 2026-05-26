package com.refactor_backend.capsule_backend.dto;
import com.refactor_backend.capsule_backend.domain.PatientCaregiver;
import com.refactor_backend.capsule_backend.domain.User;

public record PatientCaregiverRequest(
    User patient,
    User caregiver
) {

    public PatientCaregiver toEntity() {
        PatientCaregiver patientCaregiver = new PatientCaregiver();
        toFill(patientCaregiver);
        return patientCaregiver;
    }

    public void toFill(PatientCaregiver patientCaregiver) {
        patientCaregiver.setPatient(patient);
        patientCaregiver.setCaregiver(caregiver);
    }

}
