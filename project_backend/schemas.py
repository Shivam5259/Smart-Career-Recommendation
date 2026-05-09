from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Skill schemas
class SkillBase(BaseModel):
    skill_name: str
    category: str

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    class Config:
        from_attributes = True

# UserSkill schemas
class UserSkillBase(BaseModel):
    skill_id: int
    proficiency_level: int

class UserSkillCreate(UserSkillBase):
    pass

class UserSkillResponse(UserSkillBase):
    skill: Skill
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    education: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    skills: List[UserSkillResponse] = []
    class Config:
        from_attributes = True

# Career schemas
class CareerSkillResponse(BaseModel):
    skill: Skill
    importance_weight: float
    class Config:
        from_attributes = True

class CareerBase(BaseModel):
    career_title: str
    description: str
    industry: str
    average_salary: float

class CareerResponse(CareerBase):
    id: int
    skills: List[CareerSkillResponse] = []
    class Config:
        from_attributes = True

# Recommendation schemas
class RecommendationResponse(BaseModel):
    id: int
    career: CareerResponse
    confidence_score: float
    timestamp: datetime
    class Config:
        from_attributes = True