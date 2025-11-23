from pydantic import BaseModel
from typing import Optional

# -------- USER ---------
class UserCreate(BaseModel):
    full_name: str
    wallet_address: str
    email: Optional[str] = None
    user_type: str  # freelancer | employer


class UserResponse(BaseModel):
    id: int
    full_name: str
    wallet_address: str
    email: Optional[str]
    user_type: str

    class Config:
        orm_mode = True


# -------- FREELANCER JOB ------------
class FreelancerJobCreate(BaseModel):
    user_id: int
    title: str
    description: str
    budget: float


class FreelancerJobResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    budget: float

    class Config:
        orm_mode = True


# -------- EMPLOYER JOB ------------
class EmployerJobCreate(BaseModel):
    user_id: int
    title: str
    description: str
    salary: float


class EmployerJobResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    salary: float

    class Config:
        orm_mode = True
