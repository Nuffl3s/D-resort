import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';
import api from '../api';

function AdminList() {
    const [employeeList, setEmployeeList] = useState([]); 
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(""); 
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const employeesPerPage = 7; 

    const API_BASE_URL = 'http://localhost:8000/api/'; // Backend API base URL

    useEffect(() => {
        fetchEmployeeList();
        const intervalId = setInterval(fetchEmployeeList, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const fetchEmployeeList = async () => {
        try {
            const response = await api.get(`${API_BASE_URL}employees/`);
            setEmployeeList(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
    
        // Check if employee is selected
        if (!selectedEmployeeId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select an employee.'
            });
            return;
        }
    
        // Check if passwords match
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match.'
            });
            return;
        }
    
        try {
            // Send POST request to backend API
            const response = await api.post('http://localhost:8000/api/create-account/', {
                user: {
                    username: username,
                    password: password
                },
                employee_name: "Mars"  // Replace with the actual employee name (dynamic if needed)
            });
    
            // Check if response is successful
            if (response.status === 201) {
                // Successful account creation
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message || 'Account created successfully'
                });
    
                // Reset the input fields
                setUsername('');               // Reset username
                setPassword('');               // Reset password
                setConfirmPassword('');        // Reset confirm password
                setSelectedEmployeeId(null);   // Reset employee selection (if needed)
    
            } else {
                // Something went wrong, show the error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.error || 'Account creation failed. Please try again later.'
                });
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error("Error creating account:", error.response || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Account creation failed. Please try again later.'
            });
        }
    };
    
    
    const filteredEmployees = employeeList.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        applyTheme();
    }, []);

    return (
        <div className="flex dark:bg-[#111827] bg-gray-100">
            <AdminSidebar />
            <div id="add" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">EMPLOYEE LIST</h1>
                <div className="w-full">
                    <div className="flex gap-2">
                        <div className="bg-white rounded-md shadow-md p-6 w-full h-[850px] dark:bg-[#374151]">
                            <div className="justify-between border-b mb-4 pb-3">
                                <h1 className="font-semibold text-[18px] dark:text-[#e7e6e6]">Employee List</h1>
                                <div className="w-full mt-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none ">
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
                                                onChange={handleSearchChange}
                                                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6] dark:placeholder-white"
                                                placeholder="Search by name"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                        <table className="min-w-full leading-normal">
                                            <thead className="bg-gray-100 text-gray-600 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                                <tr>
                                                    <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                                                    <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                                                    <th className="px-5 py-3 border-b text-center text-xs font-semibold uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee).map((employee, index) => (
                                                    <tr key={employee.uid || employee.id}>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:bg-[#66696e]">
                                                            <p className="text-gray-900 whitespace-no-wrap dark:text-[#e7e6e6]">{indexOfFirstEmployee + index + 1}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:bg-[#66696e]">
                                                            <p className="text-gray-900 whitespace-no-wrap dark:text-[#e7e6e6]">{employee.name}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:bg-[#66696e]">
                                                            <div className="flex space-x-1 justify-center">
                                                                <button className="bg-[#1089D3] hover:bg-[#3d9fdb] p-3 rounded-full">
                                                                    <img src="./src/assets/edit.png" className="w-4 h-4 filter brightness-0 invert" alt="Edit" />
                                                                </button>
                                                                <button
                                                                    className="bg-[#FF6767] hover:bg-[#f35656] p-3 rounded-full"
                                                                >
                                                                    <img src="./src/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-5">
                                <div className="text-sm text-gray-600 dark:text-[#e7e6e6]">
                                    Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} entries
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded-r"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded-r"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Employee registration */}
                        <div className="bg-white rounded-md shadow-md p-6 w-full h-[850px] dark:bg-[#374151]">
                            <h2 className="font-semibold text-lg text-gray-600 dark:text-[#e7e6e6]">Create Account</h2>
                            <form onSubmit={handleCreateAccount}>
                                <div className="mt-4">
                                    <label htmlFor="employee" className="block text-sm font-semibold text-gray-700 dark:text-[#e7e6e6]">
                                        Select Employee
                                    </label>
                                    <select
                                        id="employee"
                                        value={selectedEmployeeId}
                                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                        className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none dark:bg-[#374151] dark:text-[#e7e6e6] dark:border-gray-600"
                                        required
                                    >
                                        <option value="">Select an employee</option>
                                        {employeeList.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-[#e7e6e6]">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none dark:bg-[#374151] dark:text-[#e7e6e6] dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-[#e7e6e6]">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none dark:bg-[#374151] dark:text-[#e7e6e6] dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-[#e7e6e6]">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none dark:bg-[#374151] dark:text-[#e7e6e6] dark:border-gray-600"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 mt-4 hover:bg-[#09B0EF] bg-[#70b8d3] text-white rounded-md "
                                >
                                    Create Account
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminList;
