import os #teste
from fastapi import FastAPI
from app.infrastructure.database.connection import Base, engine
from app.domain import models  # Import all models to ensure they're registered with Base
from app.use_cases.user import users
from app.use_cases.patient import patients
from app.use_cases.caregiver import caregivers
from app.use_cases.auth import router as auth_router
from app.use_cases.patient_caregiver import patient_caregivers
from app.use_cases.medication import medications
from app.use_cases.patient_medication import patient_medications
from app.use_cases.medication_schedule import medication_schedules
from app.use_cases.dose_record import dose_records
from app.use_cases.medication_alert import medication_alerts
from app.use_cases.vital_sign import vital_signs
from app.use_cases.device import devices
from app.use_cases.notification import notifications
from app.use_cases.report import reports

if os.environ.get("ENVIRONMENT") != "testing": #teste
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="Capsule API", version="1.0.0")

app.include_router(auth_router.router)
app.include_router(users.router)
app.include_router(patients.router)
app.include_router(caregivers.router)
app.include_router(patient_caregivers.router)
app.include_router(medications.router)
app.include_router(patient_medications.router)
app.include_router(medication_schedules.router)
app.include_router(dose_records.router)
app.include_router(medication_alerts.router)
app.include_router(vital_signs.router)
app.include_router(devices.router)
app.include_router(notifications.router)
app.include_router(reports.router)