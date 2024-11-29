import { useState, useRef, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';

function AdminAttendance() {
  // State hooks
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [setShowModal] = useState(false);

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

  // Handle download action
  const handleDownload = () => {
    setShowModal(true); // Open the download modal
    setIsDropdownVisible(false); // Close dropdown after download option is clicked
  };

  useEffect(() => {
    applyTheme();
}, []);

  return (
    <div className="flex dark:bg-[#111827] bg-gray-100">
        <AdminSidebar />
        <div id="calendar" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
            <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">ATTENDANCE</h1>
            <div className="bg-white p-8 rounded-lg w-full border mt-[50px] dark:bg-[#374151] dark:border-[#374151]">
                <div className="flex justify-end relative">
                    <button
                        ref={buttonRef} // Attach the ref to the button
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
                                    alt="Print"
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
                                <tr>
                                    <td className="px-5 py-5 border-b border-r text-sm dark:border-gray-400">
                                        <p className="whitespace-no-wrap">1</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-r border-gray-200 text-sm dark:border-gray-400">
                                        <p className="whitespace-no-wrap">Angelo Y. Yasay</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-r border-gray-200 text-sm dark:border-gray-400">
                                        <p className="whitespace-no-wrap">293d1</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-r border-gray-200 text-sm dark:border-gray-400">
                                        <p className="whitespace-no-wrap">07/06/2024</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-r border-gray-200 text-sm dark:border-gray-400">
                                        <p className="whitespace-no-wrap">10:30 am</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-r border-gray-200 text-sm dark:border-gray-400">
                                        <p className="whitespace-no-wrap">3:00 pm</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm dark:border-gray-400">

                                    <div className="flex space-x-1">
                                        <button className="bg-[#1089D3] hover:bg-[#3d9fdb] p-3 rounded-full">
                                            <img src="/assets/edit.png" className="w-4 h-4 filter brightness-0 invert" alt="Edit" />
                                        </button>
                                        <button className="bg-[#FF6767] hover:bg-[#f35656] p-3 rounded-full">
                                            <img src="/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
                                        </button>
                                    </div>
                                    </td>
                                </tr>
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
    </div>
  );
}

export default AdminAttendance;
