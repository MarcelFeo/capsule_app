package com.refactor_backend.capsule_backend.service;

import com.refactor_backend.capsule_backend.dto.PatientCaregiverRequest;
import com.refactor_backend.capsule_backend.dto.PatientCaregiverResponse;
import com.refactor_backend.capsule_backend.repository.PatientCaregiverRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PatientCaregiverService {

    public final PatientCaregiverRepository patientCaregiverRepository;

    public PatientCaregiverService(PatientCaregiverRepository patientCaregiverRepository) {
        this.patientCaregiverRepository = patientCaregiverRepository;
    }

    public PatientCaregiverResponse registerPatientCaregiver(PatientCaregiverRequest request) {
        if (request.patient() != null && request.caregiver() != null && patientCaregiverRepository.existsByPatientIdAndCaregiverId(request.patient(), request.caregiver())) {
            throw new RuntimeException("Patient-Caregiver relationship already exists");
        }

        var patientCaregiver = request.toEntity();
        var savedPatientCaregiver = patientCaregiverRepository.save(patientCaregiver);
        return PatientCaregiverResponse.fromEntity(savedPatientCaregiver);
    }

    public void deletePatientCaregiver(UUID id) {
        var patientCaregiver = patientCaregiverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient-Caregiver relationship not found"));
        patientCaregiverRepository.delete(patientCaregiver);
    }

}
