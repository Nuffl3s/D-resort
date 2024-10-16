import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
function Header({ isMainPage }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false); // State to manage the mobile menu visibility

    const handleHome = () => {
        navigate('/booking');
    };

    const handleAboutUs = () => {
        navigate('/about-us');
    };

    const handleBook = () => {
        navigate('/book');
    };

    return (
        <header className={`w-full ${isMainPage ? 'absolute' : 'relative'} z-20 ${isMainPage ? 'bg-transparent' : 'bg-gradient-to-r from-[#1089D3] to-[#12B1D1] mb-10'}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center p-3 px-8">
                <div className="flex items-center space-x-3">
                    <img src="./src/assets/logo.png" alt="logo" className="w-16 h-16" />
                    {/* Logo text hidden on mobile */}
                    <h1 className="hidden md:block text-[35px] font-bold font-lemon cursor-pointer text-white">
                        <Link to="/booking">D.Yasay Resort</Link>
                    </h1>
                </div>
                
                <div className="relative">
                    {/* Navigation buttons visible only on larger screens */}
                    <div className="hidden md:flex space-x-4 items-center">
                        <button onClick={handleHome} className="shadow-sm border hover:bg-gray-100 hover:text-gray-600 text-white font-semibold px-4 py-2 rounded-lg">
                            Home
                        </button>
                        <button onClick={handleAboutUs} className="shadow-sm border hover:bg-gray-100 hover:text-gray-600 text-white font-semibold px-4 py-2 rounded-lg">
                            About Us
                        </button>
                        {isMainPage && (
                            <button onClick={handleBook} className="shadow-sm border hover:bg-gray-100 hover:text-gray-600 text-white font-semibold px-4 py-2 rounded-lg">
                                Book
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button 
                        className="md:hidden text-white" 
                        onClick={() => setMenuOpen(!menuOpen)} aria-controls="drawer-navigation" data-drawer-target="drawer-navigation">
                        <span className="material-icons"><img src="/src/assets/menu.png" alt="" className='w-8 h-8' style={{ filter: 'invert(100%)' }}/></span>
                    </button>

                    {/* Drawer component */}
                    <div id="drawer-navigation" className={`drawer fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-gray-800`} tabIndex="-1" aria-labelledby="drawer-navigation-label">
                        <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
                        <button type="button" onClick={() => setMenuOpen(false)} aria-controls="drawer-navigation" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                            <span className="sr-only">Close menu</span>
                        </button>
                        <div className="py-4 overflow-y-auto">
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <a href="#" onClick={handleHome} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <span className="ms-3">Home</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={handleAboutUs} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <span className="ms-3">About Us</span>
                                    </a>
                                </li>
                                {isMainPage && (
                                    <li>
                                        <a href="#" onClick={handleBook} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="ms-3">Book</span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
