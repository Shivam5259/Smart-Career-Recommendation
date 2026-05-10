# the file for functions or main logic 

import auth

def get_user_skills(conn, user_id: int):
    cursor = conn.cursor()
    cursor.execute("""
        SELECT us.skill_id, us.proficiency_level, s.skill_name, s.category
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.id
        WHERE us.user_id = %s
    """, (user_id,))
    rows = cursor.fetchall()
    cursor.close()
    
    skills = []
    for row in rows:
        skills.append({
            "skill_id": row["skill_id"],
            "proficiency_level": row["proficiency_level"],
            "skill": {
                "id": row["skill_id"],
                "skill_name": row["skill_name"],
                "category": row["category"]
            }
        })
    return skills

# func 1
def get_user_by_email(conn, email: str):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    
    if user:
        user["skills"] = get_user_skills(conn, user["id"])
    return user

# func 2
def create_user(conn, user_data):
    hashed_password = auth.get_password_hash(user_data.password)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO users (name, email, password, education) 
        VALUES (%s, %s, %s, %s) 
        RETURNING *
        """, 
        (user_data.name, user_data.email, hashed_password, user_data.education)
    )
    new_user = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if new_user:
        new_user["skills"] = []
    return new_user

# func 3
def get_skills(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM skills")
    skills = cursor.fetchall()
    cursor.close()
    return skills

# func 4
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

# func 5
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
    
    # Fetch skill details for nested response
    cursor.execute("SELECT * FROM skills WHERE id = %s", (skill_data.skill_id,))
    skill_info = cursor.fetchone()
    cursor.close()
    
    if user_skill and skill_info:
        return {
            "skill_id": user_skill["skill_id"],
            "proficiency_level": user_skill["proficiency_level"],
            "skill": skill_info
        }
    return user_skill

# func 6
def get_careers(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM careers")
    careers = cursor.fetchall()
    cursor.close()
    return careers

# func 7
def get_career_by_id(conn, career_id: int):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM careers WHERE id = %s", (career_id,))
    career = cursor.fetchone()
    cursor.close()
    return career

# func 8
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
    
    # Fetch career details for nested response
    cursor.execute("SELECT * FROM careers WHERE id = %s", (career_id,))
    career_info = cursor.fetchone()
    cursor.close()
    
    if new_rec and career_info:
        return {
            "id": new_rec["id"],
            "confidence_score": new_rec["confidence_score"],
            "timestamp": new_rec["created_at"],
            "career": career_info
        }
    return new_rec

# func 9
def get_user_recommendations(conn, user_id: int):
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT r.id, r.confidence_score, r.created_at, 
               c.id as career_id, c.career_title, c.description, c.industry, c.average_salary
        FROM recommendations r
        JOIN careers c ON r.career_id = c.id
        WHERE r.user_id = %s
        ORDER BY r.confidence_score DESC
        """,
        (user_id,)
    )
    rows = cursor.fetchall()
    cursor.close()
    
    results = []
    for row in rows:
        results.append({
            "id": row["id"],
            "confidence_score": row["confidence_score"],
            "timestamp": row["created_at"],
            "career": {
                "id": row["career_id"],
                "career_title": row["career_title"],
                "description": row["description"],
                "industry": row["industry"],
                "average_salary": float(row["average_salary"]) if row["average_salary"] else 0.0
            }
        })
    return results

def delete_user_recommendations(conn, user_id: int):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM recommendations WHERE user_id = %s", (user_id,))
    conn.commit()
    cursor.close()