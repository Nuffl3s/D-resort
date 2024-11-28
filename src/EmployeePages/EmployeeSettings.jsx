import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from '../components/EmployeeSidebar';

function EmployeeSettings() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the stored tokens and navigate to the login page
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_role");
        navigate("/"); // Redirect to login page (you can replace "/" with the actual login route)
    };

    return (
        <div className="flex bg-white dark:bg-[#212121]">
            <EmployeeSidebar />
            <div id="report" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">SETTINGS</h1>
                <div className="p-5 rounded-lg shadow-lg bg-white dark:bg-[#303030]">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Theme</h2>
                    <div className="rounded-md space-y-2 p-6 bg-gray-100 dark:bg-[#676767]">
                        <label className="flex items-center text-gray-800 dark:text-white">
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                className="mr-2"
                            />
                            Light
                        </label>
                        <label className="flex items-center text-gray-800 dark:text-white">
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                className="mr-2"
                            />
                            Dark
                        </label>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="mt-5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-6 py-3 rounded-md bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white hover:to-[#0f8bb1] shadow-lg"
                    >
                        <img
                            src="./src/assets/logout.png"
                            alt="Logout Icon"
                            className="w-5 h-5 mr-2"
                            style={{ filter: "invert(100%)" }}
                        />
                        <span className="text-lg font-semibold">Logout</span>
                    </button>
                  
                </div>
            </div>
        </div>
    );
}

export default EmployeeSettings;
