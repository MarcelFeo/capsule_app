package com.refactor_backend.capsule_backend.service;

import com.refactor_backend.capsule_backend.repository.PatientCaregiverRepository;
import org.springframework.stereotype.Service;

@Service
public class PatientCaregiverService {

    public final PatientCaregiverRepository patientCaregiverRepository;

    public PatientCaregiverService(PatientCaregiverRepository patientCaregiverRepository) {
        this.patientCaregiverRepository = patientCaregiverRepository;
    }



}
