import requests
import json

API_URL = "http://localhost:5000"

# Test health endpoint
response = requests.get(f"{API_URL}/health")
print("Health Check:", response.json())

# Test prediction
test_data = {
    "age": 55,
    "gender": "Male",
    "bloodPressure": 145,
    "glucoseLevel": 150,
    "cholesterol": 250
}

response = requests.post(f"{API_URL}/predict", json=test_data)
print("\nPrediction Result:")
print(json.dumps(response.json(), indent=2))