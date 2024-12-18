import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';
import DeductionModal from "../Modal/DeductionModal";
import CashAdvanceModal from "../Modal/CashAdvanceModal";
import api from '../api';


const BASE_URL = 'http://localhost:8000/api';
// Function to format dates
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

function AdminPayroll() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee] = useState('');
    const [totalHours] = useState(0);
    const [hourlyRate] = useState(0);
    const [payrollType] = useState('weekly');
    const [payrollEntries, setPayrollEntries] = useState([]);
    // const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [payrollData, setPayrollData] = useState([]);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]); // Filtered data
    const [sortOption, setSortOption] = useState('All'); // Default is "All"
    const [searchTerm, setSearchTerm] = useState(''); // Search term
    const [activeButton, setActiveButton] = useState(1);
    const [editingRow, setEditingRow] = useState(null); // Tracks which row is being edited
    const [editValues, setEditValues] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [deductions, setDeductions] = useState([]);
    const [entries] = useState([]);
    const [page, setPage] = useState(1); // Track the current page
    const [itemsPerPage] = useState(9); // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;
    const [currentPageSecondTable, setCurrentPageSecondTable] = useState(1);
    
    
    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                const payrollResponse = await api.get(`${BASE_URL}/payroll/`);
                console.log('Payroll Data:', payrollResponse.data);
                setFilteredData(payrollResponse.data);
            }  catch (error) {
                console.error("Error fetching payroll data!", error);
            }
          };
   
        const fetchEmployeeData = async () => {
            try {
                const employeeResponse = await api.get(`${BASE_URL}/employees/`);
                console.log('Employee Data:', employeeResponse.data);
                setEmployees(employeeResponse.data);
                setFilteredData(employeeResponse.data);  // Add this line
            } catch (error) {
                console.error("Error fetching employee data:", error);
                alert("Failed to fetch employee data. Please try again later.");
            }
        };
        
        fetchPayrollData();
        fetchEmployeeData();
    }, []); // Fetch data only once when component mounts
   
     // Calculate the data to display on the current page
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    
    const indexOfLastItem2 = currentPageSecondTable * pageSize;
    const indexOfFirstItem2 = indexOfLastItem2 - pageSize;
    const currentDataSecondTable = filteredData.slice(indexOfFirstItem2, indexOfLastItem2);

    const indexOfLastItem3 = currentPage * pageSize;
    const indexOfFirstItem3 = indexOfLastItem3 - pageSize;
    const currentData3 = filteredData.slice(indexOfFirstItem3, indexOfLastItem3);



    // Handle pagination button clicks
    const handleNextPage = () => {
        if (page < Math.ceil(filteredData.length / itemsPerPage)) {
        setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
        setPage(page - 1);
        }
    };

    // Handle sorting/filtering based on status
    const handleSort = (option) => {
        setSortOption(option);
        setSortDropdownOpen(false);

        const filteredByStatus = option === 'All'
            ? payrollData
            : payrollData.filter(emp => emp.status === option);

        // Apply search filter if searchTerm is present
        const finalFiltered = filteredByStatus.filter(emp =>
            emp.employee.toLowerCase().includes(searchTerm)
        );

        setFilteredData(finalFiltered);
    };

    // Handle search by name
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        // Filter payroll data by search term
        const filtered = payrollData.filter(emp =>
            emp.employee.toLowerCase().includes(value)
        );

        // Apply active sort filter
        if (sortOption !== 'All') {
            setFilteredData(filtered.filter(emp => emp.status === sortOption));
        } else {
            setFilteredData(filtered);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this payroll entry?")) {
            api.delete(`${BASE_URL}/payroll/${id}/`)
                .then(() => {
                    // Refresh the list after deletion
                    setPayrollData(payrollData.filter(payroll => payroll.id !== id));
                    setFilteredData(filteredData.filter(payroll => payroll.id !== id));
                })
                .catch((error) => {
                    console.error("Error deleting payroll entry:", error);
                    alert('Failed to delete payroll entry.');
                });
        }
    };

    useEffect(() => {
        applyTheme();
    }, []);

    // This is for Employee Section
    const handleButtonClick = (buttonIndex) => {
        setActiveButton(buttonIndex); // Update the active button
    };
    
    const handleEditClick = (name, payroll) => {
        console.log("Editing payroll for employee:", name); // Debugging
    
        if (!payroll) {
            console.error("Payroll object is undefined for Name:", name);
            return;
        }
    
        setEditingRow(name); // Use name as the identifier
        setEditValues({
            employee: payroll.employee || "",
            rate: payroll.rate || 0,
            total_hours: payroll.total_hours || 0,
            deductions: payroll.deductions || 0,
            cash_advance: payroll.cash_advance || 0,
            net_pay: payroll.net_pay || 0,
        });
    };
    
    
    const handleEditChange = (field, value) => {
        setEditValues((prev) => ({
            ...prev,
            [field]: value, // Dynamically update the field in editValues
        }));
    };
    
    
    const handleSave = async (name) => {
        const updatedRow = {
            ...currentData.find((row) => row.name === name),
            ...editValues, // Merge edited values
        };
    
        try {
            // Correct the URL structure to avoid "api/api" duplication
            await api.put(`${BASE_URL}/payroll/${name}/update/`, updatedRow);
            console.log("Save URL:", `${BASE_URL}/payroll/${name}/update/`);
            console.log("Payroll saved successfully!");
        } catch (error) {
            console.error("Failed to save payroll:", error);
        }
    
        setEditingRow(null); // Exit editing mode
    };
    
    const handleCancel = () => {
        setEditingRow(null); // Exit editing mode without saving
    };


    // This is for Deductions
    const handleDeductionSave = () => {
        setFilteredData((prevData) =>
            prevData.map((item) =>
                item.name === modalData.name  // Find the employee by name
                    ? { 
                        ...item, 
                        deductions: modalData.descriptions, 
                        amount: modalData.amount       
                    }
                    : item
            )
        );
        setIsModalOpen(false); // Close the modal after saving
    };

    const handleEditDeductionClick = (payroll) => {
        const defaultData = {
            descriptions: payroll.deductions || '',  // Use payroll.deductions if available
            amount: payroll.amount || 0,  // Default to 0 if amount is not available
        };
        setModalData({
            name: payroll.name,  // Save the employee's name to update data by name
            descriptions: defaultData.descriptions,
            amount: defaultData.amount
        });
        setIsModalOpen(true);  // Open the modal for editing
    };

    const handleDescriptionChange = (e) => {
        setModalData((prevData) => ({
            ...prevData,
            descriptions: e.target.value
        }));
    };

    const handleAmountChange = (e) => {
        setModalData((prevData) => ({
            ...prevData,
            amount: e.target.value
        }));
    };
    
    

    const handleModalChange = (field, value) => {
        setModalData((prevData) => ({
            ...prevData,
            [field]: value, // Dynamically update the respective field (either descriptions or amount)
        }));
    };
    

    const handleClose = () => {
        setIsModalOpen(false); // Close the modal without saving
    };


    // This is for Cash Advance
    const handleNewButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCashClose = () => {
        setIsModalOpen(false);
    };


    // NEW
    const openModal = (payrollId) => {
        const selectedPayroll = deductions.find(payroll => payroll.id === payrollId);
        setModalData(selectedPayroll); // Set the data of the selected payroll to be used in the modal
        setIsModalOpen(true); // Open the modal
    };

    const handleRateChange = async (employeeId, rate) => {
        try {
            // Send updated rate to backend
            await api.put(`${BASE_URL}/employees/${employeeId}/`, { rate });
            // Update local state for UI responsiveness
            setEmployees(prevEmployees =>
                prevEmployees.map(employee =>
                    employee.id === employeeId ? { ...employee, rate: rate } : employee
                )
            );
        } catch (error) {
            console.error("Error updating rate:", error);
            alert("Failed to update rate. Please try again.");
        }
    };
    

    useEffect(() => {
        localStorage.setItem('employees', JSON.stringify(employees));
    }, [employees]); // Save whenever employees state changes
    
    useEffect(() => {
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
            setEmployees(JSON.parse(savedEmployees));
        }
    }, []); // Load once on component mount
    
    
    const handleDeductionChange = (payrollId, deduction) => {
    // Update the deduction in the payroll data
    setDeductions(prevDeductions =>
        prevDeductions.map(payroll =>
        payroll.id === payrollId ? { ...payroll, deductions: deduction } : payroll
        )
    );
    // Optionally, make a post request to save the deduction
    api.post(`${BASE_URL}/deductions/`, { payrollId, deduction });
    };
      
    const handleCashAdvanceChange = (employeeId, cashAdvance) => {
        // Update cash advance in employee data
        setEmployees(prevEmployees =>
          prevEmployees.map(employee =>
            employee.id === employeeId ? { ...employee, cash_advance: cashAdvance } : employee
          )
        );
        // Save cash advance data to backend
        api.post(`${BASE_URL}/cash_advance/`, { employeeId, cash_advance: cashAdvance });
    };

    const calculateNetPay = (totalHours, hourlyRate, deductions, cashAdvances) => {
        // Calculate total pay based on hourly rate and total hours
        let totalPay = totalHours * hourlyRate;
    
        // Calculate total deductions
        const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    
        // Calculate total cash advances
        const totalCashAdvance = cashAdvances.reduce((sum, advance) => sum + advance.amount, 0);
    
        // Calculate and return net pay
        return totalPay - totalDeductions - totalCashAdvance;
    };
    
        
    const handleInputChange = (field, value) => {
        // Update relevant state for the field
        setEditValues(prevValues => {
            const updatedValues = { ...prevValues, [field]: value };
    
            // Recalculate net pay whenever input changes
            const updatedNetPay = calculateNetPay(updatedValues.total_hours, updatedValues.rate, deductions, cashAdvances);
            
            return { ...updatedValues, netPay: updatedNetPay };  // Update net pay
        });
    };
    
    const handleAddDeduction = (description, amount) => {
        setDeductions(prevDeductions => {
            const updatedDeductions = [...prevDeductions, { description, amount }];
            const updatedNetPay = calculateNetPay(totalHours, hourlyRate, updatedDeductions, cashAdvances);
            setEditValues(prevValues => ({ ...prevValues, deductions: updatedDeductions, netPay: updatedNetPay }));
            return updatedDeductions;
        });
    };
    
    const handleAddCashAdvance = (amount) => {
        setCashAdvances(prevCashAdvances => {
            const updatedAdvances = [...prevCashAdvances, { amount }];
            const updatedNetPay = calculateNetPay(totalHours, hourlyRate, deductions, updatedAdvances);
            setEditValues(prevValues => ({ ...prevValues, cashAdvances: updatedAdvances, netPay: updatedNetPay }));
            return updatedAdvances;
        });
    };

    
    
    const handleDone = async () => {
        if (payrollEntries.length === 0) {
            alert("No payroll entries to save.");
            return;
        }
    
        const updatedEntries = payrollEntries.map(entry => ({
            employee_name: entry.employee_name,
            net_pay: entry.net.toFixed(2),
            status: 'Calculated',
            payroll_type: payrollType,
        }));
    
        try {
            await api.post(`${BASE_URL}/payroll/`, updatedEntries);
            alert('Payroll data saved successfully!');
            setPayrollEntries([]);
        } catch (error) {
            console.error("Error saving payroll data:", error);
            alert('Failed to save payroll data.');
        }
    };
    

    return (
        <div className="flex h-screen overflow-hidden dark:bg-[#111827] bg-gray-100">
            <AdminSidebar />
            <div id="report" className="p-7 flex-1 h-screen overflow-hidden">
                <h1 className="text-4xl font-bold mb-5 dark:text-[#e7e6e6]">PAYROLL SYSTEM</h1>
                <div className="flex space-x-5">                  
                    <div className="rounded-md bg-white shadow p-6 w-full dark:bg-[#374151] dark:shadow min-h-[860px]">
                        <div className="flex">
                            <button
                                className={`w-full py-2 px-5 border border-gray-100 text-[15px] font-medium rounded-l-md ${
                                    activeButton === 1 ? "bg-[#70b8d3] text-white" : "bg-gray-200 text-gray-600"
                                }`}
                                onClick={() => handleButtonClick(1)}
                            >
                                Employee Section
                            </button>
                            <button
                                className={`w-full py-2 px-5 border border-gray-100 text-[15px] font-medium ${
                                    activeButton === 2 ? "bg-[#70b8d3] text-white" : "bg-gray-200 text-gray-600"
                                }`}
                                onClick={() => handleButtonClick(2)}
                            >
                                Deductions
                            </button>
                            <button
                                className={`w-full py-2 px-5 border border-gray-100 text-[15px] font-medium ${
                                    activeButton === 3 ? "bg-[#70b8d3] text-white" : "bg-gray-200 text-gray-600"
                                }`}
                                onClick={() => handleButtonClick(3)}
                            >
                                Cash Advance
                            </button>
                            <button
                                className={`w-full py-2 px-5 border border-gray-100 text-[15px] font-medium rounded-r-md ${
                                    activeButton === 4 ? "bg-[#70b8d3] text-white" : "bg-gray-200 text-gray-600"
                                }`}
                                onClick={() => handleButtonClick(4)}
                            >
                                Payroll Section
                            </button>
                        </div>

                         {/* Page Containers */}

                        {/* EMPLOYEE SECTION */}
                        <div className="mt-5 p-6 border rounded-md">
                            {activeButton === 1 && (
                                <div>
                                    <div className="relative mb-2">
                                        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-500"
                                                aria-hidden="true"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                            <input
                                            type="text"
                                                id="table-search"
                                                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6] dark:placeholder-white"
                                                placeholder="Search by name"
                                            />
                                    </div>
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                            <tr>
                                                <th scope="col" className="p-4">No.</th>
                                                <th scope="col" className="px-4">Name</th>
                                                <th scope="col" className="px-4">Rate</th>
                                                <th scope="col" className="px-4">Action</th>
                                            </tr>
                                        </thead>
                                            <tbody>
                                                {currentData.map((payroll, index) => (
                                                    <tr key={payroll.name} className="border-b dark:text-[#e7e6e6]">
                                                        <td className="px-6 py-3">{index + 1 + (page - 1) * itemsPerPage}</td>
                                                        {editingRow === payroll.name ? (
                                                            <>
                                                                {/* Name Field - Not Editable */}
                                                                <td className="px-6 py-3">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        value={payroll.name}
                                                                        className="w-full p-1 border border-gray-300 rounded"
                                                                        disabled // Name is not editable
                                                                    />
                                                                </td>
                                                                {/* Rate Field - Editable */}
                                                                <td className="px-6 py-3">
                                                                    <input
                                                                        type="number"
                                                                        name="rate"
                                                                        value={editValues.rate} // Comes from editValues, not payroll directly
                                                                        onChange={(e) => handleEditChange("rate", e.target.value)}
                                                                        className="w-full p-1 border border-gray-300 rounded"
                                                                    />
                                                                </td>
                                                                {/* Action Buttons */}
                                                                <td className="px-4 py-3 space-x-1">
                                                                    <button
                                                                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white font-medium"
                                                                        onClick={() => handleSave(payroll.name)} // Pass name to handleSave
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        className="bg-[#FF6767] hover:bg-[#f35656] px-4 py-2 rounded-md text-white font-medium"
                                                                        onClick={handleCancel}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="px-6 py-3">{payroll.name}</td>
                                                                <td className="px-6 py-3">{payroll.rate !== undefined ? payroll.rate : "N/A"}</td>
                                                                <td className="px-4 py-3 space-x-1">
                                                                    <button
                                                                        className="bg-[#70b8d3] hover:bg-[#3d9fdb] px-4 py-2 rounded-md text-white font-medium"
                                                                        onClick={() => handleEditClick(payroll.name, payroll)} // Pass name to handleEditClick
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="bg-[#FF6767] hover:bg-[#f35656] px-4 py-2 rounded-md text-white font-medium"
                                                                        onClick={() => handleDelete(payroll.name)} // Adjust delete logic to use name
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>

                                    <div className="flex space-x-2 mt-5 justify-end">
                                        <button
                                            className="text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#3d9fdb] font-semibold py-2 px-4 rounded-l"
                                            onClick={handlePrevPage}
                                            disabled={page === 1}
                                        >
                                        Prev
                                        </button>
                                        <button
                                            className="text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#3d9fdb] font-semibold py-2 px-4 rounded-r"
                                            onClick={handleNextPage}
                                            disabled={page === Math.ceil(filteredData.length / itemsPerPage)}
                                        >
                                        Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* DEDUCTIONS */}
                            {activeButton === 2 && (
                                <div>
                                    <div className="relative mb-2">
                                        {/* Search Bar */}
                                        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-500"
                                                aria-hidden="true"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="table-search"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6] dark:placeholder-white"
                                            placeholder="Search by name"
                                        />
                                    </div>
                        
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                            <tr>
                                                <th scope="col" className="p-4">No.</th>
                                                <th scope="col" className="px-4">Name</th>
                                                <th scope="col" className="px-4">Description</th>
                                                <th scope="col" className="px-4">Amount</th>
                                                <th scope="col" className="px-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDataSecondTable.map((payroll, index) => (
                                                <tr key={payroll.id} className="border-b dark:text-[#e7e6e6]">
                                                    <td className="px-6 py-3">{index + 1 + indexOfFirstItem}</td>
                                                    <td className="px-6 py-3">{payroll.name}</td>
                                                    <td className="px-6 py-3">{payroll.deductions}</td> {/* Display description (deductions) */}
                                                    <td className="px-6 py-3">{payroll.amount}</td>      {/* Display actual amount */}
                                                    <td className="px-4 py-3 space-x-1">
                                                        <button
                                                            className="bg-[#70b8d3] hover:bg-[#3d9fdb] px-4 py-2 rounded-md text-white font-medium"
                                                            onClick={() => {
                                                                setModalData(payroll); // Pass the relevant data to the modal
                                                                setIsModalOpen(true); // Open the modal
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="bg-[#FF6767] hover:bg-[#f35656] px-4 py-2 rounded-md text-white font-medium"
                                                            onClick={() => handleDelete(payroll.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                        
                                    {/* Pagination */}
                                    <div className="flex space-x-2 mt-5 justify-between">
                                            <p className="text-sm text-gray-500 mt-3">
                                                Page {currentPage} of {Math.ceil(filteredData.length / pageSize)}
                                            </p>
                                            <div className="space-x-2">
                                                <button
                                                    className={`text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#3d9fdb] font-semibold py-2 px-4 rounded-l ${
                                                        currentPageSecondTable === 1 && "opacity-50 cursor-not-allowed"
                                                    }`}
                                                    onClick={() => setCurrentPageSecondTable((prev) => Math.max(prev - 1, 1))}
                                                    disabled={currentPageSecondTable === 1}
                                                >
                                                    Prev
                                                </button>
                                                <button
                                                    className={`text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#3d9fdb] font-semibold py-2 px-4 rounded-r ${
                                                        currentPageSecondTable === Math.ceil(filteredData.length / pageSize) &&
                                                        "opacity-50 cursor-not-allowed"
                                                    }`}
                                                    onClick={() =>
                                                        setCurrentPageSecondTable((prev) =>
                                                            Math.min(prev + 1, Math.ceil(filteredData.length / pageSize))
                                                        )
                                                    }
                                                    disabled={currentPageSecondTable === Math.ceil(filteredData.length / pageSize)}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>

                                    {/* Edit Modal */}
                                    <DeductionModal
                                        isOpen={isModalOpen}
                                        data={modalData}  // This should reflect the current state from deductions
                                        onChange={handleModalChange}  // This should handle the updates to modalData
                                        onClose={handleClose}  // Close modal without saving
                                        onSave={handleDeductionSave}  // Save the modal data and update the state
                                    />
                                </div>
                            )}

                            {/* CASH ADVANCE */}
                            {activeButton === 3 && (
                                <div>
                                    <div>
                                        <button className="bg-[#70b8d3] hover:bg-[#3d9fdb] text-white py-1 px-3 rounded mb-2 flex items-center font-medium"
                                        onClick={handleNewButtonClick}
                                        ><img src="src/assets/plus.png" alt="" className="w-5 h-5 invert" />New</button>
                                    </div>
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                            <tr>
                                                <th scope="col" className="p-4">Date</th>
                                                <th scope="col" className="px-4">Name</th>
                                                <th scope="col" className="px-4">Amount</th>
                                                <th scope="col" className="px-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map((entry, index) => (
                                                <tr key={index} className="border-b dark:text-[#e7e6e6]">
                                                    <td className="px-6 py-3">{entry.date}</td>
                                                    <td className="px-6 py-3">{entry.name}</td>
                                                    <td className="px-6 py-3">{entry.amount}</td>
                                                    <td className="px-6 py-3">
                                                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                      {/* Pagination */}
                                    <div className="flex space-x-2 mt-5 justify-end">
                                        <button
                                            className="text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#3d9fdb] font-semibold py-2 px-4 rounded-l"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            
                                            className="text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#3d9fdb] font-semibold py-2 px-4 rounded-r"
                                        >
                                            Next
                                        </button>
                                    </div>

                                    <CashAdvanceModal
                                        isOpen={isModalOpen}
                                        onClose={handleCashClose}
                                        employees={employees}
                                    />
                                </div>
                            )}

                            {/* PAYROLL SECTION */}
                            {activeButton === 4 && (
                                <div>
                                    <div className="flex relative mb-2 justify-between items-center">
                                        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-500"
                                                aria-hidden="true"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="table-search"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6] dark:placeholder-white"
                                            placeholder="Search by name"
                                        />

                                        <div>
                                            <button
                                                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-white font-medium"
                                            >
                                                Post All
                                            </button>
                                        </div>
                                        
                                    </div>
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                            <tr>
                                                <th scope="col" className="p-4">No.</th>
                                                <th scope="col" className="px-4">Name</th>
                                                <th scope="col" className="px-4">Total Hours</th>
                                                <th scope="col" className="px-4">Rate</th>
                                                <th scope="col" className="px-4">Deductions</th>
                                                <th scope="col" className="px-4">Net Pay</th>
                                                <th scope="col" className="px-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData3.map((payroll, index) => (
                                                <tr key={payroll.id} className="border-b dark:text-[#e7e6e6]">
                                                    <td className="px-6 py-3">{index + 1}</td>
                                                    {editingRow === payroll.id ? (
                                                        <>
                                                            <td className="px-6 py-3">{payroll.name}</td>
                                                            <td className="px-2 py-3">12</td>
                                                            <td className="px-2 py-3">
                                                                <input
                                                                    type="number"
                                                                    name="net_pay"
                                                                    value={editValues.net_pay}
                                                                    onChange={handleEditChange}
                                                                    className="w-full p-1 border border-gray-300 rounded"
                                                                />
                                                            </td>
                                                            <td className="px-2 py-3">
                                                                <input
                                                                    type="number"
                                                                    name="net_pay"
                                                                    value={editValues.net_pay}
                                                                    onChange={handleEditChange}
                                                                    className="w-full p-1 border border-gray-300 rounded"
                                                                />
                                                            </td>
                                                            <td className="px-2 py-3">235</td>
                                                            <td className="px-4 py-3 space-x-1">
                                                                <button
                                                                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white font-medium"
                                                                    onClick={() => handleSave(payroll.id)}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className="bg-[#FF6767] hover:bg-[#f35656] px-4 py-2 rounded-md text-white font-medium"
                                                                    onClick={handleCancel}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="px-6 py-3">{payroll.name}</td>
                                                            <td className="px-6 py-3">{payroll.total_hours}</td>
                                                            <td className="px-6 py-3">{payroll.rate}</td>
                                                            <td className="px-6 py-3">{payroll.amount}</td> {/* Only display amount here */}
                                                            <td className="px-6 py-3">{payroll.net_pay}</td>
                                                            <td className="px-4 py-3 space-x-1 flex">
                                                                <button
                                                                    className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md text-white font-medium"
                                                                    onClick={() => handleEditClick(payroll.id, payroll)}
                                                                >
                                                                    Post
                                                                </button>
                                                                <button
                                                                    className="bg-[#70b8d3] hover:bg-[#3d9fdb] px-3 py-2 rounded-md text-white font-medium"
                                                                    onClick={() => handleEditClick(payroll.id, payroll)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="bg-[#FF6767] hover:bg-[#f35656] px-3 py-2 rounded-md text-white font-medium"
                                                                    onClick={() => handleDelete(payroll.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="flex space-x-2 mt-5 justify-between">
                                        <p className="text-sm text-gray-500 mt-3">
                                            Page {currentPage} of {Math.ceil(filteredData.length / pageSize)}
                                        </p>
                                        <div className="space-x-2">
                                            <button
                                                className={`text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#3d9fdb] font-semibold py-2 px-4 rounded-l ${
                                                    currentPage === 1 && "opacity-50 cursor-not-allowed"
                                                }`}
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Prev
                                            </button>
                                            <button
                                                className={`text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#3d9fdb] font-semibold py-2 px-4 rounded-r ${
                                                    currentPage === Math.ceil(filteredData.length / pageSize) &&
                                                    "opacity-50 cursor-not-allowed"
                                                }`}
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.min(prev + 1, Math.ceil(filteredData.length / pageSize))
                                                    )
                                                }
                                                disabled={currentPage === Math.ceil(filteredData.length / pageSize)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    

                    {/* RIGHT SIDE */}
                    <div className="bg-white rounded-md shadow p-6 w-full  dark:bg-[#374151] dark:shadow min-h-[860px]">
                        <div className="flex justify-between border-b mb-4 pb-3">
                            <h1 className="font-semibold text-[18px] dark:text-[#e7e6e6]">Payroll List</h1>
                            <div className="flex space-x-2 items-center">
                                <div className="relative">
                                    <button
                                        onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none font-medium rounded-md text-sm px-3 p-2  dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6] dark:placeholder-white"
                                        type="button"
                                    >
                                        {sortOption || "Sort By"}
                                        <svg
                                            className={`w-2.5 h-2.5 ms-2.5 transform transition-transform ${sortDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
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

                                    {sortDropdownOpen && (
                                        <div className="absolute z-20 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
                                            <ul className="p-3 space-y-1 text-sm text-gray-700">
                                                {['All', 'Calculated', 'Not yet'].map((option) => (
                                                    <li key={option}>
                                                        <div
                                                            className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => handleSort(option)}
                                                        >
                                                            <span className="w-full ms-2 text-sm font-medium text-gray-900">{option}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-500"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="table-search"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6] dark:placeholder-white"
                                        placeholder="Search by name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[670px] mt-5">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                    <tr>
                                        <th scope="col" className="p-4">No.</th>
                                        <th scope="col" className="p-4">Name</th>
                                        <th scope="col" className="p-4">Net Payment</th>
                                        <th scope="col" className="p-4">Status</th>
                                        <th scope="col" className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((payroll, index) => (
                                        <tr key={payroll.id} className="border-b dark:text-[#e7e6e6]">
                                            <td className="px-6 py-3">{index + 1}</td>
                                            <td className="px-6 py-3">{payroll.name}</td> {/* Employee name */}
                                            <td className="px-6 py-3"></td>
                                            <td className="px-6 py-3">
                                                <span className={`${payroll.status === 'Calculated' ? 'text-[#53db60]' : 'text-[#FF6767]'} py-2 rounded`}>
                                                    {payroll.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 space-x-1">
                                                <button className="bg-[#70b8d3] hover:bg-[#3d9fdb] px-4 py-2 rounded-md text-white font-medium">
                                                    Edit
                                                </button>
                                                <button className="bg-[#FFC470] hover:bg-[#f8b961] px-4 py-2 rounded-md text-white font-medium">
                                                    View
                                                </button>
                                                <button className="bg-[#FF6767] hover:bg-[#f35656] px-4 py-2 rounded-md text-white font-medium"  onClick={() => handleDelete(payroll.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPayroll;
