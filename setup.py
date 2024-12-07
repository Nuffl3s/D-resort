import from API
import requests
from zk import ZK, const

conn = None
zk = ZK('192.168.1.201', port=4370, timeout=5, password=0, force_udp=False, ommit_ping=False)

# Example JWT token (replace this with the actual token you receive from the login API)
jwt_token = 'accessToken'

try:
    # Connect to the device
    conn = zk.connect()
    # Disable device
    conn.disable_device()

    # Example: Get All Users
    users = conn.get_users()
    for user in users:
        # Print UID and Name (Debug)
        print('+ UID #{}'.format(user.uid))
        print('  Name       : {}'.format(user.name))

        # Send data to backend API to store in the database
        headers = {
            'Authorization': f'Bearer {jwt_token}'  # Add the Authorization header with the token
        }

        response = requests.post('http://localhost:8000/api/employees/', data={
            'uid': user.uid,
            'name': user.name
        }, headers=headers)

        if response.status_code == 201:
            print(f"Employee {user.name} added to backend.")
        else:
            print(f"Failed to add {user.name} to backend. Error: {response.status_code} - {response.text}")

    # Re-enable device after all actions are completed
    conn.enable_device()

except Exception as e:
    print("Process terminated: {}".format(e))

finally:
    if conn:
        conn.disconnect()
