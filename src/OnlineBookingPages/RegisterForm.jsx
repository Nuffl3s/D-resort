import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Swal from 'sweetalert2'; // Import SweetAlert
import api from "../api";

function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            Swal.fire("Error", "Passwords do not match!", "error");
            return;
        }

        setLoading(true);

        try {
            await api.post('/customer/register/', {
                username,
                name,
                phone_number: phoneNumber,
                email,
                password,
            });
            Swal.fire("Success", "Account created successfully!", "success").then(() => {
                navigate('/signin');
            });
        } catch (error) {
            console.error("Registration error details:", error.response?.data || error);
            if (error.response?.data?.email) {
                Swal.fire("Error", `Email Error: ${error.response.data.email.join(", ")}`, "error");
            } else {
                Swal.fire("Error", "Registration failed. Please try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
            <div className="bg-white rounded-3xl p-10 shadow-lg border-4 border-white max-w-lg w-full">
                <h2 className="text-3xl font-black text-center text-blue-500 mb-6">Sign Up</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center text-gray-500">
                    Already have an account? <Link to="/login" className="text-blue-500">Login here</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
