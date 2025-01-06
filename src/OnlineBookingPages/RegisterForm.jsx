import { useState } from 'react';
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-xl p-12 shadow-2xl border-4 border-white max-w-lg w-full">
                <h2 className="text-4xl font-extrabold text-center text-[#12B1D1] mb-6">Create Your Account</h2>
                <p className="text-center text-lg text-gray-600 mb-4">Create an account to reserve your stay!</p>
                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-5 py-3 border-2 border-[#12B1D1] rounded-lg focus:ring-2 focus:ring-[#12B1D1] transition duration-300 ease-in-out"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-3 border-2 border-[#12B1D1] rounded-lg focus:ring-2 focus:ring-[#12B1D1] transition duration-300 ease-in-out"
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-5 py-3 border-2 border-[#12B1D1] rounded-lg focus:ring-2 focus:ring-[#12B1D1] transition duration-300 ease-in-out"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-3 border-2 border-[#12B1D1] rounded-lg focus:ring-2 focus:ring-[#12B1D1] transition duration-300 ease-in-out"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3 border-2 border-[#12B1D1] rounded-lg focus:ring-2 focus:ring-[#12B1D1] transition duration-300 ease-in-out"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-5 py-3 border-2 border-[#12B1D1] rounded-lg focus:ring-2 focus:ring-[#12B1D1] transition duration-300 ease-in-out"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#12B1D1] to-[#70D8D4] text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 ease-in-out hover:scale-105"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-6 text-center text-gray-600">
                    <p>Already have an account? <Link to="/signin" className="text-[#12B1D1] font-medium hover:text-[#12B1D1]">Login here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
