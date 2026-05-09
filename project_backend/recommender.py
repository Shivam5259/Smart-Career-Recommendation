import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# --- HOW THE RECOMMENDER WORKS ---
# 1. We look at all the skills available in our database.
# 2. We see which skills the USER has (and how good they are at them).
# 3. We see which skills each CAREER needs.
# 4. We compare the USER's skills with the CAREER's needs using math (Cosine Similarity).

class CareerRecommender:
    def __init__(self, conn):
        # 'conn' is our database connection (the phone call to the DB)
        self.conn = conn

    def get_recommendations(self, user_id: int, top_n: int = 5):
        cursor = self.conn.cursor()

        # 1. Fetch all skills to create a list of everything possible
        cursor.execute("SELECT id FROM skills ORDER BY id")
        all_skills = cursor.fetchall()
        
        # We create a map so we know which skill goes in which position in our math list
        skill_ids = [s["id"] for s in all_skills]
        skill_map = {sid: i for i, sid in enumerate(skill_ids)}
        num_skills = len(skill_ids)

        if num_skills == 0:
            return []

        # 2. Fetch user skills
        cursor.execute("SELECT skill_id, proficiency_level FROM user_skills WHERE user_id = %s", (user_id,))
        user_skills_raw = cursor.fetchall()
        
        # Create a list of numbers representing the user's skills
        user_vector = np.zeros(num_skills)
        for us in user_skills_raw:
            if us["skill_id"] in skill_map:
                # We turn a 0-100 score into a 0.0-1.0 score for the math
                user_vector[skill_map[us["skill_id"]]] = us["proficiency_level"] / 100.0

        # 3. Fetch all careers and their skills
        cursor.execute("SELECT id FROM careers")
        careers_list = cursor.fetchall()
        
        recommendations = []

        for career in careers_list:
            career_id = career["id"]
            
            # Fetch skills needed for THIS specific career
            cursor.execute("SELECT skill_id, importance_weight FROM career_skills WHERE career_id = %s", (career_id,))
            career_skills_raw = cursor.fetchall()
            
            # Create a list of numbers representing what this career needs
            career_vector = np.zeros(num_skills)
            for cs in career_skills_raw:
                if cs["skill_id"] in skill_map:
                    career_vector[skill_map[cs["skill_id"]]] = cs["importance_weight"]

            # 4. MATH: Calculate how similar the USER is to the CAREER
            uv = user_vector.reshape(1, -1)
            cv = career_vector.reshape(1, -1)
            
            if np.all(uv == 0) or np.all(cv == 0):
                similarity = 0.0
            else:
                # Cosine similarity tells us how much the two lists of numbers overlap
                similarity = float(cosine_similarity(uv, cv)[0][0])

            recommendations.append({
                "career_id": career_id,
                "confidence_score": similarity
            })

        # Sort from highest score to lowest score
        recommendations.sort(key=lambda x: x["confidence_score"], reverse=True)
        
        cursor.close()
        # Return only the top matches
        return recommendations[:top_n]






import numpy as np
from sklearn.neighbors import NearestNeighbors

class CareerRecommenderKNN:
    def __init__(self, conn):
        self.conn = conn
        self.model = None
        self.career_vectors = []
        self.career_ids = []

    def train_model(self):
        cursor = self.conn.cursor()

        # 1. Get all skills
        cursor.execute("SELECT id FROM skills ORDER BY id")
        skill_ids = [s["id"] for s in cursor.fetchall()]
        skill_map = {sid: i for i, sid in enumerate(skill_ids)}
        num_skills = len(skill_ids)

        # 2. Get all careers
        cursor.execute("SELECT id FROM careers")
        careers = cursor.fetchall()

        career_vectors = []
        career_ids = []

        for career in careers:
            vector = np.zeros(num_skills)

            cursor.execute(
                "SELECT skill_id, importance_weight FROM career_skills WHERE career_id = %s",
                (career["id"],)
            )
            skills = cursor.fetchall()

            for s in skills:
                if s["skill_id"] in skill_map:
                    vector[skill_map[s["skill_id"]]] = s["importance_weight"]

            career_vectors.append(vector)
            career_ids.append(career["id"])

        # 3. Train KNN model
        self.model = NearestNeighbors(
            n_neighbors=5,
            metric="cosine"
        )
        self.model.fit(career_vectors)

        self.career_vectors = np.array(career_vectors)
        self.career_ids = career_ids

        cursor.close()

    def get_recommendations(self, user_id: int, top_n: int = 5):
        cursor = self.conn.cursor()

        # Build user vector
        cursor.execute("SELECT id FROM skills ORDER BY id")
        skill_ids = [s["id"] for s in cursor.fetchall()]
        skill_map = {sid: i for i, sid in enumerate(skill_ids)}

        user_vector = np.zeros(len(skill_ids))

        cursor.execute(
            "SELECT skill_id, proficiency_level FROM user_skills WHERE user_id = %s",
            (user_id,)
        )
        user_skills = cursor.fetchall()

        for us in user_skills:
            if us["skill_id"] in skill_map:
                user_vector[skill_map[us["skill_id"]]] = us["proficiency_level"] / 100.0

        # 🔥 KNN MAGIC
        distances, indices = self.model.kneighbors([user_vector], n_neighbors=top_n)

        recommendations = []
        for i, idx in enumerate(indices[0]):
            recommendations.append({
                "career_id": self.career_ids[idx],
                "confidence_score": 1 - distances[0][i]  # convert distance → similarity
            })

        cursor.close()
        return recommendations