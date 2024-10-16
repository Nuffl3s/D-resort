import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';

// Function to format dates
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

function AdminPayroll() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [totalHours, setTotalHours] = useState(0);
    const [hourlyRate, setHourlyRate] = useState(0);
    const [payrollType, setPayrollType] = useState('weekly');
    const [payrollRange, setPayrollRange] = useState({ from: '', to: '' });
    const [payrollEntries, setPayrollEntries] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [payrollData, setPayrollData] = useState([]);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]); // Filtered data
    const [sortOption, setSortOption] = useState('All'); // Default is "All"
    const [searchTerm, setSearchTerm] = useState(''); // Search term
    const [selectAll, setSelectAll] = useState(false); // For the "select all" checkbox
    const [checkedItems, setCheckedItems] = useState({}); // Tracks which items are checked

    

    // Fetch employees from the API and set their initial payroll status as 'Not yet'
    useEffect(() => {
        axios.get('http://localhost:8000/api/employees/')
            .then((response) => {
                const employeeData = response.data.map(emp => ({
                    ...emp,
                    status: 'Not yet' // Initialize status to 'Not yet'
                }));
                setEmployees(employeeData);
                setPayrollData(employeeData); // Set payroll data for display
                setFilteredData(employeeData); // Initialize filtered data
            })
            .catch((error) => {
                console.error("There was an error fetching the employee data!", error);
            });
    }, []);

    // Handle payroll calculation (just calculate, don't change status yet)
    const handleCalculate = () => {
        let payment;
        if (payrollType === 'weekly') {
            payment = totalHours * hourlyRate;
        } else if (payrollType === 'monthly') {
            payment = (totalHours * hourlyRate) * 4;
        }

        const newEntry = {
            name: selectedEmployee,
            hours: totalHours,
            rate: hourlyRate,
            net: payment,
            range: `${formatDate(payrollRange.from)} to ${formatDate(payrollRange.to)}`,
            type: payrollType
        };

        // Add calculated entry to the temporary payroll entries
        setPayrollEntries([...payrollEntries, newEntry]);
    };

    // Handle the "Done" button click, this will update the employee status
    const handleDone = () => {
        // Update the status of all employees for whom the payroll has been calculated
        const updatedPayrollData = payrollData.map(emp => {
            const entry = payrollEntries.find(e => e.name === emp.name);
            if (entry) {
                return { ...emp, status: 'Calculated' }; // Change status to "Calculated"
            }
            return emp;
        });

        setPayrollData(updatedPayrollData);
        setFilteredData(updatedPayrollData); // Update filtered data

        // Optionally, you can also save this to your backend by sending the updated data to your API
        // axios.post('/api/savePayroll', updatedPayrollData);
    };

    // Handle sorting/filtering based on status
    const handleSort = (option) => {
        setSortOption(option);
        setSortDropdownOpen(false); // Close the dropdown after selecting an option
    
        // Filter payroll data by sort option
        if (option === 'All') {
            setFilteredData(payrollData.filter(emp => emp.name.toLowerCase().includes(searchTerm)));
        } else {
            const sortedData = payrollData.filter(emp => emp.status === option);
    
            // Also apply search term if present
            const finalFiltered = sortedData.filter(emp => emp.name.toLowerCase().includes(searchTerm));
            setFilteredData(finalFiltered);
        }
    };

    // Handle search by name
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    
        // First, apply search to the full payroll data
        const filtered = payrollData.filter(emp => emp.name.toLowerCase().includes(value));
    
        // Then, apply any active sorting/filter to the searched data
        if (sortOption !== 'All') {
            setFilteredData(filtered.filter(emp => emp.status === sortOption));
        } else {
            setFilteredData(filtered); // if no sorting, use searched results
        }
    };
    

    // Handle "select all" checkbox
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        const newCheckedItems = {};
        filteredData.forEach(item => {
            newCheckedItems[item.id] = newSelectAll;
        });
        setCheckedItems(newCheckedItems);
    };

    // Handle individual checkbox change
    const handleCheckboxChange = (id) => {
        setCheckedItems(prevCheckedItems => ({
            ...prevCheckedItems,
            [id]: !prevCheckedItems[id]
        }));
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // Function to handle print action
    const handlePrint = () => {
        window.print(); // Simple print functionality
        setIsDropdownVisible(false); // Hide dropdown after action
    };

    // Function to handle download action
    const handleDownload = () => {
        alert('Download functionality not implemented yet.'); // Placeholder
        setIsDropdownVisible(false); // Hide dropdown after action
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar />
            <div id="report" className="p-7 flex-1 h-screen overflow-hidden">
                <h1 className="text-4xl font-bold mb-5">PAYROLL</h1>
                <div className="flex space-x-5">
                    <div className="bg-white shadow p-6 w-full h-[830px]">
                        <div className="flex justify-between border-b mb-4 pb-3">
                            <h1 className="font-semibold text-[18px]">Payroll List</h1>
                            <div className="flex space-x-2">
                                <div className="relative">
                                    <button
                                        onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none font-medium rounded-md text-sm px-3 py-1.5"
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
                                    <input
                                        type="text"
                                        id="table-search"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Search by name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[670px] mt-5">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4">No.</th>
                                        <th scope="col" className="px-4">Name</th>
                                        <th scope="col" className="px-4">Status</th>
                                        <th scope="col" className="px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((payroll, index) => (
                                        <tr key={payroll.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={checkedItems[payroll.id] || false}
                                                    onChange={() => handleCheckboxChange(payroll.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-3">{index + 1}</td>
                                            <td className="px-6 py-3">{payroll.name}</td>
                                            <td className="px-6 py-3">
                                                <span className={`${payroll.status === 'Calculated' ? 'text-[#53db60]' : payroll.status === 'Not yet' ? 'text-[#FF6767]' : 'bg-transparent'} py-2 rounded`}>
                                                    {payroll.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 space-x-1">
                                                <button className="bg-[#1089D3] hover:bg-[#3d9fdb] p-2 rounded-full">
                                                    <img src="./src/assets/edit.png" className="w-4 h-4 filter brightness-0 invert" alt="Edit" />
                                                </button>
                                                <button className="bg-[#FFC470] hover:bg-[#f8b961] p-2 rounded-full">
                                                    <img src="./src/assets/view.png" className="w-4 h-4 filter brightness-0 invert" alt="View" />
                                                </button>
                                                <button className="bg-[#FF6767] hover:bg-[#f35656] p-2 rounded-full">
                                                    <img src="./src/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white shadow p-6 w-full">
                        <div className="shadow p-6 rounded-md">
                            <div className="mb-4">
                                <select
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="" disabled>Select Employee</option>
                                    {employees.map(employee => (
                                        <option key={employee.id} value={employee.name}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex space-x-2 mb-2">
                                <div className="w-full space-y-2">
                                    <p>Date From</p>
                                    <input
                                        type="date"
                                        value={payrollRange.from}
                                        onChange={(e) => setPayrollRange({ ...payrollRange, from: e.target.value })}
                                        className="block w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="w-full space-y-2">
                                    <p>Date To</p>
                                    <input
                                        type="date"
                                        value={payrollRange.to}
                                        onChange={(e) => setPayrollRange({ ...payrollRange, to: e.target.value })}
                                        className="block w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="w-full space-y-2">
                                    <p>Payroll Type</p>
                                    <select
                                        value={payrollType}
                                        onChange={(e) => setPayrollType(e.target.value)}
                                        className="block w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <div className="w-full space-y-2">
                                    <p>Total Hours</p>
                                    <input
                                        type="number"
                                        value={totalHours}
                                        onChange={(e) => setTotalHours(Number(e.target.value))}
                                        className="block w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="w-full space-y-2">
                                    <p>Hourly Rate</p>
                                    <input
                                        type="number"
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                                        className="block w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex w-full justify-end mt-4">
                                <button 
                                    onClick={handleCalculate}
                                    className="bg-[#12B1D1] hover:bg-[#51b5da] text-white w-[90px] p-2 rounded-md"
                                >
                                    Calculate
                                </button>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5 p-6 h-[430px]">
                            <div className="flex justify-end border-b pb-3">
                                <button onClick={toggleDropdown}>
                                    <img src="./src/assets/option.png" alt="Options" className="w-4 h-4" />
                                </button>
                                {isDropdownVisible && (
                                    <div className="absolute right-[30px] mt-5 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                        <ul className="py-1 p-2">
                                            <li onClick={handlePrint} className="p-2 py-2 hover:bg-gray-200 hover:rounded-md cursor-pointer border-b flex"><img src="./src/assets/printer.png" alt="" className="w-5 h-5 mr-2"/>Print</li>
                                            <li onClick={handleDownload} className="p-2 py-2 hover:bg-gray-200 hover:rounded-md cursor-pointer flex"><img src="./src/assets/download.png" alt="" className="w-5 h-5 mr-2"/>Download</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="shadow p-4 h-[280px]">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <caption className="p-5 text-[20px] font-semibold text-gray-900 bg-white">
                                        Payroll Form
                                        <p className="mt-5 text-[16px] text-left font-normal text-gray-500">
                                            Payroll Range: {`${formatDate(payrollRange.from)} to ${formatDate(payrollRange.to)}`}
                                        </p>
                                        <p className="mt-1 text-[16px] text-left font-normal text-gray-500">
                                            Payroll Type: {payrollType}
                                        </p>
                                    </caption>
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Name</th>
                                            <th scope="col" className="px-6 py-3">Hours</th>
                                            <th scope="col" className="px-6 py-3">Rate</th>
                                            <th scope="col" className="px-6 py-3">Net Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payrollEntries.map((entry, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{entry.name}</td>
                                                <td className="px-6 py-4">{entry.hours}</td>
                                                <td className="px-6 py-4">${entry.rate.toFixed(2)}</td>
                                                <td className="px-6 py-4">${entry.net.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex w-full mt-5 justify-end">
                                <button 
                                    onClick={handleDone}  // Now updating status when 'Done' is clicked
                                    className="bg-[#12B1D1] hover:bg-[#51b5da] text-white p-2 w-[80px] rounded-md">
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPayroll;
