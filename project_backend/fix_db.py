import database

def fix_schema():
    conn = database.get_db_connection()
    cursor = conn.cursor()
    
    print("Fixing database schema...")
    
    try:
        # Add unique constraint to careers table
        cursor.execute("ALTER TABLE careers ADD CONSTRAINT careers_career_title_key UNIQUE (career_title);")
        print("Added unique constraint to careers.career_title")
    except Exception as e:
        print(f"Note: {e}")
        
    conn.commit()
    cursor.close()
    conn.close()
    print("Schema fix complete.")

if __name__ == "__main__":
    fix_schema()
