import { useState, useRef, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';
import { handleDownloadAttendanceExcel, handleDownloadAttendanceWord } from '../Utils/attendanceUtils';
import DownloadModal from '../Modal/DownloadModal'; // Assuming you have this component in the same folder

function AdminAttendance() {
  // State hooks
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controls the visibility of the download modal

  // Attendance data (this would usually come from an API or state)
  const tableRows = [
    {
      id: 1,
      name: "Angelo Y. Yasay",
      employeeId: "293d1",
      date: "07/06/2024",
      timeIn: "10:30 am",
      timeOut: "3:00 pm",
    },
    // More rows...
  ];

  // Refs for dropdown functionality
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Handle print action
  const handlePrint = () => {
    window.print(); // Trigger the print dialog
    setIsDropdownVisible(false); // Close dropdown after print
  };

  // Handle download action (open the modal)
  const handleDownload = () => {
    setShowModal(true); // Open the download modal
    setIsDropdownVisible(false); // Close dropdown after download option is clicked
  };

  // Handle download choice (Excel/Word)
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

    setShowModal(false); // Close the modal after download choice
};

  useEffect(() => {
    applyTheme(); // Apply dark or light theme
  }, []);

  return (
    <div className="flex dark:bg-[#111827] bg-gray-100">
        <AdminSidebar />
        <div id="calendar" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
            <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">ATTENDANCE</h1>
            <div className="bg-white p-8 rounded-lg w-full border mt-[50px] dark:bg-[#374151] dark:border-[#374151]">
                <div className="flex justify-end relative">
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
                    <table className="min-w-full leading-normal ">
                        <thead className="border-gray-200 bg-gray-100 text-gray-600 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Name</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Employee ID</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Date</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Time in</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Time out</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider ">Action</th>
                        </tr>
                        </thead>

                        <tbody className="text-gray-900 bg-white dark:bg-[#66696e] dark:text-[#e7e6e6]">
                        {tableRows.map((row, index) => (
                            <tr key={row.id}>
                            <td className="px-5 py-5 border-b border-r text-sm dark:border-gray-400">{index + 1}</td>
                                <td className="px-5 py-5 border-b border-r text-sm dark:border-gray-400">{row.name}</td>
                                <td className="px-5 py-5 border-b border-r text-sm dark:border-gray-400">{row.employeeId}</td>
                                <td className="px-5 py-5 border-b border-r text-sm dark:border-gray-400">{row.date}</td>
                                <td className="px-5 py-5 border-b border-r text-sm dark:border-gray-400">{row.timeIn}</td>
                                <td className="px-5 py-5 border-b border-r text-sm dark:border-gray-400">{row.timeOut}</td>
                                <td className="px-5 py-5 border-b border-r text-sm dark:border-gray-400">
                                    <div className="flex space-x-1">
                                        <button className="bg-[#1089D3] hover:bg-[#3d9fdb] p-3 rounded-full">
                                            <img src="src/assets/edit.png" className="w-4 h-4 filter brightness-0 invert" alt="Edit" />
                                        </button>
                                        <button className="bg-[#FF6767] hover:bg-[#f35656] p-3 rounded-full">
                                            <img src="src/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                        <div className="px-5 py-5 bg-white flex flex-col xs:flex-row items-end xs:justify-between dark:bg-[#66696e]">
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button className="text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded-l">
                                    Prev
                                </button>
                                &nbsp; &nbsp;
                                <button className="text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded-r">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Modal for download options */}
        <DownloadModal
            showModal={showModal}
            handleDownloadChoice={handleDownloadChoice}
            setShowModal={setShowModal}
            pageContext="attendance" // Context for the modal
        />
    </div>
  );
}

export default AdminAttendance;
