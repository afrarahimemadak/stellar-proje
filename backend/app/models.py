from sqlalchemy import Column, Integer, String, Enum, Text, DECIMAL, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    wallet_address = Column(String(255), unique=True, nullable=False)
    email = Column(String(150), unique=True)
    user_type = Column(Enum("freelancer", "employer"), nullable=False)

    freelancer_jobs = relationship("FreelancerJob", back_populates="user")
    employer_jobs = relationship("EmployerJob", back_populates="user")


class FreelancerJob(Base):
    __tablename__ = "freelancer_jobs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(DECIMAL(15, 2))

    user = relationship("User", back_populates="freelancer_jobs")


class EmployerJob(Base):
    __tablename__ = "employer_jobs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    salary = Column(DECIMAL(15, 2))

    user = relationship("User", back_populates="employer_jobs")
