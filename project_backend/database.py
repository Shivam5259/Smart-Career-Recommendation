import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# load database which is stored secretly in .env file
load_dotenv()

# store the link get from load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    """
    this func establish connection with database and returns
    """
    # using psycopg2 to connect
    # cursor_factory=RealDictCursor makes it so the database returns 
    # data as easy-to-read dictionaries (like {"name": "Alice"}) instead of just lists.
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn


# using this just to show db part else tables are already created in database, 
# and this also helps in changing the database easily without writing queries again and again
def init_db():
    # docstring like a comment but it is stored in memory and we can access it
    """
    This function creates the tables (spreadsheets) if they don't exist yet.
    """
    conn = get_db_connection()
    # cursor to point database (from psycopg2.extras RealDictCursor)
    cursor = conn.cursor()
    
    # Users
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            education VARCHAR(150),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Skills
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            skill_name VARCHAR(100) UNIQUE NOT NULL,
            category VARCHAR(100)
        );
    """)

    # User_Skill
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_skills (
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
            proficiency_level INT CHECK(proficiency_level BETWEEN 1 AND 100),
            PRIMARY KEY (user_id, skill_id)
        );
    """)

    # Career
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS careers (
            id SERIAL PRIMARY KEY,
            career_title VARCHAR(150) UNIQUE NOT NULL,
            description TEXT,
            industry VARCHAR(100),
            average_salary NUMERIC
        );
    """)

    # Career_Skills
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS career_skills (
            career_id INT REFERENCES careers(id) ON DELETE CASCADE,
            skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
            importance_weight FLOAT CHECK(importance_weight BETWEEN 0 AND 1),
            PRIMARY KEY (career_id, skill_id)
        );
    """)

    # Recommendations
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            career_id INTEGER REFERENCES careers(id) ON DELETE CASCADE,
            confidence_score FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Save changes
    conn.commit()
    
    # close the connections
    cursor.close()
    conn.close()
    print("Database tables initialized!")

# this is for fastapi used to establish connection for every request
def get_db():
    conn = get_db_connection()
    # try tells the code that do the work but i will close the conn when return
    try:
        # yield is giving the conn to fast api and pause here untill return
        yield conn
    # finally will execute after the return or after the try block
    finally:
        conn.close()