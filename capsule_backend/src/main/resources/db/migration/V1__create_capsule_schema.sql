CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL,
    gender VARCHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medications (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    instruction TEXT,
    dosage VARCHAR(100),
    days_week VARCHAR(10)[],
    active BOOLEAN DEFAULT TRUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE patient_caregiver (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    caregiver_id UUID NOT NULL,

    CONSTRAINT fk_patient
        FOREIGN KEY(patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_caregiver
        FOREIGN KEY(caregiver_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_relation UNIQUE(patient_id, caregiver_id)
);