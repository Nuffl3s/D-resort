import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeSidebar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(
        JSON.parse(localStorage.getItem("sidebarOpen")) ?? true
    );
    const [activeMenu, setActiveMenu] = useState(
        localStorage.getItem("activeMenu") || "dashboard"
    );
    const [hoveredMenu, setHoveredMenu] = useState(null);

    // For handling the submenus of Product and Report menus
    const [productMenuOpen, setProductMenuOpen] = useState(false); // Track Product menu state
    const [reportMenuOpen, setReportMenuOpen] = useState(false); // Track Report menu state

    const toggleSidebar = () => {
        const newState = !open;
        setOpen(newState);
        localStorage.setItem("sidebarOpen", JSON.stringify(newState));
    };

    const handleMenuClick = (src, path) => {
        setActiveMenu(path); // Update the active menu when any menu is clicked
        localStorage.setItem("activeMenu", path);
        navigate(`/${path}`);
    };

    const toggleMenu = (menuType) => {
        if (menuType === "Product") {
            setProductMenuOpen(!productMenuOpen);
            setActiveMenu("Product");
        } else if (menuType === "Report") {
            setReportMenuOpen(!reportMenuOpen);
            setActiveMenu("Report");
        }
    };

    const handleSubmenuClick = (menuType, submenuPath) => {
        if (menuType === "Product") {
            navigate(`/${submenuPath}`);
        } else if (menuType === "Report") {
            navigate(`/${submenuPath}`);
        }
    };

    const Menus = [
        { title: "Dashboard", path: "EmployeeDash", src: "dashboard" },
        { title: "Reservation", path: "EmployeeReservation", src: "booking" },
        { title: "Product", src: "product" }, 
        { title: "Report", src: "report" },
        { title: "Settings", path:"EmployeeSettings", src: "settings" }, 
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

    return (
        <div className="min-h-screen flex flex-row bg-white">
            {/* Sidebar */}
            <div className={`${open ? "w-[300px]" : "w-[110px]"} transition-all duration-300 h-screen bg-white relative shadow-lg`}>
            {/* Sidebar Toggle Button */}
                <div className="relative">
                    {/* Sidebar Toggle Button */}
                    <img
                        src="./src/assets/control.png"
                        alt="Toggle Sidebar"
                        className={`absolute cursor-pointer rounded-full right-[-13px] top-[50px] w-7 transform transition-transform duration-500 ${!open && "rotate-180"}`}
                        onClick={toggleSidebar}
                    />

                    {/* Logo Section */}
                    <div className="flex gap-x-5 items-center bg-gradient-to-r from-[#1089D3] to-[#12B1D1] w-full p-5 shadow-md">
                        <img
                            src="./src/assets/logo.png"
                            className={`cursor-pointer duration-500 w-20 transform transition-transform ${!open ? "rotate-[360deg]" : "rotate-0"}`}
                            alt="Logo"
                        />
                        <h1 className={`text-white origin-left font-bold text-xl duration-300 ${!open && "scale-0"}`}>
                            D.YASAY BEACH RESORT
                        </h1>
                    </div>
                </div>

                {/* Sidebar Menu */}
                <ul className="flex flex-col pt-6 p-8 mt-3">
                    {Menus.map((menu, index) => (
                        <li
                            key={index}
                            className={`mb-2`}
                            onMouseEnter={() => setHoveredMenu(menu.path)}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            {["Product", "Report"].includes(menu.title) ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(menu.title)} // Toggle the menu
                                        className={`menu-item 
                                            ${menu.title === "Product" && (productMenuOpen || activeMenu === "Product") ? "w-full bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white" : ""} 
                                            ${menu.title === "Report" && (reportMenuOpen || activeMenu === "Report") ? "w-full bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white" : ""}
                                            ${hoveredMenu === menu.path ? "w-full hover:bg-gradient-to-r from-[#1089D3] to-[#12B1D1] hover:text-white" : ""} 
                                            rounded-md flex items-center gap-x-2`}
                                    >
                                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg">
                                            <img
                                                src={`./src/assets/${menu.src}.png`}
                                                alt={menu.title}
                                                className={`w-5 h-5`}
                                                style={{
                                                    filter:
                                                        hoveredMenu === menu.path ||
                                                        activeMenu === menu.title ||
                                                        (menu.title === "Product" && productMenuOpen) ||
                                                        (menu.title === "Report" && reportMenuOpen)
                                                            ? "invert(100%)"
                                                            : "none", // Highlight icon when active/hovered
                                                }}
                                            />
                                        </span>
                                        {open && <span className="text-md font-semibold">{menu.title}</span>}
                                        {open && (
                                            <span className="inline-flex items-center justify-end ml-[60px] h-12 w-12">
                                                <img
                                                    src="./src/assets/down.png"
                                                    alt="Down Icon"
                                                    className="w-5 h-5 transition-transform duration-300"
                                                    style={{
                                                        transform:
                                                            (menu.title === "Product" && productMenuOpen) ||
                                                            (menu.title === "Report" && reportMenuOpen)
                                                                ? "rotate(180deg)"
                                                                : "rotate(0deg)",
                                                        filter:
                                                            hoveredMenu === menu.path ||
                                                            activeMenu === menu.title ||
                                                            (menu.title === "Product" && productMenuOpen) ||
                                                            (menu.title === "Report" && reportMenuOpen)
                                                                ? "invert(100%)"
                                                                : "none",
                                                    }}
                                                />
                                            </span>
                                        )}
                                    </button>

                                    {/* Submenus */}
                                    {(menu.title === "Product" && productMenuOpen) ||
                                    (menu.title === "Report" && reportMenuOpen) ? (
                                        <ul
                                            className={`pl-6 mt-4 ${!open ? "absolute left-[120px] transition-all duration-300 w-[220px] p-3 shadow-md bg-white rounded-md z-50" : "relative"}`}
                                        >
                                            {Submenus[menu.title].map((submenu, idx) => (
                                                <li key={idx}>
                                                    <button
                                                        onClick={() => handleSubmenuClick(menu.title, submenu.path)}
                                                        className={`menu-item mt-3 w-full hover:bg-gray-200 rounded-md`}
                                                    >
                                                        <span className="inline-flex items-center justify-center h-12 w-12 text-lg">
                                                            <img
                                                                src={`./src/assets/${submenu.icon}.png`}
                                                                alt={submenu.title}
                                                                className="w-5 h-5"
                                                            />
                                                        </span>
                                                        {submenu.title}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </>
                            ) : (
                                <button
                                    onClick={() => handleMenuClick(menu.src, menu.path)}
                                    className={`menu-item 
                                        ${activeMenu === menu.path ? "w-full bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white" : ""} 
                                        ${hoveredMenu === menu.path ? "w-full hover:bg-gradient-to-r from-[#1089D3] to-[#12B1D1] hover:text-white" : ""} 
                                        rounded-md flex items-center gap-x-2`}
                                >
                                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg">
                                        <img
                                            src={`./src/assets/${menu.src}.png`}
                                            alt={menu.title}
                                            className={`w-5 h-5`}
                                            style={{
                                                filter:
                                                    hoveredMenu === menu.path || activeMenu === menu.path
                                                        ? "invert(100%)"
                                                        : "none",
                                            }}
                                        />
                                    </span>
                                    {open && <span className="text-md font-semibold">{menu.title}</span>}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default EmployeeSidebar;
