import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { handleDownloadAttendanceExcel, handleDownloadAttendanceWord } from '../Utils/attendanceUtils';
import DownloadModal from '../Modal/DownloadModal';
import api from '../api';

function AdminAttendance() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tableRows, setTableRows] = useState([]);  // State to store attendance data
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 30 days");
  const [itemsPerPage] = useState(10); // Items per page

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleChange = (label) => {
    setSelectedDateRange(label);
    setDateDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handlePrint = () => {
    window.print();
    setIsDropdownVisible(false);
  };

  const handleDownload = () => {
    setShowModal(true);
    setIsDropdownVisible(false);
  };

  const handleDownloadChoice = (type, context) => {
    if (context === 'attendance') {
      if (type === 'excel') {
        handleDownloadAttendanceExcel(tableRows)
          .then(() => console.log('Excel download triggered successfully'))
          .catch((error) => console.error('Error downloading Excel:', error));
      } else if (type === 'word') {
        handleDownloadAttendanceWord(tableRows)
          .then(() => console.log('Word download triggered successfully'))
          .catch((error) => console.error('Error downloading Word:', error));
      }
    }
    setShowModal(false);
  };

  // Poll every 5 seconds to get the latest attendance data
  const fetchAttendanceData = async () => {
    try {
        const response = await api.get('http://localhost:8000/api/attendance/');
        console.log('Fetched attendance data:', response.data);
        setTableRows(response.data);  // Update table rows with the fetched data
    } catch (error) {
        console.error('Error fetching attendance data:', error);
    }
};

useEffect(() => {
    const interval = setInterval(() => {
        fetchAttendanceData();
    }, 5000);

    // Initial fetch on mount
    fetchAttendanceData();

    return () => clearInterval(interval);  // Cleanup interval on unmount
}, []);

// Calculate indexes for pagination
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = tableRows.slice(indexOfFirstItem, indexOfLastItem);

console.log('Current Items:', currentItems);  // Log the current items for debugging

const paginate = (pageNumber) => {
  setCurrentPage(pageNumber);
};

const totalPages = Math.ceil(tableRows.length / itemsPerPage);

const firstItemIndex = indexOfFirstItem + 1;
const lastItemIndex = Math.min(indexOfLastItem, tableRows.length);
const showingText = `Showing ${firstItemIndex}-${lastItemIndex} of ${tableRows.length} entries`;



  return (
    <div className="flex dark:bg-[#111827] bg-gray-100">
        <AdminSidebar />
        <div id="calendar" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
            <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">ATTENDANCE</h1>
            <div className="bg-white p-7 rounded-lg w-full border mt-[30px] dark:bg-[#374151] dark:border-[#374151]">
                <div className="flex justify-between relative">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none font-medium rounded-md text-sm px-3 py-1.5"
                                type="button"
                                >
                                {selectedDateRange}
                                <svg
                                    className={`w-2.5 h-2.5 ms-2.5 transform transition-transform ${dateDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
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
                            {dateDropdownOpen && (
                            <div className="absolute z-20 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
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
                                                className="w-full ms-2 text-sm font-medium text-gray-900"
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
                
                    {/* Options Button */}
                    <button
                        ref={buttonRef}
                        onClick={toggleDropdown}
                        className="flex items-center gap-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                        >
                        <img src="src/assets/option.png" alt="Options" className="w-4 h-4 dark:invert" />
                    </button>
                    {isDropdownVisible && (
                    <div
                        ref={dropdownRef}
                        className="absolute right-1 top-3 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10 dark:bg-[#374151] dark:text-[#e7e6e6]"
                    >
                        <ul className="py-1 p-2">
                            <li
                                onClick={handleDownload}
                                className="p-2 py-2 hover:bg-gray-200 hover:rounded-md cursor-pointer flex group dark:hover:text-gray-800 border-b dark:border-gray-400"
                            >
                                <img
                                src="./src/assets/download.png"
                                alt="Download"
                                className="w-5 h-5 mr-2 dark:invert dark:group-hover:invert-0 dark:group-hover:brightness-0"
                                />
                                Download
                            </li>
                            <li
                                onClick={handlePrint}
                                className="p-2 py-2 hover:bg-gray-200 hover:rounded-md cursor-pointer flex group dark:hover:text-gray-800"
                            >
                                <img
                                src="./src/assets/printer.png"
                                alt="Print"
                                className="w-5 h-5 mr-2 dark:invert dark:group-hover:invert-0 dark:group-hover:brightness-0"
                                />
                                Print
                            </li>
                        </ul>
                    </div>
                    )}
                </div>

                {/* Table Section */}
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead className="border-gray-200 bg-gray-100 text-gray-600 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">ID</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Name</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Time in</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Time out</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentItems.map((row) => {
                                    console.log('Row rendered:', row); // Log each row data
                                    return (
                                        <tr key={row.id}>
                                            <td className="px-5 py-5 border-b border-r text-sm">{row.user}</td>
                                            <td className="px-5 py-5 border-b border-r text-sm">{row.name}</td>
                                            <td className="px-5 py-5 border-b border-r text-sm">{row.date}</td>
                                            <td className="px-5 py-5 border-b border-r text-sm">{row.time_in}</td>
                                            <td className={`px-5 py-5 border-b border-r text-sm ${!row.time_out ? 'text-red-400' : ''}`}>
                                                {row.time_out || 'No time out yet'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                <div className="px-2 py-2 bg-white flex justify-between xs:flex-row items-center xs:justify-between dark:bg-[#66696e]">
                    {/* Showing entries text */}
                    <div className="text-sm text-gray-600 dark:text-gray-300">{showingText}</div>

                    <div className="flex mt-2 xs:mt-0 ">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className="text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded-l"
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        &nbsp; &nbsp;
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            className="text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded-r"
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <DownloadModal
            showModal={showModal}
            handleDownloadChoice={handleDownloadChoice}
            setShowModal={setShowModal}
            page="attendance"
        />
    </div>
  );
}

export default AdminAttendance;
