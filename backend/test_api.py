import requests
import json

# Test the API endpoints
def test_api():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing API endpoints...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Root endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health endpoint: {response.status_code}")
        health_data = response.json()
        print(f"   AI Models Ready: {health_data.get('ai_models_ready')}")
        print(f"   Initialization Status: {health_data.get('initialization_status')}")
    except Exception as e:
        print(f"❌ Health endpoint failed: {e}")
    
    # Test debug endpoint
    try:
        response = requests.get(f"{base_url}/debug")
        print(f"✅ Debug endpoint: {response.status_code}")
        debug_data = response.json()
        print(f"   AI Assistant Exists: {debug_data.get('ai_assistant_exists')}")
        print(f"   Models Ready: {debug_data.get('models_ready')}")
        print(f"   Initialization Status: {debug_data.get('initialization_status')}")
    except Exception as e:
        print(f"❌ Debug endpoint failed: {e}")
    
    # Test chat endpoint
    try:
        chat_data = {
            "message": "Hello, can you help me with math?",
            "subject": "Mathematics",
            "message_type": "text"
        }
        response = requests.post(f"{base_url}/chat", json=chat_data)
        print(f"✅ Chat endpoint: {response.status_code}")
        if response.status_code == 200:
            chat_response = response.json()
            print(f"   Success: {chat_response.get('success')}")
            print(f"   Response: {chat_response.get('response')[:100]}...")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Chat endpoint failed: {e}")

if __name__ == "__main__":
    test_api()