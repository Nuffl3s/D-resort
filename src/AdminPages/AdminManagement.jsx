import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
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
    const handleSubmit = async () => {
        try {
            const response = await api.post('http://localhost:8000/api/registeremployee/', formData);

            fetchEmployeeList();

            setFormData({
                name: '',
                address: '',
                mobile_number: '',
            });
        } catch (error) {
            console.error('Error registering employee:', error);
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
    
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage)

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    return (
        <div className="flex">
            <AdminSidebar />
            <div id="add" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">EMPLOYEE MANAGEMENT</h1>
                <div className="w-ful">
                    <div className="flex">
                        <div className="flex-col">
                            <div className="w-[700px] h-[400px] shadow-md rounded-md bg-white p-8">
                                <h2 className="font-semibold text-[18px] mb-4">Employee Information</h2>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 w-full border border-black rounded bg-white"
                                            autoComplete="name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="mt-1 p-2 w-full border border-black rounded bg-white"
                                            autoComplete="address-line1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                        <input type="text" id="mobileNumber" name="mobileNumber" className="mt-1 p-3 w-full border border-black rounded bg-white" />
                                    </div>
                                </form>
                            </div>

                            <div className="mt-5 w-full flex justify-start gap-5">
                                <button
                                    type="button" // Change to type="button" to prevent default form submission
                                    onClick={handleSubmit} // Add this line to trigger the form submission
                                    className="px-5 py-2 text-base font-medium rounded-md shadow-md text-white bg-[#70b8d3] hover:bg-[#09B0EF]"
                                >
                                    Register
                                </button>

                                <button type="button" className="px-5 py-2 text-base font-medium rounded-md shadow-md text-white bg-[#ED6565] hover:bg-[#F24E4E]">
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-md shadow-md p-6 w-full ml-5 h-[850px]">
                            <div className="justify-between border-b mb-4 pb-3">
                                <h1 className="font-semibold text-[18px]">Employee List</h1>
                                <div className="w-full flex justify-between">
                                    <div className="flex space-x-2 mt-5 w-1/2"> 
                                        <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-900">
                                            <span className="text-[13px] font-semibold text-gray-600 uppercase">Show</span>
                                            <div className="relative inline-block">
                                                <select className="appearance-none border border-gray-300 bg-white py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                                    <option value="1">1</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <img src="./src/assets/down.png" className="fill-current w-4 h-4" />
                                                </div>
                                            </div>
                                            <span className="text-[13px] font-semibold text-gray-600 uppercase">entries</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex bg-white items-center p-2 rounded-md border">
                                            <img 
                                                src="./src/assets/search.png" 
                                                className="fill-current w-5 h-5" 
                                                alt="Search Icon"
                                            />
                                            <input
                                                className="bg-white outline-none ml-1 block"
                                                type="text"
                                                placeholder="Search..."
                                                value={searchTerm} // Bind to the searchTerm state
                                                onChange={handleSearchChange} // Call the handler on input change
                                            />
                                        </div>
                                        <button className="bg-[#70b8d3] hover:bg-[#09B0EF] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                                            + New
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                        <table className="min-w-full leading-normal">
                                            <thead>
                                                <tr>
                                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mobile Number</th>
                                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee).map((employee, index) => (
                                                    <tr key={employee.id}>
                                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
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
                                        <div className="flex justify-between mt-4">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded ${
                                                    currentPage === 1
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-blue-500 text-white"
                                                }`}
                                            >
                                                Prev
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded ${
                                                    currentPage === totalPages
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-blue-500 text-white"
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