import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api';

const BASE_URL = 'http://localhost:8000/api';

const CashAdvanceModal = ({ isOpen, onClose, onSaveCashAdvance }) => {
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Fetch employee data when the modal opens
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await api.get(`${BASE_URL}/employees/`);
                setEmployeeData(response.data);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        if (isOpen) {
            fetchEmployeeData();
        }
    }, [isOpen]);

    // Filter employees based on search term
    const filteredEmployees = Array.isArray(employeeData)
        ? employeeData.filter((employee) =>
              employee.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee.name);
        setSearchTerm(""); // Clear the search term after selection
        setIsFocused(false); // Close the dropdown when selecting
    };

    const saveCashAdvance = async () => {
        if (!selectedEmployee || !amount || !date) {
            alert("Please fill out all fields");
            return;
        }

        try {
            // Update payroll with the cash advance
            const response = await api.put(`${BASE_URL}/payroll/${selectedEmployee}/`, {
                cash_advance: amount,  // Pass the cash advance amount
            });
            console.log("Cash advance saved:", response.data);

            // Prepare new entry for the table
            const newEntry = { date, name: selectedEmployee, amount };

            // Call the callback to update the local table data
            onSaveCashAdvance(newEntry);

            // Close the modal after saving
            onClose();
        } catch (error) {
            console.error("Error saving cash advance:", error.response ? error.response.data : error);
            alert("Failed to save cash advance. Please try again.");
        }
    };

    if (!isOpen) return null;

    // Handle click inside the employee input field
    const handleClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // Close modal when clicking outside
        >
            <div
                className="bg-white rounded-md p-6 w-[40%] flex"
                onClick={handleClick} // Stop event propagation to prevent closing the modal
            >
                {/* Left Column (Search & Form) */}
                <div className="flex-1 pr-6">
                    <h2 className="text-xl font-bold mb-4">New Entry</h2>

                    {/* Searchable Employee Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Select Employee</label>
                        <input
                            type="text"
                            value={selectedEmployee || searchTerm} // Display selected employee or search term
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                            onFocus={() => setIsFocused(true)} // Set focus state to true when input is clicked
                            onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay hiding dropdown to allow selection
                            className="block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Search employee"
                        />
                        {/* Show the employee list only when the input is focused */}
                        {isFocused && (
                            <ul className="border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto bg-white">
                                {filteredEmployees.map((employee, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleEmployeeSelect(employee)}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        {employee.name}
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
                            onClick={saveCashAdvance}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CashAdvanceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Modal open state
    onClose: PropTypes.func.isRequired, // Function to close the modal
    onSaveCashAdvance: PropTypes.func.isRequired, // Function to update the parent table state
};

export default CashAdvanceModal;
