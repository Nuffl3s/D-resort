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

function EmployeeSale() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Pie Chart Data
    const pieData = {
        labels: ['Shampoo', 'Conditioner', 'Soap'], // Example labels
        datasets: [
            {
                data: [50, 30, 20], // Example sales data
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'], // Colors for the chart sections
                hoverBackgroundColor: ['#45a049', '#1976d2', '#ffb300'], // Hover colors
            },
        ],
    };

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
                // Perform upload logic here
                Swal.fire('Uploaded!', 'Your report has been uploaded.', 'success');
            }
        });
    };

    return (
        <div className="flex">
            <Sidebar />
            <div id="dashboard" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">SALES REPORT</h1>
                
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
                                <button className="bg-[#70b8d3] hover:bg-[#09B0EF] text-white px-4 py-2 rounded">Generate</button>
                            </div>
                        </div>

                        {/* Sales Report Section */}
                        <div className="gap-4 bg-white rounded-md shadow p-6 h-[700px] dark:bg-[#303030] dark:shadow">
                            <div className="flex justify-between items-center mb-4 ">
                                {/* Upload Button */}
                                <button
                                    className="bg-[#70b8d3] hover:bg-[#09B0EF] text-white px-4 py-2 rounded"
                                    onClick={handleUpload}
                                >
                                    Upload
                                </button>
                                <img 
                                    src="src/assets/option.png" 
                                    alt="Sales Report Logo" 
                                    className="w-5 h-5"
                                />
                            </div>
                            {/* Table Section */}
                            <div className="col-span-2">
                                <div className="border border-gray-300 rounded p-4">
                                    {/* Image at the Start */}
                                    <div className="flex justify-center ">
                                        <img 
                                            src="src/assets/logo.png" 
                                            alt="Sales Report Logo" 
                                            className="w-10 h-10"
                                        />
                                    </div>
                                    <h2 className="text-[25px] font-bold mb-2 text-center border-b pb-2">SALES REPORT</h2>
                                    <p className="text-sm mb-4 text-center">2024-06-21 TILL DATE 2024-06-22</p>
                                    <table className="w-full border-collapse border border-gray-300 text-sm">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                                <th className="border border-gray-300 px-4 py-2">Product Name</th>
                                                <th className="border border-gray-300 px-4 py-2">Qty</th>
                                                <th className="border border-gray-300 px-4 py-2">Avg Price</th>
                                                <th className="border border-gray-300 px-4 py-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">2024-06-21</td>
                                                <td className="border border-gray-300 px-4 py-2">Shampoo</td>
                                                <td className="border border-gray-300 px-4 py-2">5</td>
                                                <td className="border border-gray-300 px-4 py-2">10</td>
                                                <td className="border border-gray-300 px-4 py-2">50</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">2024-06-21</td>
                                                <td className="border border-gray-300 px-4 py-2">Shampoo</td>
                                                <td className="border border-gray-300 px-4 py-2">5</td>
                                                <td className="border border-gray-300 px-4 py-2">10</td>
                                                <td className="border border-gray-300 px-4 py-2">50</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">2024-06-22</td>
                                                <td className="border border-gray-300 px-4 py-2">Shampoo</td>
                                                <td className="border border-gray-300 px-4 py-2">5</td>
                                                <td className="border border-gray-300 px-4 py-2">10</td>
                                                <td className="border border-gray-300 px-4 py-2">50</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-200">
                                                <td colSpan="4" className="border border-gray-300 px-4 py-2 font-bold">GRAND TOTAL</td>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">150</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Pie Chart Section */}
                    <div className="w-[40%]">
                        <div className="bg-white rounded-md shadow border-gray-300 p-4 h-full flex justify-center">
                            <Pie data={pieData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeSale;
