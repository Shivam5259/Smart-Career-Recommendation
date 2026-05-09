import database

# This script fills our database with some starting data (Skills and Careers)
# so the app isn't empty when we first use it.

def seed_data():
    # Start a connection to the database
    conn = database.get_db_connection()
    cursor = conn.cursor()
    
    # 1. CREATE INITIAL SKILLS
    skills_data = [
        ("Python", "Programming"),
        ("Data Analysis", "Data Science"),
        ("Machine Learning", "Data Science"),
        ("SQL", "Database"),
        ("React", "Frontend"),
        ("Communication", "Soft Skills"),
        ("Project Management", "Management"),
        ("Cloud Computing", "Infrastructure"),
    ]
    
    print("Seeding skills...")
    skill_map = {}
    for name, cat in skills_data:
        # We use INSERT ... ON CONFLICT DO NOTHING to avoid errors if the skill exists
        # RETURNING id lets us get the ID of the skill (whether it's new or existing)
        cursor.execute(
            """
            INSERT INTO skills (skill_name, category) 
            VALUES (%s, %s) 
            ON CONFLICT (skill_name) DO UPDATE SET category = EXCLUDED.category
            RETURNING id
            """, 
            (name, cat)
        )
        skill_id = cursor.fetchone()['id']
        skill_map[name] = skill_id
    
    # 2. CREATE INITIAL CAREERS
    careers_data = [
        {
            "title": "Data Scientist",
            "desc": "Analyze large datasets to find patterns and build predictive models.",
            "ind": "Tech",
            "sal": 120000.0,
            "skills": [
                ("Python", 0.9), ("Data Analysis", 0.95), ("Machine Learning", 1.0), ("SQL", 0.8), ("Communication", 0.7)
            ]
        },
        {
            "title": "Full Stack Developer",
            "desc": "Build both frontend and backend applications.",
            "ind": "Tech",
            "sal": 110000.0,
            "skills": [
                ("Python", 0.8), ("React", 1.0), ("SQL", 0.85), ("Cloud Computing", 0.7), ("Project Management", 0.6)
            ]
        },
        {
            "title": "Data Analyst",
            "desc": "Interpret data and turn it into information which can offer ways to improve a business.",
            "ind": "Tech/Business",
            "sal": 80000.0,
            "skills": [
                ("SQL", 0.95), ("Data Analysis", 1.0), ("Python", 0.6), ("Communication", 0.85)
            ]
        },
    ]
    
    print("Seeding careers...")
    for c in careers_data:
        # Insert career
        cursor.execute(
            """
            INSERT INTO careers (career_title, description, industry, average_salary) 
            VALUES (%s, %s, %s, %s) 
            ON CONFLICT (career_title) DO UPDATE 
            SET description = EXCLUDED.description, industry = EXCLUDED.industry, average_salary = EXCLUDED.average_salary
            RETURNING id
            """,
            (c["title"], c["desc"], c["ind"], c["sal"])
        )
        career_id = cursor.fetchone()['id']
        
        # Link skills to this career
        for s_name, weight in c["skills"]:
            cursor.execute(
                """
                INSERT INTO career_skills (career_id, skill_id, importance_weight) 
                VALUES (%s, %s, %s) 
                ON CONFLICT (career_id, skill_id) DO UPDATE SET importance_weight = EXCLUDED.importance_weight
                """,
                (career_id, skill_map[s_name], weight)
            )
    
    # Save all changes
    conn.commit()
    cursor.close()
    conn.close()
    print("Database seeded successfully! 🌱")

if __name__ == "__main__":
    seed_data()
