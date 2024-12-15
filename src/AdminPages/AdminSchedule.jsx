/* eslint-disable no-undef */
import { useEffect, useState, useRef } from 'react';
import api from '../api';
import AddScheduleModal from '../Modal/AddScheduleModal';
import { handleDownloadExcel, handleDownloadWord } from '../Utils/scheduleUtils';
import DownloadModal from '../Modal/DownloadModal';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';
import Swal from 'sweetalert2';

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
        api.get('/weekly-schedules/').then((response) => setSchedules(response.data)).catch((error) => console.error('Error refreshing schedules:', error));
    };

    const handleDownloadChoice = (type, context) => {
        console.log(`Download choice: ${type} for ${context}`);
        
        if (context === 'schedule') {
            // Pass the schedules data to the download functions
            if (type === 'excel') {
                handleDownloadExcel(schedules)
                    .then(() => console.log('Excel download triggered successfully'))
                    .catch((error) => console.error('Error downloading Excel:', error));
            } else if (type === 'word') {
                handleDownloadWord(schedules)
                    .then(() => console.log('Word download triggered successfully'))
                    .catch((error) => console.error('Error downloading Word:', error));
            }
        }

        setShowModal(false); // Close the modal after selection
    };

    const handlePrint = () => {
        window.print(); // Trigger the print dialog
        setIsDropdownVisible(false); // Close dropdown after print
    };

    const handleDownload = () => {
        setShowModal(true); // Open the download modal
        setIsDropdownVisible(false); // Close dropdown after download option is clicked
    };


    const handleDeleteSchedule = (scheduleId) => {
        console.log("Schedule ID:", scheduleId);  // Debug the ID
        api.delete(`/weekly-schedules/${scheduleId}/`)
            .then((response) => {
                console.log('Schedule deleted successfully:', response.data);
                // Update the state to remove the deleted schedule from the table
                setSchedules((prevSchedules) =>
                    prevSchedules.filter(schedule => schedule.id !== scheduleId)
                );
                // SweetAlert for successful deletion
                Swal.fire({
                    icon: 'success',
                    title: 'Schedule Deleted',
                    text: 'The schedule has been permanently deleted.',
                    confirmButtonText: 'OK',
                });
            })
            .catch((error) => {
                console.error('Error deleting schedule:', error.response || error.message || error);
                // SweetAlert for error in deletion
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Delete',
                    text: 'There was an issue deleting the schedule. Please try again.',
                    confirmButtonText: 'OK',
                });
            });
    };
    
    const handleClearTable = () => {
        console.log('Clearing all schedules...');
        api.delete('/weekly-schedules/clear/')  // This URL should point to your clear_all endpoint
            .then((response) => {
                console.log('All schedules deleted successfully:', response.data);
                setSchedules([]);  // Clear the state in the frontend
                // SweetAlert for successful clearing
                Swal.fire({
                    icon: 'success',
                    title: 'All Schedules Deleted',
                    text: 'All schedules have been permanently deleted.',
                    confirmButtonText: 'OK',
                });
            })
            .catch((error) => {
                console.error('Error deleting schedules:', error.response || error.message || error);
                // SweetAlert for error in clearing all schedules
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Clear All',
                    text: 'There was an issue clearing all schedules. Please try again.',
                    confirmButtonText: 'OK',
                });
            });
    };
    
    
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', ];

    return (
        <div className="flex dark:bg-[#111827] bg-gray-100">
            <AdminSidebar />
            <div id="clock" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">WORK SCHEDULES</h1>
                <div className="bg-white p-8 rounded-md w-full shadow mt-[50px] dark:bg-[#374151]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-around">
                            <div>
                                 <DownloadModal 
                                    showModal={showModal} 
                                    handleDownloadChoice={handleDownloadChoice} 
                                    setShowModal={setShowModal} 
                                    pageContext="schedule" // Pass "schedule" context
                                />
                            </div>
                            <div className="mr-3">
                                <button className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#62c5e9] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
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
                                <div ref={dropdownRef} className="absolute right-1 top-3 mt-2 w-40 bg-white border border-gray-400 rounded-md shadow-lg z-10 dark:bg-[#374151] dark:text-[#e7e6e6]">
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
                    </div>
                    {isModalOpen && <AddScheduleModal onClose={handleModalClose} />}
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full rounded-md overflow-hidden">
                            <table id="schedule-table" className="min-w-full border-collapse  rounded-md ">
                                <thead className="bg-gray-100 dark:bg-[#1f2937]">
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

                                        <th className="px-5 py-3  text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { schedules.map((schedule, index) => (
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
                                            <td className="px-4 py-3 text-sm border border-gray-300">
                                                <button
                                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                                    className="bg-[#FF6767] hover:bg-[#f35656] p-3 rounded-full"
                                                >
                                                    <img src="./src/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
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
};

export default AdminSchedule;
