/* eslint-disable react/prop-types */
import { useState } from "react";

const CashAdvanceModal = ({ isOpen, onClose }) => {
    // Mock employee data
    const mockEmployees = [
        "John Doe",
        "Jane Smith",
        "Alice Johnson",
        "Robert Brown",
        "Emily Davis",
        "Michael Wilson",
    ];

    const [searchTerm, setSearchTerm] = useState(""); // For searching employees
    const [selectedEmployee, setSelectedEmployee] = useState(""); // Set default to empty string
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    // Filter employees based on search term
    const filteredEmployees = mockEmployees.filter((employee) =>
        employee.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle employee selection
    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee); // Set selected employee
        setSearchTerm(""); // Clear the search term after selection
    };

    // Close modal if not open
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-[30%]">
                <h2 className="text-xl font-bold mb-4">New Entry</h2>

                {/* Searchable Employee Dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select Employee</label>
                    <input
                        type="text"
                        value={selectedEmployee || searchTerm} // Display selected employee or search term
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                        className="block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Search employee"
                    />
                    {searchTerm && (
                        <ul className="border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto bg-white">
                            {filteredEmployees.map((employee, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleEmployeeSelect(employee)}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {employee}
                                </li>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <li className="px-4 py-2 text-gray-500">No results found</li>
                            )}
                        </ul>
                    )}
                    {selectedEmployee && (
                        <p className="mt-2 text-sm text-gray-600">
                            Selected: <strong>{selectedEmployee}</strong>
                        </p>
                    )}
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter amount"
                    />
                </div>

                {/* Date Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-[#FF6767] hover:bg-[#f35656] text-white px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-[#70b8d3] hover:bg-[#3d9fdb] text-white px-4 py-2 rounded-md"
                        onClick={() => {
                            if (!selectedEmployee || !amount || !date) {
                                alert("Please fill out all fields");
                                return;
                            }
                            alert(
                                `Saved:\nEmployee: ${selectedEmployee}\nAmount: $${amount}\nDate: ${date}`
                            );
                            onClose();
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CashAdvanceModal;
