from fastapi import APIRouter, Depends
from typing import List
import crud, schemas, database

router = APIRouter(prefix="/skills", tags=["Skills"])

# 1. GET ALL SKILLS
@router.get("/", response_model=List[schemas.Skill])
def read_skills(conn = Depends(database.get_db)):
    return crud.get_skills(conn)

# 2. ADD A NEW SKILL
@router.post("/", response_model=schemas.Skill)
def create_skill(skill: schemas.SkillCreate, conn = Depends(database.get_db)):
    return crud.create_skill(conn=conn, skill_data=skill)

