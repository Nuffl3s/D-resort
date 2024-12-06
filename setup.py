from flask import Flask, request, jsonify
from zk import ZK
import json
import os

app = Flask(__name__)

zk = ZK('192.168.1.201', port=4370, timeout=5)

# Directory to store fingerprint data locally (example)
FINGERPRINT_STORAGE_DIR = 'fingerprint_data'
EMPLOYEE_STORAGE_DIR = 'employee_data'

if not os.path.exists(FINGERPRINT_STORAGE_DIR):
    os.makedirs(FINGERPRINT_STORAGE_DIR)

if not os.path.exists(EMPLOYEE_STORAGE_DIR):
    os.makedirs(EMPLOYEE_STORAGE_DIR)

@app.route('/api/register_employee/', methods=['POST'])
def register_employee():
    form_data = request.json
    name = form_data['name']
    address = form_data['address']
    mobile_number = form_data['mobile_number']
    
    # Save employee information locally
    employee_data = {
        'name': name,
        'address': address,
        'mobile_number': mobile_number
    }
    
    employee_id = f"{name}_{mobile_number}"  # Use a combination of name and mobile number as unique ID
    save_employee_data(employee_id, employee_data)
    
    # After saving employee, proceed with biometric registration
    return jsonify({'message': 'Employee registered successfully! Proceed with biometric registration.'}), 200


@app.route('/api/register_biometric/', methods=['POST'])
def register_biometric():
    form_data = request.json
    name = form_data['name']
    employee_id = form_data['employee_id']

    # Connect to the biometric device
    try:
        conn = zk.connect()
        conn.disable_device()  # Disable device during registration
        print("Please scan your fingerprints...")

        fingerprint_data = []

        # Capture fingerprint 3 times
        for i in range(3):
            fingerprint = conn.capture_fingerprint()
            if fingerprint:
                print(f"Fingerprint {i+1} captured.")
                fingerprint_data.append(fingerprint)
            else:
                return jsonify({'error': 'Fingerprint capture failed. Try again.'}), 400

        # Save fingerprint data locally
        save_fingerprint_data(employee_id, fingerprint_data)

        conn.enable_device()  # Re-enable the device
        return jsonify({'message': 'Registration successful! Please proceed with the fingerprint scan.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def save_employee_data(employee_id, employee_data):
    """Store employee data locally as a JSON file"""
    file_path = os.path.join(EMPLOYEE_STORAGE_DIR, f"{employee_id}.json")
    with open(file_path, 'w') as f:
        json.dump(employee_data, f)


def save_fingerprint_data(employee_id, fingerprint_data):
    """Store fingerprint data locally as a JSON file"""
    file_path = os.path.join(FINGERPRINT_STORAGE_DIR, f"{employee_id}_fingerprints.json")
    with open(file_path, 'w') as f:
        json.dump(fingerprint_data, f)


if __name__ == '__main__':
    app.run(debug=True)
