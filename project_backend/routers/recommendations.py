from fastapi import APIRouter, Depends
from typing import List
import crud, schemas, auth, database, recommender

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.post("/generate", response_model=List[schemas.RecommendationResponse])
def generate_recommendations(
    conn = Depends(database.get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    # We pass our database connection to the Recommender engine
    engine = recommender.CareerRecommender(conn)
    
    # We use the logged in users ID to find matches
    recs = engine.get_recommendations(current_user['id'])
    
    # 1. Clear existing recommendations for this user first
    crud.delete_user_recommendations(conn, user_id=current_user['id'])

    # 2. Save these new recommendations to the database
    db_recs = []
    for r in recs:
        db_rec = crud.create_recommendation(
            conn=conn, 
            user_id=current_user['id'], 
            career_id=r["career_id"], 
            score=r["confidence_score"]
        )
        db_recs.append(db_rec)
        
    return db_recs

@router.get("/", response_model=List[schemas.RecommendationResponse])
def get_recommendations(
    conn = Depends(database.get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    return crud.get_user_recommendations(conn, user_id=current_user['id'])
