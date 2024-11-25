import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AuditLog() {
    const [selectedOption, setSelectedOption] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data for the table
    const mockData = [
        { name: "John Doe", category: "Employee Registration", action: "Registered Employee", date: "30 APR 2024", time: "23:49:05" },
        { name: "Michael Lavaro", category: "Employee Registration", action: "Registered Employee", date: "30 APR 2024", time: "23:49:05" },
        { name: "Michael Lavaro", category: "Attendance", action: "Attendance", date: "30 APR 2024", time: "23:49:05" },
        { name: "", category: "Payroll", action: "Payroll created", date: "30 APR 2024", time: "23:49:05" },
        { name: "", category: "Report", action: "Sales Report", date: "30 APR 2024", time: "23:49:05" },
        { name: "Jane Smith", category: "Booking", action: "Checked out", date: "30 APR 2024", time: "23:49:05" },
        { name: "Smith John", category: "Booking", action: "Check in", date: "30 APR 2024", time: "23:49:05" },
        { name: "Smith John", category: "Booking", action: "Check in", date: "30 APR 2024", time: "23:49:05" },
        { name: "Smith John", category: "Booking", action: "Check in", date: "30 APR 2024", time: "23:49:05" },
        { name: "Smith John", category: "Booking", action: "Check in", date: "30 APR 2024", time: "23:49:05" },
        { name: "Smith John", category: "Booking", action: "Check in", date: "30 APR 2024", time: "23:49:05" },


    ];

    // Filtered data based on category and search query
    const filteredData = mockData.filter((entry) => {
        return (
            (selectedOption === "All" || entry.category === selectedOption) &&
            (searchQuery === "" || entry.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    // Pagination logic
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-6">Audit Log</h1>

                {/* Filters */}
                <div className="flex items-center justify-between mb-4">
                    {/* Search Input */}
                    <div className="relative w-1/3">
                        {/* Search Icon */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <img
                                src="src/assets/search.png" // Replace this with the actual path to your image
                                alt="Search Icon"
                                className="h-5 w-5"
                            />
                        </div>

                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border border-gray-300 rounded-lg p-2 w-full"
                        />
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            setSearchQuery("");
                        }}
                        className="ml-4 bg-[#70b8d3] hover:bg-[#09B0EF] text-white px-4 py-2 rounded-lg"
                    >
                        Reset
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="flex space-x-6 mb-4 border-b pb-2">
                    {["All", "Employee Registration", "Attendance", "Payroll", "Report", "Booking"].map((category) => {
                        // Determine if the current category is selected
                        const isSelected = selectedOption === category;
                        const activeColor = "text-[#70b8d3] border-[#70b8d3]"; // Use a consistent color for both text and border

                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedOption(category)}
                                className={`px-4 py-2 ${
                                    isSelected
                                        ? `${activeColor} font-semibold border-b-2`
                                        : "text-gray-700 hover:text-[#70b8d3]"
                                }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow p-4">
                    <table className="w-full text-left border-collapse">
                        <thead className="">
                            <tr className="bg-gray-100 border-b">
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Action</th>
                                <th className="p-3 border">Date</th>
                                <th className="p-3 border">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50 border-b">
                                        <td className="p-3 border">{entry.name || "—"}</td>
                                        <td className="p-3 border">{entry.action}</td>
                                        <td className="p-3 border">{entry.date}</td>
                                        <td className="p-3 border">{entry.time}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-3 border text-center" colSpan="4">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-end items-center mt-6 space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={`text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded ${
                            currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-[#09B0EF]"
                        }`}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <div className="px-2 py-1 bg-gray-100 text-gray-700">
                        {currentPage}
                    </div>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage)))}
                        className={`text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded ${
                            currentPage === Math.ceil(filteredData.length / itemsPerPage)
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-[#09B0EF]"
                        }`}
                        disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuditLog;
