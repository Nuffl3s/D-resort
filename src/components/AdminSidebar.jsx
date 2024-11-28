import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function AdminSidebar({ displayName: propDisplayName }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(
        JSON.parse(localStorage.getItem("sidebarOpen")) ?? true
    );
    const [activeMenu, setActiveMenu] = useState(
        localStorage.getItem("activeMenu") || "dashboard"
    );
    const [profileImage, setProfileImage] = useState(null);
    const [hoveredMenu, setHoveredMenu] = useState(null);

    // State for displayName
    const [displayName, setDisplayName] = useState(
        propDisplayName || localStorage.getItem("displayName") || "Admin"
    );

    // Function to extract initials from the display name
    const getInitials = (name) => {
        if (!name) return ''; // Handle null, undefined, or empty strings
        const nameParts = name.trim().split(' ').filter(Boolean); // Split and filter empty parts
        const initials = nameParts
            .map(part => part.charAt(0).toUpperCase())
            .join('');
        return initials;
    };

    // Fetch profile picture and displayName from localStorage on mount
    useEffect(() => {
        const savedProfilePicture = localStorage.getItem("profilePicture");
        if (savedProfilePicture) {
            setProfileImage(savedProfilePicture);
        }

        const savedDisplayName = localStorage.getItem("displayName");
        if (!propDisplayName && savedDisplayName) {
            setDisplayName(savedDisplayName);
        }

        // Function to handle localStorage changes
        const handleStorageChange = (event) => {
            if (event.key === "profilePicture") {
                const updatedProfilePicture = event.newValue;
                setProfileImage(updatedProfilePicture || null);
            }
            if (event.key === "displayName") {
                setDisplayName(event.newValue || "Admin");
            }
        };

        // Add event listener for localStorage changes across tabs
        window.addEventListener("storage", handleStorageChange);

        // Cleanup event listener when component unmounts
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [propDisplayName]); // Run on mount and when propDisplayName changes

    const toggleSidebar = () => {
        const newState = !open;
        setOpen(newState);
        localStorage.setItem("sidebarOpen", JSON.stringify(newState));
    };

    const handleMenuClick = (src, path) => {
        setActiveMenu(path);
        localStorage.setItem("activeMenu", path);
        navigate(`/${path}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_role");
        navigate('/');
    };

    const handleTempoBtn = () => {
        navigate('/EmployeeDash');
    };

    const Menus = [
        { title: "Dashboard", src: "dashboard", path: "AdminDash" },
        { title: "Employee Management", src: "add", path: "AdminManagement" },
        { title: "Attendance", src: "calendar", path: "AdminAttendance" },
        { title: "Work Schedules", src: "clock", path: "AdminSchedule" },
        { title: "Payroll", src: "money", path: "AdminPayroll" },
        { title: "Add Unit", src: "add-unit", path: "AdminAddUnit" },
        { title: "Report", src: "report", path: "AdminReport" },
        { title: "Audit Log", src: "magnifying", path: "AuditLog", isSeparated: true },
        { title: "Settings", src: "settings", path: "Settings" },
    ];

    return (
        <div className="min-h-screen flex flex-row bg-white">
            <div
                className={`${
                    open ? "w-[300px]" : "w-[110px]"
                } transition-all duration-300 h-screen bg-white relative shadow-lg dark:bg-[#1a1a1a]`}
            >
                <img
                    src="./src/assets/control.png"
                    alt="Toggle Sidebar"
                    className={`absolute cursor-pointer rounded-full right-[-13px] top-[50px] w-7 ${!open && "rotate-180"}`}
                    onClick={toggleSidebar}
                />
                <div className="flex gap-x-5 items-center bg-gradient-to-r from-[#1089D3] to-[#12B1D1] w-full p-5 shadow-md">
                    <div className="w-[70px] h-[70px] rounded-full bg-white flex justify-center items-center">
                        {/* Display either profile image or initials */}
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-400 text-white flex items-center justify-center rounded-full font-bold">
                                {getInitials(displayName)}
                            </div>
                        )}
                    </div>
                    {open && (
                        <div className="flex flex-col">
                            <h2 className="text-white font-semibold text-md">Admin</h2>
                            <h1 className="text-white font-bold text-xl">{displayName}</h1>
                        </div>
                    )}
                </div>

                <ul className="flex flex-col pt-6 p-8 mt-3">
                    {Menus.map((menu, index) => (
                        <li
                            key={index}
                            className={`mb-2 ${menu.isSeparated ? "border-t border-gray-300 mt-4 pt-4" : ""}`}
                            onMouseEnter={() => setHoveredMenu(menu.path)}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            <button
                                onClick={() => handleMenuClick(menu.src, menu.path)}
                                className={`menu-item ${activeMenu === menu.path ? "w-full bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white" : ""} ${hoveredMenu === menu.path ? "w-full hover:bg-gradient-to-r from-[#1089D3] to-[#12B1D1] hover:text-[#fafafa] dark:hover:text-[#fafafa]" : ""} rounded-md flex items-center gap-x-2 dark:text-[#fafafa] `}
                            >
                                <span className="inline-flex items-center justify-center h-12 w-12 text-lg">
                                    <img
                                        src={`./src/assets/${menu.src}.png`}
                                        alt={menu.title}
                                        className={`w-5 h-5 dark:invert ${
                                            hoveredMenu === menu.path || activeMenu === menu.path ? "invert" : ""
                                        }`}
                                    />
                                </span>
                            
                                {open && <span className="text-md font-semibold">{menu.title}</span>}
                            </button>
                        </li>
                    ))}

                    <div className="flex w-full justify-center relative top-[200px]">
                        <div onClick={handleLogout} className="flex justify-center items-center gap-1 px-3 py-3 w-[232px] rounded-[5px] shadow-md bg-gradient-to-r from-[#1089D3] to-[#12B1D1] hover:to-[#0f8bb1] cursor-pointer">
                            <img src="./src/assets/logout.png" className="fill-current w-5 h-5" style={{ filter: 'invert(100%)' }} />
                            {open && (
                                <button className="rounded-md text-white font-sans font-semibold tracking-wide cursor-pointer">Logout</button>
                            )}
                        </div>
                    </div>

                    <div className="flex w-full justify-center relative top-[100px]">
                        <div onClick={handleTempoBtn} className="flex justify-center items-center gap-1 px-3 py-3 w-[232px] rounded-[5px] shadow-md bg-[#70b8d3] hover:bg-[#09B0EF] cursor-pointer">
                            <img src="./src/assets/logout.png" className="fill-current w-5 h-5" style={{ filter: 'invert(100%)' }} />
                            {open && (
                                <button className="rounded-md text-white font-semibold tracking-wide cursor-pointer">Tempo to Employee</button>
                            )}
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default AdminSidebar;
