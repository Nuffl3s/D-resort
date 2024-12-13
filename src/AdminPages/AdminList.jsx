import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';
import api from '../api';

function AdminList() {
    const [employeeList, setEmployeeList] = useState([]); // List of all employees
    const [previousEmployeeCount, setPreviousEmployeeCount] = useState(0); // Keep track of the previous employee count
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const employeesPerPage = 7; // Number of employees per page'
    
    useEffect(() => {
        fetchEmployeeList(); // Fetch employee list on mount
        const intervalId = setInterval(fetchEmployeeList, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, []); // Empty dependency array ensures this only runs once on mount

    // Fetch employees from the backend
    const fetchEmployeeList = async () => {
        try {
            const response = await api.get('http://localhost:8000/api/employees/');

            // Normalize the data to ensure every employee has an id
            const newEmployeeList = response.data.map((emp, index) => ({
                ...emp,
                id: emp.id || emp.uid || index, // Fallback to index temporarily
            }));

            console.log("Normalized Employee List: ", newEmployeeList);

            // Compare new and existing employee lists to detect changes
            if (JSON.stringify(newEmployeeList) !== JSON.stringify(employeeList)) {
                setEmployeeList(newEmployeeList);
            }

            // Handle new employee count logic
            if (newEmployeeList.length > previousEmployeeCount) {
                if (previousEmployeeCount !== 0) {
                    Swal.fire({
                        title: 'New Employee Added',
                        text: 'A new employee has been added to the system.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                }
                setPreviousEmployeeCount(newEmployeeList.length);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update the search term
        setCurrentPage(1); // Reset to the first page on new search
    };

  
    // Get filtered and paginated employees
    const filteredEmployees = employeeList.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Handle employee deletion
    const handleDeleteEmployee = (employeeId) => {
        if (!employeeId) {
            console.error("Invalid employeeId passed to handleDeleteEmployee:", employeeId);
            Swal.fire('Error!', 'Invalid employee selected for deletion.', 'error');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await api.delete(`http://localhost:8000/api/employees/${employeeId}/`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    });

                    if (response.status === 204 || response.status === 200) {
                        Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
                        setEmployeeList(prevList => prevList.filter(emp => emp.id !== employeeId));
                    } else {
                        Swal.fire('Error!', 'There was an issue deleting the employee.', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting employee:', error.response ? error.response.data : error.message);
                    Swal.fire('Error!', 'There was an issue deleting the employee.', 'error');
                }
            }
        });
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
                    <div className="flex">
                        <div className="bg-white rounded-md shadow-md p-6 w-full h-[850px] dark:bg-[#374151]">
                            <div className="justify-between border-b mb-4 pb-3">
                                <h1 className="font-semibold text-[18px] dark:text-[#e7e6e6]">Employee List</h1>
                                <div className="w-full flex justify-between">
                                    <div className="flex mt-5 w-1/2">
                                        <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-900">
                                            <span className="text-[13px] font-semibold text-gray-600 uppercase dark:text-[#e7e6e6]">Show</span>
                                            <div className="relative inline-block">
                                                <select className="appearance-none border border-gray-300 bg-white py-1 px-2 pr-8 rounded leading-tight focus:outline-none dark:border-gray-400 dark:bg-[#374151] focus:bg-white focus:border-gray-500 dark:text-[#e7e6e6]">
                                                    <option value="1">1</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-[#e7e6e6]">
                                                    <img src="./src/assets/down.png" className="fill-current w-4 h-4 dark:invert" />
                                                </div>
                                            </div>
                                            <span className="text-[13px] font-semibold text-gray-600 uppercase dark:text-[#e7e6e6]">entries</span>
                                        </div>
                                    </div>

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
                                                                    onClick={() => {
                                                                        if (employee.id) {
                                                                            handleDeleteEmployee(employee.id);
                                                                        } else {
                                                                            console.error("Employee missing id:", employee);
                                                                            Swal.fire('Error!', 'Employee cannot be deleted as no ID is available.', 'error');
                                                                        }
                                                                    }}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminList;
