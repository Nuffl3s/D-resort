import AdminSidebar from '../components/AdminSidebar';
import { useState, useEffect} from 'react';
import { handleDownloadExcel, handleDownloadWord } from '../AdminUtils';
import axios from 'axios';
import DownloadModal from '../Modal/DownloadModal';
import AddScheduleModal from '../Modal/AddScheduleModal'

function AdminSchedule () {
    const [tableRows, setTableRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employee, setEmployees] = useState([]);
    const [modalData, setModalData] = useState({
        name: '',
        schedule: {
            monday: { startTime: null, endTime: null, duty: '', dayOff: false },
            tuesday: { startTime: null, endTime: null, duty: '', dayOff: false },
            wednesday: { startTime: null, endTime: null, duty: '', dayOff: false },
            thursday: { startTime: null, endTime: null, duty: '', dayOff: false },
            friday: { startTime: null, endTime: null, duty: '', dayOff: false },
            saturday: { startTime: null, endTime: null, duty: '', dayOff: false },
            sunday: { startTime: null, endTime: null, duty: '', dayOff: false },
        }
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/employees/');
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
    
        fetchEmployees();
    }, []);

    const rowsPerPage = 7;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = currentPage * rowsPerPage;
    const totalPages = Math.ceil(tableRows.length / rowsPerPage);

    // Modal handlers
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleModalSubmit = (e) => {
        e.preventDefault();
        const sanitizedSchedule = Object.keys(modalData.schedule).reduce((acc, day) => {
            const schedule = modalData.schedule[day];
            acc[day] = {
                ...schedule,
                startTime: schedule.startTime ? schedule.startTime : null,
                endTime: schedule.endTime ? schedule.endTime : null,
            };
            return acc;
        }, {});
    
        handleAddRow({
            ...modalData,
            schedule: sanitizedSchedule
        });
    
        setModalData({
            name: '',
            schedule: {
                monday: { startTime: null, endTime: null, duty: '', dayOff: false },
                tuesday: { startTime: null, endTime: null, duty: '', dayOff: false },
                wednesday: { startTime: null, endTime: null, duty: '', dayOff: false },
                thursday: { startTime: null, endTime: null, duty: '', dayOff: false },
                friday: { startTime: null, endTime: null, duty: '', dayOff: false },
                saturday: { startTime: null, endTime: null, duty: '', dayOff: false },
                sunday: { startTime: null, endTime: null, duty: '', dayOff: false },
            }
        });
        closeModal();
    };

    const handleAddRow = (newRow) => {
        setTableRows([...tableRows, { id: tableRows.length + 1, ...newRow }]);
        if ((tableRows.length + 1) > currentPage * rowsPerPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleDeleteRow = (rowId) => {
        const updatedRows = tableRows.filter(row => row.id !== rowId).map((row, index) => ({
            ...row,
            id: index + 1
        }));
        setTableRows(updatedRows);

        if (updatedRows.length <= (currentPage - 1) * rowsPerPage && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (updatedRows.length === 0) {
            setCurrentPage(1);
        }
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
                        </div>
                    </div>

                    {/* Table */}
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="clmn">#</th>
                                        <th className="clmn">Name</th>
                                        <th className="clmn">Mon</th>
                                        <th className="clmn">Tue</th>
                                        <th className="clmn">Wed</th>
                                        <th className="clmn">Thu</th>
                                        <th className="clmn">Fri</th>
                                        <th className="clmn">Sat</th>
                                        <th className="clmn">Sun</th>
                                        <th className="clmn">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {tableRows.slice(startIndex, endIndex).map((row, rowIndex) => (
                                        <tr key={row.id}>
                                            <td className="px-5 py-5 border-b border-r bg-white text-sm text-center">{rowIndex + startIndex + 1}</td>
                                            <td className="px-5 py-5 border-b border-r bg-white text-sm text-center">{row.name}</td>
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                                                const { startTime, endTime, duty, dayOff } = row.schedule[day];
                                                const formattedStartTime = startTime ? startTime.format('hh:mm A') : '';
                                                const formattedEndTime = endTime ? endTime.format('hh:mm A') : '';
                                                return (
                                                    <td key={day} className="px-5 py-5 border-b border-r bg-white text-sm text-center">
                                                        <div>
                                                            {formattedStartTime && formattedEndTime ? `${formattedStartTime} - ${formattedEndTime}` : ''}
                                                        </div>
                                                        {duty && (
                                                            <div>{duty}</div>
                                                        )}
                                                        {dayOff && (
                                                            <div>Day Off</div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-5 py-5 border-b border-r bg-white text-sm text-center">
                                                <div className="flex space-x-1">
                                                    <button className="bg-[#1089D3] hover:bg-[#3d9fdb] p-3 rounded-full">
                                                        <img src="./src/assets/edit.png" className="w-4 h-4 filter brightness-0 invert" alt="Edit" />
                                                    </button>
                                                    <button className="bg-[#FF6767] hover:bg-[#f35656] p-3 rounded-full" onClick={() => handleDeleteRow(row.id)}>
                                                        <img src="./src/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            

                            <div className="add-design w-full">
                                <button
                                    onClick={openModal} // Open the modal
                                    className="w-full flex uppercase justify-center items-center gap-2 rounded-m font-semibold tracking-wide cursor-pointer"
                                >
                                    <i><img src="./src/assets/tab.png" className="fill-current w-4 h-4" /></i>Add

                                    <AddScheduleModal 
                                        isModalOpen={isModalOpen} 
                                        closeModal={closeModal} 
                                        handleModalSubmit={handleModalSubmit} 
                                        modalData={modalData} 
                                        setModalData={setModalData} 
                                        employee={employee} 
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Pagination buttons */}
                        <div className="px-5 py-5 bg-white flex flex-col xs:flex-row items-end xs:justify-between">
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    className={`text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded-l cursor-pointer`}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`text-sm ${currentPage === index + 1 ? 'bg-gray-200' : 'bg-gray-100'} transition duration-150 hover:bg-gray-400 font-semibold py-2 px-4 cursor-pointer`}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    className={`text-sm text-indigo-50 transition duration-150 hover:bg-[#09B0EF] bg-[#70b8d3] font-semibold py-2 px-4 rounded-r cursor-pointer`}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={endIndex >= tableRows.length}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSchedule;