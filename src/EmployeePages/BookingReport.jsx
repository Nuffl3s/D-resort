import Sidebar from '../components/EmployeeSidebar';
import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function BookingReport() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [uploadDate, setUploadDate] = useState(null);
    const [filterOption, setFilterOption] = useState('All'); // Filter state
    const [attendanceFilter, setAttendanceFilter] = useState('Day');


    // Pie Chart Data
    const pieData = {
        labels: ['Cottage', 'Lodge', 'Other'], // Example labels
        datasets: [
            {
                data: [50, 30, 20], // Example data
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
                hoverBackgroundColor: ['#45a049', '#1976d2', '#ffb300'],
            },
        ],
    };

     // Handle Generate Report
 

    // Handle Upload Button Click
    const handleUpload = () => {
        Swal.fire({
            title: 'Confirm Upload',
            text: 'Are you sure you want to upload this report?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, upload it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const currentDate = new Date().toLocaleDateString();
                setUploadDate(currentDate);
                Swal.fire('Uploaded!', 'Your report has been uploaded.', 'success');
            }
        });
    };

    return (
        <div className="flex">
            <Sidebar />
            <div id="dashboard" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">BOOKING REPORT</h1>

                <div className="flex gap-10 mt-12">
                    <div className="w-full">
                        {/* Date Range Selector */}
                        <div className="mb-5">
                            <label className="block font-medium mb-2 text-[18px]">Date range</label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2"
                                />
                                <span>to</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2"
                                />
                                <select
                                    value={filterOption}
                                    onChange={(e) => setFilterOption(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="All">All</option>
                                    <option value="Cottage">Cottage</option>
                                    <option value="Lodge">Lodge</option>
                                </select>
                                <button className="bg-[#70b8d3] hover:bg-[#09B0EF] shadow text-white px-4 py-2 rounded">Generate</button>
                            </div>
                        </div>

                        {/* Booking Report Section */}
                        <div className="gap-4 bg-white rounded-md shadow p-6 h-[700px] dark:bg-[#303030] dark:shadow">
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    className="bg-[#70b8d3] hover:bg-[#09B0EF] shadow text-white px-4 py-2 rounded"
                                    onClick={handleUpload}
                                >
                                    Upload
                                </button>
                                <img 
                                    src="src/assets/option.png" 
                                    alt="Options" 
                                    className="w-5 h-5"
                                />
                            </div>

                            {/* Table Section */}
                            <div className="col-span-2">
                                <div className="border border-gray-300 rounded p-4">
                                    <div className="flex justify-center">
                                        <img 
                                            src="src/assets/logo.png" 
                                            alt="Booking Logo" 
                                            className="w-10 h-10"
                                        />
                                    </div>

                                    <h2 className="text-[25px] font-bold mb-2 text-center border-b pb-2">BOOKING REPORT</h2>
                                    <p className="text-sm mb-4 text-center">
                                        Showing {filterOption} bookings from {startDate || 'start'} to {endDate || 'end'}
                                    </p>        
                                    <table className="w-full border-collapse border border-gray-300 text-sm">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-gray-300 px-4 py-2">Booking ID</th>
                                                <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                                                <th className="border border-gray-300 px-4 py-2">Service/Room Type</th>
                                                <th className="border border-gray-300 px-4 py-2">Booking Date</th>
                                                <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                                                <th className="border border-gray-300 px-4 py-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">101</td>
                                                <td className="border border-gray-300 px-4 py-2">John Doe</td>
                                                <td className="border border-gray-300 px-4 py-2">Cottage</td>
                                                <td className="border border-gray-300 px-4 py-2">2024-06-21</td>
                                                <td className="border border-gray-300 px-4 py-2">$120</td>
                                                <td className="border border-gray-300 px-4 py-2">Confirmed</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">102</td>
                                                <td className="border border-gray-300 px-4 py-2">Jane Smith</td>
                                                <td className="border border-gray-300 px-4 py-2">Lodge</td>
                                                <td className="border border-gray-300 px-4 py-2">2024-06-22</td>
                                                <td className="border border-gray-300 px-4 py-2">$80</td>
                                                <td className="border border-gray-300 px-4 py-2">Pending</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-200">
                                                <td colSpan="4" className="border border-gray-300 px-4 py-2 font-bold">TOTAL</td>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">$200</td>
                                                <td className="border border-gray-300 px-4 py-2"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pie Chart Section */}
                    <div className="w-[40%]">
                        <div className="bg-white rounded-md shadow border-gray-300 p-4 flex justify-center mb-2 h-[395px]">
                            <Pie data={pieData} />
                        </div>

                        <div className="bg-white rounded-md shadow border-gray-300 p-4 h-[395px]">
                            <div className="flex justify-between mb-5 border-b pb-2 items-center">
                                <h1 className="text-[18px] font-semibold uppercase">Date Uploaded</h1>
                                <img 
                                    src="src/assets/option.png" 
                                    alt="Sales Report Logo" 
                                    className="w-4 h-4"
                                />                            </div>

                            <div className="flex justify-start mb-4">
                                {['Day', 'Week', 'Month'].map((filter) => (
                                    <button
                                        key={filter}
                                        className={`px-4 py-2 mx-1 text-sm font-medium text-white rounded-lg  ${
                                            attendanceFilter === filter ? 'bg-[#70b8d3]' : 'bg-gray-400'
                                        }`}
                                        onClick={() => setAttendanceFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 pl-2 cursor-pointer w-full border-t border-b">
                                <p className="text-[14px] font-bold text-gray-800  transition duration-300">
                                    REPORT
                                </p>
                                <p
                                    className={`text-[16px] text-gray-600  transition duration-300`}
                                >
                                    {uploadDate || 'No upload yet'}
                                </p>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingReport;
