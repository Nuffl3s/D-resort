/* eslint-disable no-undef */
import { useEffect, useState, useRef } from 'react';
import api from '../api';
import AddScheduleModal from '../Modal/AddScheduleModal';
import { handleDownloadExcel, handleDownloadWord } from '../AdminUtils';
import DownloadModal from '../Modal/DownloadModal';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';


const AdminSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Create refs for the dropdown and the button to toggle it
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        applyTheme();
    }, []);

    useEffect(() => {
        api.get('/weekly-schedules/')
            .then((response) => {
                console.log('Fetched schedules:', response.data);
                setSchedules(response.data);
            })
            .catch((error) => console.error('Error fetching schedules:', error));

        // Close the dropdown when clicking outside of it
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        api.get('/weekly-schedules/')
            .then((response) => setSchedules(response.data))
            .catch((error) => console.error('Error refreshing schedules:', error));
    };

    const handleDownloadChoice = (fileType) => {
        if (fileType === 'excel') {
            handleDownloadExcel(tableRows); // Ensure you pass the correct data (tableRows)
        } else if (fileType === 'word') {
            handleDownloadWord(tableRows);
        }
        setShowModal(false);
    };

    const handlePrint = () => {
        window.print(); // Trigger the print dialog
        setIsDropdownVisible(false); // Close dropdown after print
    };
    

    const handleDownload = () => {
        setShowModal(true); // Open the download modal
        setIsDropdownVisible(false); // Close dropdown after download option is clicked
    };

    const handleClearTable = () => {
        setTableRows([]); // Clear all rows
        setCurrentPage(1); // Reset pagination to the first page
    };

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="flex dark:bg-[#1c1e21]">
            <AdminSidebar />
            <div id="clock" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">WORK SCHEDULES</h1>
                <div className="bg-white p-8 rounded-md w-full shadow mt-[50px] dark:bg-[#303030]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-around">
                            <div>
                                 <DownloadModal 
                                    showModal={showModal} 
                                    handleDownloadChoice={handleDownloadChoice} 
                                    setShowModal={setShowModal} 
                                />
                            </div>
                            <div className="mr-3">
                                <button className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                                    onClick={handleClearTable}>
                                    <img src="./src/assets/clear.png" alt="Clear" className="w-4 h-4 filter invert brightness-0" />
                                    Clear
                                </button>
                            </div>
                            <button className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                                onClick={() => setIsModalOpen(true)} >
                                Add
                            </button>
                        </div>

                        {/* Options Button */}
                        <div className="flex justify-end relative">
                            <button 
                                ref={buttonRef} // Attach the ref to the button
                                onClick={toggleDropdown} 
                                className="flex items-center gap-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                            >
                                <img src="./src/assets/option.png" alt="Options" className="w-4 h-4 dark:invert" />
                            </button>
                            {isDropdownVisible && (
                                <div ref={dropdownRef} className="absolute right-1 top-3 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                    <ul className="py-1 p-2">
                                        <li onClick={handleDownload} className="p-2 py-2 hover:bg-gray-200 hover:rounded-md cursor-pointer border-b flex">
                                            <img src="./src/assets/download.png" alt="Download" className="w-5 h-5 mr-2" />
                                            Download
                                        </li>
                                        <li onClick={handlePrint} className="p-2 py-2 hover:bg-gray-200 hover:rounded-md cursor-pointer flex">
                                            <img src="./src/assets/printer.png" alt="Print" className="w-5 h-5 mr-2" />
                                            Print
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    {isModalOpen && <AddScheduleModal onClose={handleModalClose} />}
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full rounded-md overflow-hidden">
                            <table id="schedule-table" className="min-w-full border-collapse  rounded-md ">
                                <thead className="bg-gray-100 dark:bg-[#424242]">
                                    <tr>
                                        <th className="px-5 py-3   text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">
                                            #
                                        </th>
                                        <th className="px-5 py-3  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">
                                            Name
                                        </th>
                                        {dayOrder.map((day) => (
                                            <th key={day} className="px-5 py-3  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.map((schedule, index) => (
                                        <tr key={schedule.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-3 text-sm border border-gray-300">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm border border-gray-300">{schedule.employee}</td>
                                            {dayOrder.map((day) => (
                                                <td key={day} className="px-4 py-3 text-sm border border-gray-300">
                                                    {schedule.schedule[day]?.day_off
                                                        ? 'Day Off'
                                                        : `${schedule.schedule[day]?.start_time || 'N/A'} - ${
                                                              schedule.schedule[day]?.end_time || 'N/A'
                                                          } (${schedule.schedule[day]?.duty || 'N/A'})`}
                                                </td>
                                            ))}
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
};

export default AdminSchedule;
