# This file contains functions to interact with our database using raw SQL queries.
# We avoid using complicated libraries and instead write direct PostgreSQL commands.

import auth

# --- WHAT IS A CURSOR? ---
# A cursor is like a 'pointer' or a 'worker' that we send to the database
# to execute a specific command and bring back the results.

# 1. FIND A USER BY THEIR EMAIL
def get_user_by_email(conn, email: str):
    # We ask the connection for a 'worker' (cursor)
    cursor = conn.cursor()
    
    # We send a SQL command: "Find everyone in the users table where the email matches"
    # The %s is a placeholder to keep things safe and secure.
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    
    # fetchone() means "Give me the first result you find"
    user = cursor.fetchone()
    
    # Close the worker
    cursor.close()
    return user

# 2. CREATE A NEW USER
def create_user(conn, user_data):
    # First, we scramble (hash) the password so it's not stored in plain text
    hashed_password = auth.get_password_hash(user_data.password)
    
    cursor = conn.cursor()
    
    # We send a command to INSERT (add) a new row into the users table
    # RETURNING * means "after you add them, give me all their details (including their new ID)"
    cursor.execute(
        """
        INSERT INTO users (name, email, password, education) 
        VALUES (%s, %s, %s, %s) 
        RETURNING *
        """, 
        (user_data.name, user_data.email, hashed_password, user_data.education)
    )
    
    # Get the new user's details
    new_user = cursor.fetchone()
    
    # IMPORTANT: We must 'commit' to save the new user permanently
    conn.commit()
    
    cursor.close()
    return new_user

# 3. GET ALL AVAILABLE SKILLS
def get_skills(conn):
    cursor = conn.cursor()
    
    # "SELECT * FROM skills" means "Give me everything in the skills table"
    cursor.execute("SELECT * FROM skills")
    
    # fetchall() means "Give me every single row you found"
    skills = cursor.fetchall()
    
    cursor.close()
    return skills

# 4. ADD A NEW SKILL TO THE MASTER LIST
def create_skill(conn, skill_data):
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO skills (skill_name, category) VALUES (%s, %s) RETURNING *",
        (skill_data.skill_name, skill_data.category)
    )
    
    new_skill = cursor.fetchone()
    conn.commit()
    cursor.close()
    return new_skill

# 5. LINK A SKILL TO A USER (User Profile)
def add_user_skill(conn, user_id: int, skill_data):
    cursor = conn.cursor()
    
    cursor.execute(
        """
        INSERT INTO user_skills (user_id, skill_id, proficiency_level) 
        VALUES (%s, %s, %s) 
        ON CONFLICT (user_id, skill_id) DO UPDATE 
        SET proficiency_level = EXCLUDED.proficiency_level
        RETURNING *
        """,
        (user_id, skill_data.skill_id, skill_data.proficiency_level)
    )
    
    user_skill = cursor.fetchone()
    conn.commit()
    cursor.close()
    return user_skill

# 6. GET ALL CAREER OPTIONS
def get_careers(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM careers")
    careers = cursor.fetchall()
    cursor.close()
    return careers

# 7. GET DETAILS FOR ONE SPECIFIC CAREER
def get_career_by_id(conn, career_id: int):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM careers WHERE id = %s", (career_id,))
    career = cursor.fetchone()
    cursor.close()
    return career

# 8. SAVE A NEW RECOMMENDATION
def create_recommendation(conn, user_id: int, career_id: int, score: float):
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO recommendations (user_id, career_id, confidence_score) 
        VALUES (%s, %s, %s) 
        RETURNING *
        """,
        (user_id, career_id, score)
    )
    new_rec = cursor.fetchone()
    conn.commit()
    cursor.close()
    return new_rec

# 9. GET ALL RECOMMENDATIONS FOR A SPECIFIC USER
def get_user_recommendations(conn, user_id: int):
    cursor = conn.cursor()
    
    # We join the recommendations table with the careers table 
    # so we can see the title of the career, not just its ID number.
    cursor.execute(
        """
        SELECT r.*, c.career_title, c.description 
        FROM recommendations r
        JOIN careers c ON r.career_id = c.id
        WHERE r.user_id = %s
        ORDER BY r.confidence_score DESC
        """,
        (user_id,)
    )
    
    results = cursor.fetchall()
    cursor.close()
    return results