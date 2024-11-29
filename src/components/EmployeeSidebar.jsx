import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi"; // Importing HiMenuAlt3
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const EmployeeSidebar = () => {
    const navigate = useNavigate();

    const Menus = [
        { title: "Dashboard", path: "EmployeeDash", src: "dashboard" },
        { title: "Reservation", path: "EmployeeReservation", src: "booking" },
        { title: "Product", src: "product" },
        { title: "Report", src: "report" },
        { title: "Settings", path: "EmployeeSettings", src: "settings" },
    ];

    const Submenus = {
        Product: [
            { title: "Add Product", path: "AddProduct", icon: "add-product" },
            { title: "Manage Product", path: "ManageProduct", icon: "manage-product" },
        ],
        Report: [
            { title: "Sales Report", path: "SalesReport", icon: "sales-report" },
            { title: "Booking Report", path: "BookingReport", icon: "report" },
        ],
    };

    const [open, setOpen] = useState(true); // State to toggle sidebar visibility
    const [activeMenu, setActiveMenu] = useState(null); // State to manage active submenu

    const profileImage = null; // Replace with your actual profile image URL
    const displayName = "John Doe"; // Replace with actual user's display name

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
    };

    const handleMenuClick = (menuTitle) => {
        // Toggle submenu visibility
        if (activeMenu === menuTitle) {
            setActiveMenu(null); // Close submenu if it's already active
        } else {
            setActiveMenu(menuTitle); // Open submenu if it's not active
        }
    };

    const handleTempoBtnAdmin = () => {
        navigate('/AdminDash');
    };

    const handleTempoBtnBooking = () => {
        navigate('/booking');
    };

    return (
        <section className="min-h-screen flex flex-row bg-white">
            {/* Sidebar */}
            <div
                className={`bg-[#374151] shadow-lg min-h-screen fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out ${open ? "w-[300px]" : "w-[85px]"}`}
            >
                <div className="w-full">
                    {/* Menu Toggle and Profile */}
                    <div className="py-3 flex justify-between items-center border-b w-full border-gray-400">
                        <div className="flex items-center gap-3 ml-3">
                            <div
                                className={`transition-all duration-300 ease-in-out bg-white rounded-full ${
                                    open ? "w-[70px] h-[70px]" : "w-[40px] h-[40px]"
                                }`}
                            >
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
                                    <h2 className="text-white font-semibold text-md">Employee</h2>
                                    <h1 className="text-white font-bold text-xl">{displayName}</h1>
                                </div>
                            )}
                        </div>

                        <HiMenuAlt3
                            size={26}
                            className="cursor-pointer text-white"
                            onClick={() => setOpen(!open)} // Toggle the sidebar state
                        />
                    </div>

                    {/* Menu Items */}
                    <div className="mt-4 flex flex-col gap-4 relative p-6 justify-center">
                        {Menus.map((menu, i) => (
                            <div key={i}>
                                <div>
                                    {/* Menu Item */}
                                    <Link
                                        to={menu.path ? `/${menu.path}` : "#"}
                                        className={`group flex items-center text-white text-md gap-3.5 font-medium p-2 hover:bg-gray-500 dark:hover:text-[#fafafa] hover:text-white rounded-md relative`}
                                        onClick={() => menu.src && handleMenuClick(menu.title)} // Handle submenu toggle
                                    >
                                        <img
                                            src={`src/assets/${menu.src}.png`} // Add dynamic src for icons
                                            alt={menu.title}
                                            className="w-5 h-5 transition-colors duration-300 invert"
                                        />
                                        <h2
                                            style={{
                                                transitionDelay: `${(i + 1) * 100}ms`,
                                            }}
                                            className={`whitespace-pre ${
                                                open ? "transition-all duration-500 ease-in-out" : ""
                                            } ${!open ? "opacity-0 translate-x-28 overflow-hidden" : ""}`}
                                        >
                                            {menu.title}
                                        </h2>

                                        <h2
                                            className={`${
                                                open && "hidden"
                                            } z-50 absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-[55px] group-hover:duration-300 group-hover:w-fit`}
                                        >
                                            {menu.title}
                                        </h2>

                                        {/* Show arrow icon only when sidebar is open and menu title is fully visible */}
                                        {open && (menu.title === "Product" || menu.title === "Report") && (
                                            <img
                                                src="src/assets/right.png" // Icon for indicating submenu (facing left)
                                                alt="Indicator"
                                                className={`ml-auto w-3 h-3 transition-transform duration-300 invert ${
                                                    activeMenu === menu.title ? "rotate-90" : ""
                                                }`}
                                            />
                                        )}

                                    </Link>

                                    {/* Submenus for Product and Report */}
                                    {activeMenu === menu.title && Submenus[menu.title] && (
                                        <div className="ml-6 pl-4 mt-2 space-y-2">
                                            {Submenus[menu.title].map((submenu, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    to={`/${submenu.path}`}
                                                    className="block text-white text-sm font-medium p-2 hover:bg-gray-500 rounded-md"
                                                >
                                                    {/* Left Line Indicator */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-[2px] h-5 bg-gray-400"></div> {/* Vertical Line */}
                                                        <img
                                                            src={`src/assets/${submenu.icon}.png`} // Add dynamic icon for submenus
                                                            alt={submenu.title}
                                                            className="w-5 h-5 inline-block mr-2 invert"
                                                        />
                                                        {submenu.title}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="flex w-full justify-center relative top-[10px]">
                            <div onClick={handleTempoBtnAdmin} className="flex justify-center items-center gap-1 px-3 py-3 w-[232px] rounded-[5px] shadow-md bg-[#70b8d3] hover:bg-[#09B0EF] cursor-pointer">
                                <img src="./src/assets/logout.png" className="fill-current w-5 h-5" style={{ filter: 'invert(100%)' }} />
                                {open && (
                                    <button className="rounded-md text-white font-semibold tracking-wide cursor-pointer">Tempo to Admin</button>
                                )}
                            </div>
                        </div>

                        <div className="flex w-full justify-center relative top-[10px]">
                            <div onClick={handleTempoBtnBooking} className="flex justify-center items-center gap-1 px-3 py-3 w-[232px] rounded-[5px] shadow-md bg-[#70b8d3] hover:bg-[#09B0EF] cursor-pointer">
                                <img src="./src/assets/logout.png" className="fill-current w-5 h-5" style={{ filter: 'invert(100%)' }} />
                                {open && (
                                    <button className="rounded-md text-white font-semibold tracking-wide cursor-pointer">Tempo to Booking</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-grow transition-all duration-300 ease-in-out ${open ? "ml-[300px]" : "ml-[85px]"}`}>
                {/* Place your main content here */}
            </div>
        </section>
    );
};

export default EmployeeSidebar;
