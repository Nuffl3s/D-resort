import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';
import api from '../api';

function AdminManagement() {
    const [employeeList, setEmployeeList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const employeesPerPage = 5; // Number of employees per page
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        mobile_number: '',
    });

    useEffect(() => {
        fetchEmployeeList();
    }, []);

    // Fetch employees from the backend
    const fetchEmployeeList = async () => {
        try {
            const response = await api.get('http://localhost:8000/api/employees/');
            setEmployeeList(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // Handle input changes for the form
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle employee registration
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission

        // SweetAlert prompt for biometric confirmation
        Swal.fire({
            title: 'Biometric Registration',
            text: 'Please put your finger on the biometric device to proceed.',
            icon: 'info',
            confirmButtonText: 'OK',
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log("Form Submitted", formData);

                try {
                    // Submit form data via POST request
                    const response = await fetch('http://localhost:8000/api/registeremployee/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });

                    if (response.ok) {
                        const responseData = await response.json();
                        console.log('Employee Registered:', responseData);

                        // Fetch updated employee list
                        fetchEmployeeList();

                        // Reset form
                        setFormData({
                            name: '',
                            address: '',
                            mobile_number: '',
                        });

                        // SweetAlert success notification
                        Swal.fire({
                            title: 'Success',
                            text: 'Employee registered successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                    } else {
                        throw new Error('Failed to register employee');
                    }
                } catch (error) {
                    console.error('Error registering employee:', error);

                    // SweetAlert error notification
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to register employee. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            }
        });
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

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    useEffect(() => {
        applyTheme();
    }, []);

    return (
        <div className="flex dark:bg-[#1c1e21]">
            <AdminSidebar />
            <div id="add" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">EMPLOYEE MANAGEMENT</h1>
                <div className="w-ful">
                    <div className="flex">
                        <div className="flex-col">
                            <div className="w-[700px] h-[400px] shadow-md rounded-md bg-white p-8  dark:bg-[#303030] dark:shadow-md">
                                <h2 className="font-semibold text-[18px] mb-4 dark:text-[#e7e6e6]">Employee Information</h2>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 w-full border border-black rounded-md bg-white dark:bg-[#303030] dark:border-[#bebdbd] dark:text-[#e7e6e6]"
                                            autoComplete="name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 w-full border border-black rounded-md bg-white dark:bg-[#303030] dark:border-[#bebdbd] dark:text-[#e7e6e6]"
                                            autoComplete="address-line1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">Mobile Number</label>
                                        <input
                                            type="text"
                                            id="mobile_number"
                                            name="mobile_number"
                                            value={formData.mobile_number}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 w-full border border-black rounded-md bg-white dark:bg-[#303030] dark:border-[#bebdbd] dark:text-[#e7e6e6]"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 text-base font-medium rounded-md shadow-md text-white bg-[#70b8d3] hover:bg-[#09B0EF]"
                                    >
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="bg-white rounded-md shadow-md p-6 w-full ml-5 h-[850px] dark:bg-[#303030]">
                            <div className="justify-between border-b mb-4 pb-3">
                                <h1 className="font-semibold text-[18px] dark:text-[#e7e6e6]">Employee List</h1>
                                <div className="w-full flex justify-between">
                                    <div className="flex space-x-2 mt-5 w-1/2"> 
                                        <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-900">
                                            <span className="text-[13px] font-semibold text-gray-600 uppercase dark:text-[#e7e6e6]">Show</span>
                                            <div className="relative inline-block">
                                                <select className="appearance-none border border-gray-300 bg-white py-1 px-2 pr-8 rounded leading-tight focus:outline-none dark:border-[#bebdbd] dark:bg-[#303030] focus:bg-white focus:border-gray-500 dark:text-[#e7e6e6]">
                                                    <option value="1">1</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-[#e7e6e6]">
                                                    <img src="./src/assets/down.png" className="fill-current w-4 h-4 dark:invert" />
                                                </div>
                                            </div>
                                            <span className="text-[13px] font-semibold text-gray-600 uppercase dark:text-[#e7e6e6]">entries</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex bg-white items-center p-2 rounded-md border dark:border-[#bebdbd] dark:bg-[#303030]">
                                            <img 
                                                src="./src/assets/search.png" 
                                                className="fill-current w-5 h-5" 
                                                alt="Search Icon"
                                            />
                                            <input
                                                className="bg-white outline-none ml-1 block dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder:text-gray-200"
                                                type="text"
                                                placeholder="Search..."
                                                value={searchTerm} 
                                                onChange={handleSearchChange} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                        <table className="min-w-full leading-normal">
                                            <thead className="bg-gray-100 text-gray-600 dark:bg-[#424242] dark:text-[#e7e6e6]">
                                                <tr>
                                                    <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ">ID</th>
                                                    <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ">Name</th>
                                                    <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ">Address</th>
                                                    <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ">Mobile Number</th>
                                                    <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider ">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee).map((employee, index) => (
                                                    <tr key={employee.id}>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm ">
                                                            <p className="text-gray-900 whitespace-no-wrap">{indexOfFirstEmployee + index + 1}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p className="text-gray-900 whitespace-no-wrap">{employee.name}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p className="text-gray-900 whitespace-no-wrap">{employee.address}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <p className="text-gray-900 whitespace-no-wrap">{employee.mobile_number}</p>
                                                        </td>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                            <div className="flex space-x-1">
                                                                <button className="bg-[#1089D3] hover:bg-[#3d9fdb] p-3 rounded-full">
                                                                    <img src="./src/assets/edit.png" className="w-4 h-4 filter brightness-0 invert" alt="Edit" />
                                                                </button>
                                                                <button className="bg-[#FF6767] hover:bg-[#f35656] p-3 rounded-full">
                                                                    <img src="./src/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Pagination Controls */}
                                        <div className="flex justify-end space-x-4 p-2  dark:bg-[#676767]">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded ${
                                                    currentPage === 1
                                                        ? "bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
                                                        : "text-white font-semibold bg-[#70b8d3] hover:bg-[#09B0EF]"
                                                }`}
                                            >
                                                Prev
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded ${
                                                    currentPage === totalPages
                                                        ? "bg-gray-300 text-gray-500 font-semiboldcursor-not-allowed"
                                                        : " text-white font-semibold bg-[#70b8d3] hover:bg-[#09B0EF]"
                                                }`}
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
            </div>
        </div>
    );
}

export default AdminManagement;
