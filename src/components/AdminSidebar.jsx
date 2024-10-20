import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminSidebar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const handleMenuClick = (src) => {
        setActiveMenu(src);
        localStorage.setItem("activeMenu", src);
        navigate(`/${src}`);
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleTempoBtn = () => {
        navigate('/EmployeeDash');
    };

    const Menus = [
        { title: "Dashboard", src: "AdminDash", path: "dashboard" },
        { title: "Register Employee", src: "AdminRegister", path: "add" },
        { title: "Employee List", src: "AdminList", path: "group" },
        { title: "Attendance", src: "AdminAttendance", path: "calendar" },
        { title: "Work Schedules", src: "AdminSchedule", path: "clock" },
        { title: "Report", src: "AdminReport", path: "report" },
        { title: "Payroll", src: "AdminPayroll", path: "money" },
        { title: "Audit Log", src: "AuditLog", path: "magnifying", isSeparated: true }, // Added custom key
        { title: "Settings", src: "Settings", path: "settings" },
    ];

    return (
        <div className="min-h-screen flex flex-row bg-white">
            <div className={`${open ? "w-[330px]" : "w-[110px]"} duration-300 h-screen bg-white relative shadow-lg`}>
                <img
                    src="./src/assets/control.png"
                    className={`absolute cursor-pointer rounded-full right-[-13px] top-[50px] w-7 ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                    alt="Toggle Sidebar"
                />

                <div className="flex gap-x-5 items-center bg-gradient-to-r from-[#1089D3] to-[#12B1D1] w-full p-5 shadow-md">
                    <img
                        src="./src/assets/logo.png"
                        className={`cursor-pointer duration-500 w-20 ${!open && "rotate-[360deg]"}`}
                        alt="Logo"
                    />
                    <h1 className={`text-white origin-left font-bold text-xl duration-300 ${!open && "scale-0"}`}>D.YASAY BEACH RESORT</h1>
                </div>

                <ul className="flex flex-col pt-6 p-8 mt-3">
                    {Menus.map((menu, index) => (
                        <li
                            key={index}
                            className={`mb-2 ${menu.isSeparated ? 'border-t border-gray-300 mt-4 pt-4' : ''}`}
                        >
                            <Link
                                to={`/${menu.src}`} // Use Link for navigation
                                className={`menu-item ${activeMenu === menu.src ? "active" : "inactive"}`}
                                onClick={() => handleMenuClick(menu.src)}
                            >
                                <span className="inline-flex items-center justify-center h-12 w-12 text-lg">
                                    <img
                                        src={`./src/assets/${menu.path}.png`}
                                        className={`w-5 h-5 ${!open ? "minimized-zoom" : ""}`}
                                        alt={menu.title}
                                    />
                                </span>
                                <span className={`text-md ml-1 font-semibold ${!open && "hidden"}`}>{menu.title}</span>
                            </Link>
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
