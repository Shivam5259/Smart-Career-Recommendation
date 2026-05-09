from fastapi import APIRouter, Depends, HTTPException
from typing import List
import crud, schemas, auth, database

router = APIRouter(prefix="/users", tags=["Users"])

# 1. GET MY PROFILE
@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: dict = Depends(auth.get_current_user)):
    # Since auth.get_current_user already found the user, we just return them
    return current_user

# 2. ADD A SKILL TO MY PROFILE
@router.post("/me/skills", response_model=schemas.UserSkillResponse)
def add_skill(
    skill: schemas.UserSkillCreate, 
    conn = Depends(database.get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    # We call our CRUD function which handles both adding new skills
    # and updating existing ones (using the user's ID)
    return crud.add_user_skill(conn=conn, user_id=current_user['id'], skill_data=skill)

