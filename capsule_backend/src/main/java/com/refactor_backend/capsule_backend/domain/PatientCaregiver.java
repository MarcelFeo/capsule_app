package com.refactor_backend.capsule_backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "patient_caregiver",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"patient_id", "caregiver_id"})
        }
)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PatientCaregiver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;
}
