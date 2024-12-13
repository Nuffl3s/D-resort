import { useState, useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
    const navigate = useNavigate();

    const menus = [
        { title: "Dashboard", src: "src/assets/dashboard.png", path: "/AdminDash" },
        { title: "Employee List", src: "src/assets/add.png", path: "/AdminList" },
        { title: "Attendance", src: "src/assets/calendar.png", path: "/AdminAttendance" },
        { title: "Work Schedules", src: "src/assets/clock.png", path: "/AdminSchedule" },
        { title: "Add Unit", src: "src/assets/add-unit.png", path: "/AdminAddUnit" },
        { title: "Add Product", src: "src/assets/add-product.png", path: "/AddProduct" },
        { title: "Payroll", src: "src/assets/money.png", path: "/AdminPayroll" },
        { title: "Report", src: "src/assets/report.png", path: "/AdminReport" },
        {
            title: "Audit Log",
            src: "src/assets/magnifying.png",
            path: "/AuditLog",
            isSeparated: true,
        },
        { title: "Settings", src: "src/assets/settings.png", path: "/Settings" },
        { title: "Logout", src: "src/assets/logout.png", path: "/" },
    ];

    // Initialize sidebar state with localStorage
    const [open, setOpen] = useState(() => {
        const savedState = localStorage.getItem("sidebarOpen");
        return savedState !== null ? JSON.parse(savedState) : true;
    });

    const profileImage = null; // Profile image (null for now)
    const displayName = "John Doe"; // Display name
    const [isFirstRender, setIsFirstRender] = useState(true); // Check if it's the first render

    useEffect(() => {
        setIsFirstRender(false); // Mark first render as complete
    }, []);

    const toggleSidebar = () => {
        setOpen((prev) => {
            const newState = !prev;
            localStorage.setItem("sidebarOpen", JSON.stringify(newState));
            return newState;
        });
    };

    const handleNavigation = (path) => {
        navigate(path); // Perform navigation without affecting sidebar state
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
    };

    return (
        <section className="min-h-screen flex flex-row bg-white">
            {/* Sidebar */}
            <div
                className={`bg-[#374151] shadow-lg min-h-screen fixed top-0 left-0 z-50 ${
                    open ? "w-[300px]" : "w-[85px]"
                } ${isFirstRender ? "transition-none" : "transition-all duration-300 ease-in-out"}`}
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
                                {/* Display profile or initials */}
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

                        {/* Sidebar Toggle Button */}
                        <HiMenuAlt3
                            size={26}
                            className="cursor-pointer text-white"
                            onClick={toggleSidebar} // Toggle sidebar only when this button is clicked
                        />
                    </div>

                    {/* Menu Items */}
                    <div className="mt-4 flex flex-col gap-4 relative p-6 justify-center">
                        {menus.map((menu, i) => (
                            <div key={i}>
                                {/* Separator for Audit Log */}
                                {menu.isSeparated && <div className="border-t border-gray-400 my-4"></div>}

                                {/* Menu Link */}
                                <Link
                                    to={menu.path}
                                    className="group flex items-center text-white text-md gap-3.5 font-medium p-2 hover:bg-gray-500 dark:hover:text-[#fafafa] hover:text-white rounded-md relative"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default link behavior
                                        handleNavigation(menu.path);
                                    }}
                                >
                                    <img
                                        src={menu.src}
                                        alt={menu.title}
                                        className="w-5 h-5 transition-colors duration-300 invert"
                                    />
                                    <h2
                                        style={{
                                            transitionDelay: `${(i + 1) * 100}ms`,
                                        }}
                                        className={`whitespace-pre ${
                                            open
                                                ? "transition-all duration-500 ease-in-out"
                                                : ""
                                        } ${
                                            !open
                                                ? "opacity-0 translate-x-28 overflow-hidden"
                                                : ""
                                        }`}
                                    >
                                        {menu.title}
                                    </h2>
                                    {/* Tooltip for collapsed state */}
                                    <h2
                                        className={`${
                                            open && "hidden"
                                        } z-50 absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-[55px] group-hover:duration-300 group-hover:w-fit`}
                                        style={!open ? { pointerEvents: "none" } : {}}
                                    >
                                        {menu.title}
                                    </h2>
                                </Link>
                            </div>
                        ))}

                        {/* Tempo Button */}
                        <div className="flex w-full justify-center relative top-[10px]">
                            <div
                                onClick={() => handleNavigation("/EmployeeDash")}
                                className="flex justify-center items-center gap-1 px-3 py-3 w-[232px] rounded-[5px] shadow-md bg-[#70b8d3] hover:bg-[#09B0EF] cursor-pointer"
                            >
                                <img
                                    src="./src/assets/logout.png"
                                    className="fill-current w-5 h-5"
                                    style={{ filter: "invert(100%)" }}
                                />
                                {open && (
                                    <button className="rounded-md text-white font-semibold tracking-wide cursor-pointer">
                                        Tempo to Employee
                                    </button>
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

export default AdminSidebar;
