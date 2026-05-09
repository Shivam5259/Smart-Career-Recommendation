from fastapi import APIRouter, Depends, HTTPException
from typing import List
import crud, schemas, database

router = APIRouter(prefix="/careers", tags=["Careers"])

# 1. GET ALL CAREERS
@router.get("/", response_model=List[schemas.CareerResponse])
def read_careers(conn = Depends(database.get_db)):
    return crud.get_careers(conn)

# 2. GET ONE CAREER BY ITS ID
@router.get("/{career_id}", response_model=schemas.CareerResponse)
def read_career(career_id: int, conn = Depends(database.get_db)):
    career = crud.get_career_by_id(conn, career_id=career_id)
    if career is None:
        raise HTTPException(status_code=404, detail="Career not found")
    return career

