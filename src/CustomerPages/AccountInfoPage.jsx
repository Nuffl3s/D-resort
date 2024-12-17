import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AccountInfoPage() {
    const [accountData, setAccountData] = useState({
        fullName: '',
        accountId: '',
        email: '',
        phoneNumber: '',
    });
    const [logs, setLogs] = useState([]);
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const navigate = useNavigate();

    // Fetch account details and logs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountRes = await api.get('/customer/details/'); // Get account details
                
                setAccountData({
                    fullName: `${accountRes.data.name}`,
                    email: accountRes.data.email,
                    phoneNumber: accountRes.data.phone_number,
                });

            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };
        fetchData();
    }, []);

    const handleChangePassword = async () => {
        try {
            await api.post('/api/change-password/', { new_password: newPassword });
            alert('Password changed successfully!');
        } catch (error) {
            alert('Failed to change password.');
        }
    };

    const handleChangeEmail = async () => {
        try {
            await api.put('/api/user-details/', { email: newEmail });
            setAccountData({ ...accountData, email: newEmail });
            alert('Email changed successfully!');
        } catch (error) {
            alert('Failed to change email.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">Account Information</h1>
            <div className="space-y-4">
                <p><strong>Full Name:</strong> {accountData.fullName}</p>
                <p><strong>Email:</strong> {accountData.email}</p>
                <p><strong>Phone Number:</strong> {accountData.phoneNumber}</p>
            </div>

            {/* Change Password */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Change Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleChangePassword}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Update Password
                </button>
            </div>

            {/* Change Email */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Change Email</h2>
                <input
                    type="email"
                    placeholder="New Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleChangeEmail}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Update Email
                </button>
            </div>

            {/* Logs Section */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Booking Logs</h2>
                <ul className="list-disc pl-5">
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <li key={log.id} className="mb-2">
                                <span className="font-bold">{log.timestamp}:</span> {log.action}
                            </li>
                        ))
                    ) : (
                        <p>No booking logs found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default AccountInfoPage;
