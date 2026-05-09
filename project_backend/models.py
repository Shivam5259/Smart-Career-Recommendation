from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    education = Column(String)

    skills = relationship("UserSkill", back_populates="user")
    recommendations = relationship("Recommendation", back_populates="user")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String, unique=True)
    category = Column(String)

    users = relationship("UserSkill", back_populates="skill")
    careers = relationship("CareerSkill", back_populates="skill")


class UserSkill(Base):
    __tablename__ = "user_skills"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    proficiency_level = Column(Integer)  # 0-100

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill", back_populates="users")


class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    career_title = Column(String, unique=True)
    description = Column(Text)
    industry = Column(String)
    average_salary = Column(Float)

    skills = relationship("CareerSkill", back_populates="career")
    recommendations = relationship("Recommendation", back_populates="career")


class CareerSkill(Base):
    __tablename__ = "career_skills"

    career_id = Column(Integer, ForeignKey("careers.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    importance_weight = Column(Float)  # 0.0-1.0

    career = relationship("Career", back_populates="skills")
    skill = relationship("Skill", back_populates="careers")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    career_id = Column(Integer, ForeignKey("careers.id"))
    confidence_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recommendations")
    career = relationship("Career", back_populates="recommendations")