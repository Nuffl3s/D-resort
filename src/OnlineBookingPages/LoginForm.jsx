import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/customer/login/', { username, password });

            // Store the access and refresh tokens
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

            // Redirect to the booking page
            navigate('/booking');
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-3xl p-10 shadow-lg border-4 border-white max-w-lg w-full">
                <h2 className="text-3xl font-black text-center text-[#12B1D1] mb-6">Log In</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-[#12B1D1] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#12B1D1] placeholder-gray-400"
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-[#12B1D1] rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#12B1D1] placeholder-gray-400"
                        placeholder="Password"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#12B1D1] to-[#70D8D4] text-white font-bold py-3 rounded-lg shadow transform transition hover:scale-105"
                    >
                        Log In
                    </button>
                </form>
                <div className="mt-4 text-center text-gray-500">
                    Don't have an account? <Link to="/register" className="text-[#12B1D1] font-semibold">Sign up here</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
