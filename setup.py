from dotenv import load_dotenv
import os
import requests
from zk import ZK

# Load .env variables
load_dotenv()

# Fetch credentials
API_URL = os.getenv("API_URL", "http://localhost:8000/api")  # Base API URL
CREDENTIALS = {
    "username": os.getenv("API_USERNAME"),
    "password": os.getenv("API_PASSWORD"),
}

# Authenticate with the backend and fetch the token
def fetch_token():
    """
    Fetch JWT access token from the backend login endpoint.
    """
    try:
        # Correct the endpoint to match your Django URLs
        login_url = f"{API_URL}/logtoken/"
        response = requests.post(
            login_url,
            json=CREDENTIALS,
            headers={"Content-Type": "application/json"}  # Ensure proper content type
        )
        if response.status_code == 200:
            print("Login successful!")
            return response.json().get("access")  # Adjust based on your API response
        elif response.status_code == 404:
            print("Login endpoint not found. Check the API_URL and endpoint configuration.")
        else:
            print(f"Login failed: {response.status_code}, {response.text}")
        return None
    except Exception as e:
        print(f"Error during login: {e}")
        return None

# Interact with the biometric device
def sync_biometric_data():
    """
    Connect to the biometric device, fetch user data, and send it to the backend.
    """
    zk = ZK('192.168.1.201', port=4370, timeout=5)
    conn = None

    try:
        token = fetch_token()  # Get the token
        if not token:
            print("Token retrieval failed. Aborting sync.")
            return

        headers = {'Authorization': f'Bearer {token}'}

        conn = zk.connect()
        conn.disable_device()

        # Fetch users from the biometric device
        users = conn.get_users()
        for user in users:
            data = {'uid': user.uid, 'name': user.name}
            response = requests.post(
                f"{API_URL}/employees/",
                json=data,  # Use JSON format for consistency
                headers=headers
            )
            if response.status_code == 201:
                print(f"Added employee: {user.name}")
            else:
                print(f"Failed to add {user.name}: {response.status_code}, {response.text}")

        conn.enable_device()

    except Exception as e:
        print(f"Error: {e}")

    finally:
        if conn:
            conn.disconnect()

if __name__ == "__main__":
    sync_biometric_data()
