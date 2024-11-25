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

    // For handling the submenus of the Product menu
    const [productMenuOpen, setProductMenuOpen] = useState(false); // Track Product menu state
    const [productSubmenuOpen, setProductSubmenuOpen] = useState(null); // Track specific submenu open state

    // Fetch stored profile image and sidebar state on mount
   

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

    const Menus = [
        { title: "Dashboard", path: "EmployeeDash", src: "dashboard" },
        { title: "Reservation", path: "EmployeeReservation", src: "booking" },
        { title: "Product", path: "Product", src: "product" },
        { title: "Sales Report", path: "EmployeeReport", src: "report" },
    ];


    const handleLogout = () => {
        navigate('/');
    };

    const handleTempoBtnToAdmin = () => {
        navigate('/AdminDash');
    };

    const handleTempoBtnToBooking = () => {
        navigate('/booking');
    };

    const toggleProductMenu = () => {
        setProductMenuOpen(!productMenuOpen);
        if (!productMenuOpen) {
            setActiveMenu("Product"); 
        } else {
            setActiveMenu(""); 
        }
    };

    // Handle submenu click and keep the submenu open
    const handleSubmenuClick = (submenu) => {
        if (submenu === "submenu1") {
            setProductSubmenuOpen("submenu1");  // Keep submenu open
            setActiveMenu("Product");  // Ensure the "Product" menu remains active
            navigate("/AddProduct");
        } else if (submenu === "submenu2") {
            setProductSubmenuOpen("submenu2");  // Keep submenu open
            setActiveMenu("Product");  // Ensure the "Product" menu remains active
            navigate("/ManageProduct");
        }
    };
    
    
    return (
        <div className="min-h-screen flex flex-row bg-white">
            {/* Sidebar */}
            <div
                className={`${open ? "w-[300px]" : "w-[110px]"} duration-300 h-screen bg-white relative shadow-lg`}
            >
                {/* Sidebar Toggle Button */}
                <img
                    src="./src/assets/control.png"
                    alt="Toggle Sidebar"
                    className={`absolute cursor-pointer rounded-full right-[-13px] top-[50px] w-7 ${!open && "rotate-180"}`}
                    onClick={toggleSidebar}
                />

                {/* Employee Profile Section */}
                <div className="flex gap-x-5 items-center bg-gradient-to-r from-[#1089D3] to-[#12B1D1] w-full p-5 shadow-md">
                    <img
                        src="./src/assets/control.png"
                        className={`absolute cursor-pointer rounded-full right-[-13px] top-[50px] w-7 ${!open && "rotate-180"}`}
                        onClick={() => setOpen(!open)}
                        alt="Toggle Sidebar"
                    />

                    <img
                        src="./src/assets/logo.png"
                        className={`cursor-pointer duration-500 w-20 ${!open && "rotate-[360deg]"}`}
                        alt="Logo"
                    />
                    <h1 className={`text-white origin-left font-bold text-xl duration-300 ${!open && "scale-0"}`}>
                        D.YASAY BEACH RESORT
                    </h1>
                </div>

                {/* Sidebar Menu */}
                <ul className="flex flex-col pt-6 p-8 mt-3">
                    {Menus.map((menu, index) => (
                        <li
                            key={index}
                            className={`mb-2 ${menu.isSeparated ? "border-t border-gray-300 mt-4 pt-4" : ""}`}
                            onMouseEnter={() => setHoveredMenu(menu.path)}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            {menu.src === "product" ? (
                                <>
                                   <button
                                        onClick={toggleProductMenu}  // Toggle the product menu
                                        className={`menu-item 
                                            ${productMenuOpen || activeMenu === "Product" ? "w-full bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white" : ""} 
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
                                                        hoveredMenu === menu.path || activeMenu === "Product" || productMenuOpen
                                                            ? "invert(100%)"
                                                            : "none", 
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
                                                        transform: productMenuOpen ? "rotate(180deg)" : "rotate(0deg)", 
                                                        filter:
                                                            hoveredMenu === menu.path || activeMenu === "Product" || productMenuOpen
                                                                ? "invert(100%)"
                                                                : "none", 
                                                    }}
                                                />
                                            </span>
                                        )}
                                    </button>

                                    {/* Product Submenus (Only outside sidebar when minimized) */}
                                    {productMenuOpen && (
                                        <ul className={`pl-6 mt-4 ${!open ? "absolute left-[120px] top-[250px] transition-all duration-300 w-[220px] p-3 shadow-md bg-white rounded-md z-50" : "relative"}`}>
                                            <li>
                                                <button
                                                    onClick={() => handleSubmenuClick("submenu1")}
                                                    className={`menu-item mt-3 w-full
                                                        ${productSubmenuOpen === "submenu1" ? "bg-gray-300 text-black" : ""} 
                                                        hover:bg-gray-200`}
                                                >
                                                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg">
                                                        <img
                                                            src={`./src/assets/add-product.png`}
                                                            alt="Add Product"
                                                            className="w-5 h-5"
                                                        />
                                                    </span>
                                                    Add Product
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => handleSubmenuClick("submenu2")}
                                                    className={`menu-item mt-1 w-full
                                                        ${productSubmenuOpen === "submenu2" ? "bg-gray-300 text-black" : ""} 
                                                        hover:bg-gray-200`}
                                                >
                                                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg">
                                                        <img
                                                            src={`./src/assets/manage-product.png`}
                                                            alt="Manage Product"
                                                            className="w-5 h-5"
                                                        />
                                                    </span>
                                                    Manage Product
                                                </button>
                                            </li>
                                        </ul>
                                    )}
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

                    {/* Logout Button */}
                    <div className="flex w-full justify-center relative top-[500px]">
                        <div onClick={handleLogout} className="flex justify-center items-center gap-1 px-3 py-3 w-[232px] rounded-[5px] shadow-md bg-gradient-to-r from-[#1089D3] to-[#12B1D1] hover:to-[#0f8bb1] cursor-pointer">
                            <img src="./src/assets/logout.png" className="fill-current w-5 h-5" style={{ filter: 'invert(100%)' }} />
                            {open && (
                                <button className="rounded-md text-white font-sans font-semibold tracking-wide cursor-pointer">Logout</button>
                            )}
                        </div>
                    </div>

                    {/* Tempo Button */}
                    <div className="flex w-full justify-center relative top-[300px]">
                        <div onClick={handleTempoBtnToBooking} className="flex justify-center items-center gap-1 px-3 py-3 w-[232px] rounded-[5px] shadow-md bg-[#70b8d3] hover:bg-[#09B0EF] cursor-pointer">
                            <img src="./src/assets/logout.png" className="fill-current w-5 h-5" style={{ filter: 'invert(100%)' }} />
                            {open && (
                                <button className="rounded-md text-white font-semibold tracking-wide cursor-pointer">Tempo to Booking</button>
                            )}
                        </div>
                    </div>

                    {/* Tempo Button */}
                    <div className="flex w-full justify-center relative top-[200px]">
                        <div onClick={handleTempoBtnToAdmin} className="flex justify-center items-center gap-1 px-3 py-3 w-[232px] rounded-[5px] shadow-md bg-[#70b8d3] hover:bg-[#09B0EF] cursor-pointer">
                            <img src="./src/assets/logout.png" className="fill-current w-5 h-5" style={{ filter: 'invert(100%)' }} />
                            {open && (
                                <button className="rounded-md text-white font-semibold tracking-wide cursor-pointer">Tempo to Admin</button>
                            )}
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default EmployeeSidebar;