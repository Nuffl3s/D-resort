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
    const [groupedLogs, setGroupedLogs] = useState({});

    // Fetch account details and logs
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch account details
                const accountRes = await api.get('/customer/details/');
                setAccountData({
                    fullName: accountRes.data.name,
                    email: accountRes.data.email,
                    phoneNumber: accountRes.data.phone_number,
                });
    
                // Fetch reservations
                const reservationRes = await api.get('/reservations/'); // Use ReservationView endpoint
                setLogs(reservationRes.data);
    
            } catch (error) {
                console.error('Error fetching account or reservation data:', error);
            }
        };
        fetchData();
    }, []);

    const handleBookAgain = (reservation) => {
        const { unit_name, unit_type } = reservation;
    
        // Fetch unit details dynamically
        api.get(`/${unit_type.toLowerCase()}s/?name=${unit_name}`)
            .then((response) => {
                const unitDetails = response.data[0]; // Assuming the API returns a list
                navigate("/payment", {
                    state: {
                        unit: {
                            name: unitDetails.name,
                            capacity: unitDetails.capacity,
                            custom_prices: unitDetails.custom_prices,
                            image_url: unitDetails.image_url,
                            description: unitDetails.description || "No description available",
                        },
                        selectedDate: new Date(reservation.date_of_reservation),
                    },
                });
            })
            .catch((error) => {
                console.error("Error fetching unit details:", error);
                alert("Failed to fetch unit details. Please try again.");
            });
    };

    const handleCheckAvailability = (unitName) => {
        navigate(`/calendar/${unitName}`); // Pass the unit name as a parameter
    };
    

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
    <h2 className="text-xl font-semibold mb-4">Your Reservations</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logs.length > 0 ? (
            // Group reservations by unit_name
            Object.values(
                logs.reduce((acc, reservation) => {
                    const key = reservation.unit_name;
                    if (!acc[key]) {
                        acc[key] = { ...reservation, count: 1 };
                    } else {
                        acc[key].count += 1;
                    }
                    return acc;
                }, {})
            ).map((reservation) => (
                <div
                    key={reservation.unit_name}
                    className="bg-white rounded-xl shadow-md border border-gray-200 transition-transform hover:scale-105"
                >
                    {/* Image Section */}
                    <img
                        src={reservation.image_url || "/default-image.jpg"}
                        alt={reservation.unit_name}
                        className="w-full h-40 object-cover rounded-t-xl"
                    />

                    {/* Details Section */}
                    <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{reservation.unit_name}</h3>
                        <p className="text-gray-600 mb-1">
                            <strong>Reservations:</strong> {reservation.count} times
                        </p>
                        <p className="text-gray-600 mb-1">
                            <strong>Last Reserved:</strong> {reservation.date_of_reservation}
                        </p>
                        <p className="text-gray-600 mb-3">
                            <strong>Total Price:</strong> ₱{reservation.total_price}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={() => handleBookAgain(reservation)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
                            >
                                Book Again
                            </button>
                            <button
                                onClick={() => handleCheckAvailability(reservation.unit_name)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow"
                            >
                                Check Availability
                            </button>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-gray-500">No reservations found.</p>
        )}
    </div>
</div>
        </div>
    );
}

export default AccountInfoPage;
