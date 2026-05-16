package com.refactor_backend.capsule_backend.service;

import com.refactor_backend.capsule_backend.domain.Medication;
import com.refactor_backend.capsule_backend.domain.User;
import com.refactor_backend.capsule_backend.dto.MedicationRequest;
import com.refactor_backend.capsule_backend.dto.MedicationResponse;
import com.refactor_backend.capsule_backend.repository.MedicationRepository;
import com.refactor_backend.capsule_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MedicationService {

    public final MedicationRepository medicationRepository;
    public final UserRepository userRepository;

    public MedicationService(UserRepository userRepository, MedicationRepository medicationRepository) {
        this.userRepository = userRepository;
        this.medicationRepository = medicationRepository;
    }

    public MedicationResponse registerMedication(MedicationRequest request) {

        if (medicationRepository.existsByUserAndName(request.user(), request.name())) {
            throw new RuntimeException("User already has a medication with that name");
        }

        Medication medication = request.toEntity();
        Medication medicationSaved = medicationRepository.save(medication);
        return MedicationResponse.fromEntity(medicationSaved);
    }

    public List<Medication> getMedicationsByUser(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        return medicationRepository.findAllByUserOrderByStartDateDesc(user);
    }

    public MedicationResponse updateMedication(UUID medicationId, MedicationRequest request) {

        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medication not found"));

        if (medicationRepository.existsByUserAndName(request.user(), request.name())) {
            throw new RuntimeException("User already has a medication with that name");
        }

        request.toFill(medication);
        Medication newMedication = medicationRepository.save(medication);
        return MedicationResponse.fromEntity(newMedication);
    }

    public void deleteMedication(UUID medicationId) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medication not found"));

        medicationRepository.delete(medication);
    }

}
