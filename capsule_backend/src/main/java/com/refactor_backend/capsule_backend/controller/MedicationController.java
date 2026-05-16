package com.refactor_backend.capsule_backend.controller;

import com.refactor_backend.capsule_backend.dto.MedicationRequest;
import com.refactor_backend.capsule_backend.dto.MedicationResponse;
import com.refactor_backend.capsule_backend.service.MedicationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicationResponse registerMedication(@RequestBody MedicationRequest medicationRequest) {
        return medicationService.registerMedication(medicationRequest);
    }

    @GetMapping("/{userId}")
    public List<MedicationResponse> getMedicationsByUser(@PathVariable UUID userId) {
        return medicationService.getMedicationsByUser(userId).stream()
                .map(MedicationResponse::fromEntity)
                .toList();
    }

    @PutMapping("/{medicationId}")
    public MedicationResponse updateMedication(@PathVariable UUID medicationId, @RequestBody MedicationRequest medicationRequest) {
        return medicationService.updateMedication(medicationId, medicationRequest);
    }

    @DeleteMapping("/{medicationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedication(@PathVariable UUID medicationId) {
        medicationService.deleteMedication(medicationId);
    }

}
