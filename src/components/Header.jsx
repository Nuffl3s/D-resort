import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header({ isMainPage }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false); // State to manage the mobile menu visibility
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const userType = localStorage.getItem('user_type'); // Retrieve user type from localStorage

    const handleLogout = () => {
        // Clear tokens or user data from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_type');

        // Redirect based on user type
        if (userType === 'customer') {
            navigate('/signin');
        } else {
            navigate('/signin');
        }
    };

    const handleHome = () => {
        navigate('/booking');
    };

    const handleAccount = () => {
        navigate('/AccountDetails');
    };    

    const handleBook = () => {
        navigate('/book');
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) setMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className={`w-full ${isMainPage ? 'absolute' : 'relative'} z-20 ${isMainPage ? 'bg-transparent' : 'bg-gradient-to-r from-[#1089D3] to-[#12B1D1] mb-10'}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center p-3 px-8">
                <div className="flex items-center space-x-3">
                    <img src="./src/assets/logo.png" alt="logo" className="w-16 h-16" />
                    <h1 className="hidden md:block text-[35px] font-bold font-lemon cursor-pointer text-white">
                        <Link to="/booking">D.Yasay Resort</Link>
                    </h1>
                </div>

                <div className="relative">
                    {isMobile ? (
                        <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
                            <img src="/src/assets/menu.png" alt="" className='w-8 h-8' style={{ filter: 'invert(100%)' }} />
                        </button>
                    ) : (
                        <div className="flex space-x-4 items-center">
                            <button onClick={handleLogout} className="shadow-sm border hover:bg-gray-100 hover:text-gray-600 text-white font-semibold px-4 py-2 rounded-lg">
                                Logout
                            </button>
                            <button onClick={handleHome} className="shadow-sm border hover:bg-gray-100 hover:text-gray-600 text-white font-semibold px-4 py-2 rounded-lg">
                                Home
                            </button>
                            <button onClick={handleAccount} className="shadow-sm border hover:bg-gray-100 hover:text-gray-600 text-white font-semibold px-4 py-2 rounded-lg">
                                Account Details
                            </button>
                                <button onClick={handleBook} className="shadow-sm border hover:bg-gray-100 hover:text-gray-600 text-white font-semibold px-4 py-2 rounded-lg">
                                    Reserve
                                </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
