import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const EmployeeSidebar = () => {
    const navigate = useNavigate();

    const Menus = [
        { title: "Dashboard", path: "EmployeeDash", src: "dashboard" },
        { title: "Reservation", path: "EmployeeReservation", src: "booking" },
        { title: "Product", src: "product" },
        { title: "Report", src: "report" },
        { title: "Logout", src: "logout", path: "login",  isSeparated: true, },
    ];

    const Submenus = {
        Product: [
            { title: "Product List", path: "ProductList", icon: "list" },
            { title: "Manage Product", path: "ManageProduct", icon: "manage-product" },
        ],
        Report: [
            { title: "Sales Report", path: "SalesReport", icon: "sales-report" },
            { title: "Booking Report", path: "BookingReport", icon: "report" },
        ],
    };

    // Sidebar open/close state with localStorage
    const [open, setOpen] = useState(() => {
        const savedState = localStorage.getItem("sidebarOpen");
        return savedState !== null ? JSON.parse(savedState) : true;
    });
    const [activeMenu, setActiveMenu] = useState(null); // Track active submenu

    const displayName = "D.YASAY BEACH RESORT"; // Placeholder for display name

    const toggleSidebar = () => {
        setOpen((prev) => {
            const newState = !prev;
            localStorage.setItem("sidebarOpen", JSON.stringify(newState));
            return newState;
        });
    };

    const handleMenuClick = (menuTitle) => {
        if (activeMenu === menuTitle) {
            setActiveMenu(null); // Close the submenu if clicked again
        } else {
            setActiveMenu(menuTitle); // Open the submenu
        }
    };

    const handleNavigation = (path) => {
        navigate(`/${path}`);
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
                className={`bg-[#374151] shadow-lg min-h-screen fixed top-0 left-0 z-50 ${
                    open ? "w-[300px]" : "w-[85px]"
                } transition-all duration-300 ease-in-out`}
            >
                <div className="w-full">
                    {/* Menu Toggle and Profile */}
                    <div className="py-3 flex justify-between items-center border-b w-full border-gray-400">
                        <div className="flex items-center gap-3 ml-3">
                            <div
                                className={`transition-all duration-300 ease-in-out bg-white rounded-full ${
                                    open ? "w-[60px] h-[60px]" : "w-[40px] h-[40px]"
                                }`}
                            >
                                {/* Logo Image */}
                                <img
                                    src="./src/assets/logo.png" // Path to the logo image
                                    alt="Logo"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>

                            {open && (
                                <div className="flex flex-col">
                                    <h1 className="text-white font-bold text-[17px]">{displayName}</h1> 
                                </div>
                            )}
                        </div>

                        <HiMenuAlt3
                            size={26}
                            className="cursor-pointer text-white"
                            onClick={toggleSidebar} // Toggle the sidebar state when clicked
                        />
                    </div>

                    {/* Menu Items */}
                    <div className="mt-4 flex flex-col gap-4 relative p-6 justify-center">
                        {Menus.map((menu, i) => (
                            <div key={i}>
                                {/* Menu Link */}
                                {menu.isSeparated && <div className="border-t border-gray-400 my-4"></div>}
                                
                                <div>
                                    <Link
                                        to={menu.path ? `/${menu.path}` : "#"}
                                        className="group flex items-center text-white text-md gap-3.5 font-medium p-2 hover:bg-gray-500 dark:hover:text-[#fafafa] hover:text-white rounded-md relative"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent link default behavior
                                            if (menu.path) {
                                                handleNavigation(menu.path); // Navigate if path exists
                                            } else {
                                                handleMenuClick(menu.title); // Toggle submenu
                                            }
                                        }}
                                    >
                                        <img
                                            src={`src/assets/${menu.src}.png`} // Dynamic src for menu icons
                                            alt={menu.title}
                                            className="w-5 h-5 transition-colors duration-300 invert"
                                        />
                                        <h2
                                            className={`whitespace-pre ${
                                                open
                                                    ? "transition-all duration-500 ease-in-out"
                                                    : ""
                                            } ${!open ? "opacity-0 translate-x-28 overflow-hidden" : ""}`}
                                        >
                                            {menu.title}
                                        </h2>

                                        {open && (menu.title === "Product" || menu.title === "Report") && (
                                            <img
                                                src="src/assets/right.png" // Right arrow for indicating submenu
                                                alt="Indicator"
                                                className={`ml-auto w-3 h-3 transition-transform duration-300 invert ${
                                                    activeMenu === menu.title ? "rotate-90" : ""
                                                }`}
                                            />
                                        )}
                                    </Link>

                                    {/* Submenu for Product and Report */}
                                    {activeMenu === menu.title && Submenus[menu.title] && (
                                        <div
                                            className={`ml-6 pl-4 mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                                                open
                                                    ? ""
                                                    : menu.title === "Product"
                                                    ? "absolute left-[65px] top-[140px] w-[210px] p-2 bg-[#374151] border rounded-md shadow-lg"
                                                    : "absolute left-[65px] top-[190px] w-[200px] p-2 bg-[#374151] border rounded-md shadow-lg"
                                            }`}
                                        >
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

                        {/* Tempo Button to Employee Dashboard */}
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
            <div
                className={`flex-grow transition-all duration-300 ease-in-out ${
                    open ? "ml-[300px]" : "ml-[85px]"
                }`}
            >
                {/* Main content goes here */}
            </div>
        </section>
    );
};

export default EmployeeSidebar;
