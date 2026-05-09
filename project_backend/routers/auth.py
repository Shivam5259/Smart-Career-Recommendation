from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import crud, schemas, auth, database

router = APIRouter(prefix="/auth", tags=["Authentication"])

# 1. REGISTER A NEW USER
@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, conn = Depends(database.get_db)):
    # Check if a user with this email already exists
    db_user = crud.get_user_by_email(conn, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create the user in the database
    return crud.create_user(conn=conn, user_data=user)

# 2. LOGIN (GET A TOKEN)
@router.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), conn = Depends(database.get_db)):
    # Find the user by their email
    user = crud.get_user_by_email(conn, email=form_data.username)
    
    # Verify the password
    # Note: we use user['password'] because we get a dictionary from the DB
    if not user or not auth.verify_password(form_data.password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create a secret token (JWT) that the user will use for future requests
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user['email']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

