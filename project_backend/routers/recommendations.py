from fastapi import APIRouter, Depends
from typing import List
import crud, schemas, auth, database, recommender

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

# 1. GENERATE NEW RECOMMENDATIONS
@router.post("/generate", response_model=List[schemas.RecommendationResponse])
def generate_recommendations(
    conn = Depends(database.get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    # We pass our database connection to the Recommender engine
    engine = recommender.CareerRecommender(conn)
    
    # We use the logged-in user's ID to find matches
    recs = engine.get_recommendations(current_user['id'])
    
    # Save these recommendations to the database so we can see them later
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

# 2. VIEW PREVIOUS RECOMMENDATIONS
@router.get("/", response_model=List[schemas.RecommendationResponse])
def get_recommendations(
    conn = Depends(database.get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    # Fetch existing recommendations from the database for this user
    return crud.get_user_recommendations(conn, user_id=current_user['id'])
