from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import get_db, ping_db, engine
from .models import Base, User, FreelancerJob, EmployerJob
from .schemas import (
    UserCreate, UserResponse,
    FreelancerJobCreate, FreelancerJobResponse,
    EmployerJobCreate, EmployerJobResponse
)

app = FastAPI(
    title="Stellar Etkinlik Backend",
    version="0.1.0",
)

# CORS middleware ekle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URL'leri
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB tabloları oluştur
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Stellar etkinlik backend ayakta! 🚀"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/db-health")
def db_health_check():
    ok = ping_db()
    return {"db_ok": ok}

# ===============================
#        USER APİ'LERİ
# ===============================

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        full_name=user.full_name,
        wallet_address=user.wallet_address,
        email=user.email,
        user_type=user.user_type
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


# ===============================
#     FREELANCER JOB APİ'LERİ
# ===============================

@app.post("/freelancer/jobs", response_model=FreelancerJobResponse)
def create_freelancer_job(job: FreelancerJobCreate, db: Session = Depends(get_db)):
    new_job = FreelancerJob(
        user_id=job.user_id,
        title=job.title,
        description=job.description,
        budget=job.budget,
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


@app.get("/freelancer/jobs", response_model=list[FreelancerJobResponse])
def list_freelancer_jobs(db: Session = Depends(get_db)):
    return db.query(FreelancerJob).all()


# ===============================
#       EMPLOYER JOB APİ'LERİ
# ===============================

@app.post("/employer/jobs", response_model=EmployerJobResponse)
def create_employer_job(job: EmployerJobCreate, db: Session = Depends(get_db)):
    new_job = EmployerJob(
        user_id=job.user_id,
        title=job.title,
        description=job.description,
        salary=job.salary,
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


@app.get("/employer/jobs", response_model=list[EmployerJobResponse])
def list_employer_jobs(db: Session = Depends(get_db)):
    return db.query(EmployerJob).all()
