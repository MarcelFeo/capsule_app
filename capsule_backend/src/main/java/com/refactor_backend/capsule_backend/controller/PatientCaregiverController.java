package com.refactor_backend.capsule_backend.controller;

import com.refactor_backend.capsule_backend.dto.PatientCaregiverRequest;
import com.refactor_backend.capsule_backend.dto.PatientCaregiverResponse;
import com.refactor_backend.capsule_backend.service.PatientCaregiverService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patient-caregivers")
public class PatientCaregiverController {

    private final PatientCaregiverService patientCaregiverService;

    public PatientCaregiverController(PatientCaregiverService patientCaregiverService) {
        this.patientCaregiverService = patientCaregiverService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientCaregiverResponse registerPatientCaregiver(@RequestBody PatientCaregiverRequest request) {
        return patientCaregiverService.registerPatientCaregiver(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePatientCaregiver(@PathVariable String id) {
        patientCaregiverService.deletePatientCaregiver(java.util.UUID.fromString(id));
    }

}
