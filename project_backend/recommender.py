import numpy as np
from sklearn.neighbors import NearestNeighbors

class CareerRecommender:
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

        if not career_vectors:
            cursor.close()
            return

        # 3. Train KNN model
        self.model = NearestNeighbors(
            n_neighbors=min(5, len(career_vectors)),
            metric="cosine"
        )
        self.model.fit(career_vectors)

        self.career_vectors = np.array(career_vectors)
        self.career_ids = career_ids

        cursor.close()

    def get_recommendations(self, user_id: int, top_n: int = 5):
        # Auto-train if model is not ready
        if self.model is None:
            self.train_model()
            
        if self.model is None or len(self.career_ids) == 0:
            return []

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

        # KNN MAGIC
        distances, indices = self.model.kneighbors([user_vector], n_neighbors=min(top_n, len(self.career_ids)))

        recommendations = []
        for i, idx in enumerate(indices[0]):
            recommendations.append({
                "career_id": self.career_ids[idx],
                "confidence_score": float(1 - distances[0][i])  # convert distance → similarity
            })

        cursor.close()
        return recommendations