import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def test_workflow():
    # 1. Register a user
    print("Testing Registration...")
    user_data = {
        "name": "Test User",
        "email": f"test_{int(time.time())}@example.com",
        "password": "testpassword",
        "education": "Bachelor of Technology"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    print(f"Register Status: {response.status_code}")
    if response.status_code != 200:
        print(response.json())
        return

    # 2. Login
    print("\nTesting Login...")
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    response = requests.post(f"{BASE_URL}/auth/token", data=login_data)
    print(f"Login Status: {response.status_code}")
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Add skills to user
    print("\nTesting Add Skills...")
    # Get Python skill ID (it's 1 if seeded fresh)
    skills = requests.get(f"{BASE_URL}/skills/").json()
    python_skill = next(s for s in skills if s["skill_name"] == "Python")
    
    skill_data = {
        "skill_id": python_skill["id"],
        "proficiency_level": 90
    }
    response = requests.post(f"{BASE_URL}/users/me/skills", json=skill_data, headers=headers)
    print(f"Add Skill Status: {response.status_code}")

    # 4. Generate Recommendations
    print("\nTesting Recommendation Generation...")
    response = requests.post(f"{BASE_URL}/recommendations/generate", headers=headers)
    print(f"Generate Recommendations Status: {response.status_code}")
    recs = response.json()
    for r in recs:
        print(f"- {r['career']['career_title']}: {r['confidence_score']:.2f}")

if __name__ == "__main__":
    print("Starting API Tests...")
    print("Ensure the FastAPI server is running with: uvicorn main:app --reload")
    try:
        test_workflow()
    except Exception as e:
        print(f"Error: {e}")
