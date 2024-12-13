from dotenv import load_dotenv
import os
import requests
from zk import ZK, const
from datetime import datetime
import time
import threading
from datetime import datetime

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
    try:
        login_url = f"{API_URL}/logtoken/"
        response = requests.post(
            login_url,
            json=CREDENTIALS,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            print("Login successful!")
            return response.json().get("access")
        elif response.status_code == 404:
            print("Login endpoint not found. Check the API_URL and endpoint configuration.")
        else:
            print(f"Login failed: {response.status_code}, {response.text}")
        return None
    except Exception as e:
        print(f"Error during login: {e}")
        return None
    

# Sync user data from the biometric device to the backend
def sync_biometric_data():
    zk = ZK('192.168.1.201', port=4370, timeout=5)
    conn = None

    try:
        print("Starting real-time biometric data sync...")
        token = fetch_token()
        if not token:
            print("Token retrieval failed. Aborting sync.")
            return

        headers = {'Authorization': f'Bearer {token}'}

        # Fetch existing users from the backend
        print("Fetching existing users from the backend...")
        response = requests.get(f"{API_URL}/employees/", headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch existing employees: {response.status_code}, {response.text}")
            return

        existing_users = response.json()
        existing_uids = {user.get('uid') for user in existing_users}
        existing_names = {user.get('name') for user in existing_users}

        print(f"Existing users retrieved: {len(existing_users)}")

        conn = zk.connect()
        conn.disable_device()

        while True:  # Continuous monitoring
            print("Checking for new users on the device...")
            users = conn.get_users()

            print(f"Fetched users (raw): {users}")

            for user in users:
                try:
                    # Fetch UID and Name
                    uid = getattr(user, 'uid', None)
                    name = getattr(user, 'name', 'Unknown')

                    if not uid:
                        print(f"Warning: No UID found for user: {user}")
                        continue

                    # Check if the user is already synced
                    if uid in existing_uids or name in existing_names:
                        print(f"Skipping already uploaded user: UID={uid}, Name={name}")
                        continue

                    # Fetch biometric template if needed
                    try:
                        biometric_data = conn.get_user_template(uid)  # Fetch biometric data template
                    except Exception as template_error:
                        print(f"Failed to fetch biometric data for UID {uid}: {template_error}")
                        biometric_data = None

                    print(f"New user detected: UID={uid}, Name={name}")

                    # Sync user data to the backend
                    data = {
                        'uid': uid,
                        'name': name,
                        'address': "Unknown Address",  # Replace with actual user data if available
                        'biometric_data': biometric_data.hex() if biometric_data else None,
                    }

                    response = requests.post(
                        f"{API_URL}/employees/",
                        json=data,
                        headers=headers
                    )
                    if response.status_code == 201:
                        print(f"Successfully added employee: {name}")
                        existing_uids.add(uid)  # Mark as synced
                        existing_names.add(name)
                    else:
                        print(f"Failed to add employee {name}: {response.status_code}, {response.text}")

                except Exception as user_error:
                    print(f"Error processing user: {user}, Error: {user_error}")

            # Wait before checking for more users
            time.sleep(5)  # Polling interval

    except Exception as e:
        print(f"Error in sync_biometric_data: {e}")

    finally:
        if conn:
            conn.enable_device()
            conn.disconnect()


# Fetch attendance data and record the time-in and time-out
def fetch_attendance():
    zk = ZK('192.168.1.201', port=4370, timeout=5)
    conn = None

    try:
        conn = zk.connect()
        conn.disable_device()

        print("Starting live capture...")

        attendance_data = {}

        for attendance in conn.live_capture():
            if attendance:
                uid = attendance.uid
                timestamp = attendance.timestamp if isinstance(attendance.timestamp, datetime) else datetime.fromtimestamp(attendance.timestamp)
                timestamp_str = timestamp.strftime('%Y-%m-%d %H:%M:%S')

                users = conn.get_users()
                user = next((u for u in users if u.uid == uid), None)
                user_name = user.name if user else 'Unknown'

                if uid not in attendance_data:
                    attendance_data[uid] = {'name': user_name, 'time_in': timestamp_str, 'time_out': 'No time out yet'}
                    print(f"Time in for {user_name} at {timestamp_str}")

                    time_in = timestamp_str.split(' ')[1]
                    date = timestamp_str.split(' ')[0]

                    data = {
                        'name': user_name,
                        'user': uid,
                        'date': date,
                        'time_in': time_in,
                    }

                    token = fetch_token()
                    if token:
                        headers = {'Authorization': f'Bearer {token}'}
                        response = requests.post(f"{API_URL}/attendance/", json=data, headers=headers)

                        if response.status_code == 201:
                            print(f"Attendance recorded for UID {uid} - Name: {user_name} - Time In: {time_in}")
                            attendance_data[uid]['sent'] = True
                        else:
                            print(f"Failed to record attendance for UID {uid}: {response.status_code}, {response.text}")

                elif attendance_data[uid]['time_out'] == 'No time out yet':
                    print(f"Updating time-out for UID {uid} at {timestamp_str}")
                    attendance_data[uid]['time_out'] = timestamp_str  # Set time_out in attendance_data
                    time_out = timestamp.strftime('%H:%M:%S')
                    data = {'time_out': time_out}
                    print(f"Payload for time-out update: {data}")

                    token = fetch_token()
                    if token:
                        headers = {'Authorization': f'Bearer {token}'}
                        url = f"{API_URL}/attendance/{uid}/"  # Ensure UID is correct
                        print(f"Sending PUT request to: {url} with data: {data}")  # Debug log for URL and payload
                        response = requests.put(url, json=data, headers=headers)

                        if response.status_code == 200:
                            print(f"Time out updated for UID {uid} - Name: {user_name} - Time Out: {time_out}")
                        else:
                            print(f"Failed to update time out for UID {uid}: {response.status_code}, {response.text}")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        if conn:
            conn.disconnect()


# Run both functions concurrently using threading
if __name__ == "__main__":
    print("Starting both attendance capture and biometric sync...")

    # Create threads for both tasks
    attendance_thread = threading.Thread(target=fetch_attendance)
    # sync_thread = threading.Thread(target=sync_biometric_data)

    # Start both threads
    attendance_thread.start()
    # sync_thread.start()

    # Join both threads (wait for them to finish)
    attendance_thread.join()
    # sync_thread.join()