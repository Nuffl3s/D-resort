import React, { useEffect, useState } from 'react';
import api from '../api';
import AddScheduleModal from '../Modal/AddScheduleModal';
import { handleDownloadExcel, handleDownloadWord } from '../AdminUtils';
import DownloadModal from '../Modal/DownloadModal';
import AdminSidebar from '../components/AdminSidebar';


const AdminSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        api.get('/weekly-schedules/')
            .then((response) => {
                console.log('Fetched schedules:', response.data);
                setSchedules(response.data);
            })
            .catch((error) => console.error('Error fetching schedules:', error));
    }, []);

    const handleModalClose = () => {
        setIsModalOpen(false);
        api.get('/weekly-schedules/')
            .then((response) => setSchedules(response.data))
            .catch((error) => console.error('Error refreshing schedules:', error));
    };

    const handleClearTable = () => {
        setTableRows([]); // Clear all rows
        setCurrentPage(1); // Reset pagination to the first page
    };

    const handleDownloadChoice = (fileType) => {
        if (fileType === 'excel') {
            handleDownloadExcel(tableRows); // Pass tableRows to the function
        } else if (fileType === 'word') {
            handleDownloadWord(tableRows); // Pass tableRows to the function
        }
        setShowModal(false);
    };

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="flex">
            <AdminSidebar />
            <div id="clock" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">WORK SCHEDULES</h1>
                <div className="bg-white p-8 rounded-md w-full border-2 border-gray-400 mt-[50px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-around">
                            <div className="mr-3">
                                    <button className="flex items-center gap-2 bg-[#70b8d3] hover:bg-[#09B0EF] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                                    onClick={() => setShowModal(true)}>
                                        <i><img src="./src/assets/download.png" className="fill-current w-4 h-4" style={{ filter: 'invert(100%)' }} /></i>Download
                                    </button>
                                    
                                    <DownloadModal 
                                        showModal={showModal} 
                                        handleDownloadChoice={handleDownloadChoice} 
                                        setShowModal={setShowModal} 
                                    />
                            </div>
                            <div className="mr-3">
                                    <button className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                                        <i><img src="./src/assets/plus.png" className="fill-current w-4 h-4" style={{ filter: 'invert(100%)' }} /></i>Print
                                    </button>
                            </div>

                            <div className="mr-3">
                                <button className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                                onClick={handleClearTable}>
                                    <i><img src="./src/assets/clear.png" className="fill-current w-4 h-4" style={{ filter: 'invert(100%)' }} /></i>Clear
                                </button>
                            </div>
                                <button className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                                onClick={() => setIsModalOpen(true)} 
                                >
                                    Add
                                </button>
                        </div>
                    </div>
            {isModalOpen && <AddScheduleModal onClose={handleModalClose} />}
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden"></div>
                        <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Mon
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Tue
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Wed
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Thu
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Fri
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Sat
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Sun
                                    </th>
                                    <th className="px-4 py-3 text-left font-bold text-sm text-gray-600 border border-gray-300">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule, index) => (
                                    <tr
                                        key={schedule.id}
                                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                    >
                                        <td className="px-4 py-3 text-sm border border-gray-300">{index + 1}</td>
                                        <td className="px-4 py-3 text-sm border border-gray-300">
                                            {schedule.employee}
                                        </td>
                                        {dayOrder.map((day) => (
                                            <td
                                                key={day}
                                                className="px-4 py-3 text-sm border border-gray-300"
                                            >
                                                {schedule.schedule[day]?.day_off
                                                    ? 'Day Off'
                                                    : `${schedule.schedule[day]?.start_time || 'N/A'} - ${
                                                        schedule.schedule[day]?.end_time || 'N/A'
                                                    } (${schedule.schedule[day]?.duty || 'N/A'})`}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-sm border border-gray-300">
                                            <button className="text-red-500 hover:text-red-700">
                                                Delete
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
    );
};

export default AdminSchedule;
