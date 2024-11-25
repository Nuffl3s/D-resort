import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

function AuditLog() {
    const [selectedOption, setSelectedOption] = useState("All");
    const [selectedDateRange, setSelectedDateRange] = useState("Today");
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false); 

    // Mock data for each filter
    const mockData = {
        Registration: [
            { name: 'John Doe', date: '2024-10-19', time: '10:30 AM' },
            { name: 'Jane Smith', date: '2024-10-18', time: '11:15 AM' },
        ],
        Attendance: [
            { name: 'John Doe', date: '2024-10-19', time: '08:00 AM' },
            { name: 'Jane Smith', date: '2024-10-18', time: '08:15 AM' },
        ],
        Payroll: [
            { name: 'Payroll for October', date: '2024-10-15', time: '09:00 AM' },
        ],
        Report: [
            { name: 'Monthly Sales Report', date: '2024-10-01', time: '02:00 PM' },
        ],
        Booking: [
            { name: 'John Doe - Checked in', date: '2024-10-19', time: '12:00 PM' },
            { name: 'Jane Smith - Checked out', date: '2024-10-18', time: '10:00 AM' },
            { name: 'Jane Smith - Confirmed', date: '2024-10-18', time: '10:00 AM' },

        ],
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleChange = (label) => {
        setSelectedDateRange(label); // Update selected date range
        setDateDropdownOpen(false); // Close dropdown
    };

    // Render the content based on the selected filter
    const renderContent = () => {
        // If "All" is selected, render all categories with labels
        if (selectedOption === "All") {
            return Object.keys(mockData).map((category) => (
                <div key={category} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{category}</h2>
                    <ul className="space-y-4">
                        {mockData[category].map((entry, index) => (
                            <li key={index} className="border p-4 rounded-lg shadow-sm">
                                <p className="font-semibold">{entry.name}</p>
                                <p>Date: {entry.date}</p>
                                <p>Time: {entry.time}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ));
        }

        // For specific options, render only the selected category
        const data = mockData[selectedOption] || [];

        if (data.length === 0) {
            return <p>No data available for {selectedOption}</p>;
        }

        return (
            <ul className="space-y-4">
                {data.map((entry, index) => (
                    <li key={index} className="border p-4 rounded-lg shadow-sm ">
                        <p className="font-semibold">{entry.name}</p>
                        <p>Date: {entry.date}</p>
                        <p>Time: {entry.time}</p>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="p-6 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">AUDIT LOG</h1>

                {/* Filter Options */}
                <div className="flex items-center justify-between mb-6">
                    {/* Radio Buttons */}
                    <div className="flex space-x-6">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio cursor-pointer"
                                name="auditFilter"
                                value="All"
                                checked={selectedOption === "All"}
                                onChange={handleOptionChange}
                            />
                            <span className="ml-2 text-md">All</span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio cursor-pointer"
                                name="auditFilter"
                                value="Registration"
                                checked={selectedOption === "Registration"}
                                onChange={handleOptionChange}
                            />
                            <span className="ml-2 text-md">Employee Registration</span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio cursor-pointer"
                                name="auditFilter"
                                value="Attendance"
                                checked={selectedOption === "Attendance"}
                                onChange={handleOptionChange}
                            />
                            <span className="ml-2 text-md">Attendance</span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio cursor-pointer"
                                name="auditFilter"
                                value="Payroll"
                                checked={selectedOption === "Payroll"}
                                onChange={handleOptionChange}
                            />
                            <span className="ml-2 text-md">Payroll</span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio cursor-pointer"
                                name="auditFilter"
                                value="Report"
                                checked={selectedOption === "Report"}
                                onChange={handleOptionChange}
                            />
                            <span className="ml-2 text-md">Report</span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio cursor-pointer"
                                name="auditFilter"
                                value="Booking"
                                checked={selectedOption === "Booking"}
                                onChange={handleOptionChange}
                            />
                            <span className="ml-2 text-md">Booking</span>
                        </label>
                    </div>

                    {/* Date Range Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDateDropdownOpen(!dateDropdownOpen)} // Toggle date dropdown
                            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none font-medium rounded-md text-sm px-3 py-1.5"
                            type="button"
                        >
                            {selectedDateRange} {/* Reflect selected date range */}
                            <svg
                                className={`w-2.5 h-2.5 ml-2.5 transform transition-transform ${dateDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>

                        {/* Date Dropdown menu */}
                        {dateDropdownOpen && (
                            <div className="absolute right-0 z-20 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
                                <ul className="p-3 space-y-1 text-sm text-gray-700">
                                    {['Today', 'Last day', 'Last 7 days', 'Last 30 days', 'Last month', 'Last year'].map((label, index) => (
                                        <li key={index}>
                                            <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => handleChange(label)}>
                                                <input
                                                    id={`filter-radio-example-${index + 1}`}
                                                    type="radio"
                                                    name="filter-radio"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`filter-radio-example-${index + 1}`}
                                                    className="w-full ml-2 text-sm font-medium text-gray-900"
                                                >
                                                    {label}
                                                </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 w-full mx-auto mt-8 bg-white shadow-lg rounded-lg border-gray-200 mb-4 h-[780px] overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
    };

export default AuditLog;
