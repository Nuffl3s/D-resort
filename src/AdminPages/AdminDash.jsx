import { useState, useEffect } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CottageModal from '../Modal/CottageModal';
import LodgeModal from '../Modal/LodgeModal';
import AdminSidebar from '../components/AdminSidebar';

function AdminDash () {

    const [cottageModalOpen, setCottageModalOpen] = useState(false);
    const [lodgeModalOpen, setLodgeModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [date, setDate] = useState(); 

    // New state for filtering attendance
    const [attendanceFilter, setAttendanceFilter] = useState('Day');

    // Sample attendance data
    const attendanceData = [
        { id: 1, name: 'John Doe', date: '2024-09-10', timeIn: '08:00 AM', timeOut: '05:00 PM' },
    ];

    // Update the current time every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);


     // Filter attendance data based on the selected filter
    const filteredAttendanceData = attendanceData.filter(record => {
        return record.date === '2024-09-10'; 
    });

    const salesData = [
        { productName: "Product A", date: "2024-09-10", quantity: 2, price: 50.0 },
        { productName: "Product B", date: "2024-09-11", quantity: 1, price: 30.0 },
        { productName: "Product C", date: "2024-09-11", quantity: 1, price: 30.0 },
        { productName: "Product D", date: "2024-09-11", quantity: 1, price: 30.0 },
        { productName: "Product E", date: "2024-09-11", quantity: 1, price: 30.0 },
        { productName: "Product F", date: "2024-09-11", quantity: 1, price: 30.0 },
        { productName: "Product G", date: "2024-09-11", quantity: 1, price: 30.0 },
        { productName: "Product H", date: "2024-09-11", quantity: 1, price: 30.0 },
        { productName: "Product I", date: "2024-09-11", quantity: 1, price: 30.0 },
    ];
    return (
        <div className="flex">
            <AdminSidebar />
            <div id="dashboard" className="p-6 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">DASHBOARD</h1>
                <div className="flex justify-between">
                    <div className="flex-row w-full mr-5">
                        <div className="flex space-x-10 h-[200px]">
                            <div className="bg-gradient-to-r from-[#1089D3] to-[#12B1D1] rounded-lg shadow-xl w-[470px] relative">
                                <div className="p-4">
                                    <h1 className="text-lg font-semibold mb-2 text-white">COTTAGE</h1>
                                    <p className="text-sm mb-4 text-white">
                                        Number Booked: 5
                                        <br />
                                        Availability: 3
                                    </p>
                                    <button
                                        onClick={() => setCottageModalOpen(true)}
                                        className="absolute bottom-4 right-4 duration-300 bg-black/0 hover:bg-black/25 text-white font-bold py-2 px-4 rounded"
                                    >
                                        View More
                                    </button>

                                    <CottageModal 
                                        isOpen={cottageModalOpen} // Modal open state
                                        onClose={() => setCottageModalOpen(false)} // Close modal function
                                    />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-[#1089D3] to-[#12B1D1] rounded-lg shadow-xl w-[470px] relative">
                                <div className="p-4">
                                    <h1 className="text-lg font-semibold mb-2 text-white">LODGE</h1>
                                    <p className="text-sm mb-4 text-white">
                                        Number Booked: 8
                                        <br />
                                        Availability: 2
                                    </p>
                                    <button
                                        onClick={() => setLodgeModalOpen(true)}
                                        className="absolute bottom-4 right-4 duration-300 bg-black/0 hover:bg-black/25 text-white font-bold py-2 px-4 rounded"
                                    >
                                        View More
                                    </button>

                                    <LodgeModal 
                                        isOpen={lodgeModalOpen} // Modal open state
                                        onClose={() => setLodgeModalOpen(false)} // Close modal function
                                    />
                                </div>
                            </div>  
                        </div>

                        <div className="p-6 w-full mx-auto mt-8 bg-white shadow-lg rounded-lg border-gray-200 mb-4 min-h-[610px]">
                            <div className="flex justify-between">
                                <h1 className="text-xl font-bold text-start mb-10">Sales Summary</h1>
                                <button className="bg-[#70b8d3] hover:bg-[#09B0EF] mb-10 px-2 text-white text-sm rounded-[5px]">View all</button>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="relative">
                                    <div className="max-h-[500px] overflow-y-auto table-scrollbar-hide">
                                        <table className="min-w-full shadow rounded-lg border-collapse">
                                            <thead className="sticky top-0 bg-white">
                                                <tr className="text-center">
                                                    <th className="text-left px-5 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">Product Name</th>
                                                    <th className="px-5 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                                    <th className="px-5 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                                                    <th className="px-5 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">Price</th>
                                                    <th className="px-5 py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesData.map((sale, index) => (
                                                <tr key={index} className="text-center">
                                                    <td className="text-left px-5 py-5 border-b border-gray-200 bg-white text-sm">{sale.productName}</td>
                                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{sale.date}</td>
                                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{sale.quantity}</td>
                                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${sale.price.toFixed(2)}</td>
                                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${(sale.quantity * sale.price).toFixed(2)}</td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                        
                    <div className="flex-col mr-2 ml-4">
                        <div className="p-6 bg-white shadow-lg rounded-lg border-gray-200 mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800 text-center">Calendar</h2>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={date} 
                                    onChange={(newValue) => setDate(newValue)} 
                                />
                            </LocalizationProvider>
                        </div>

                        {/* Attendance Tracker */}
                        <div className="p-6 w-[500px] bg-white shadow-lg rounded-lg border-gray-200">
                            <div className="flex items-center mb-4 border-b pb-2 border-gray-200 justify-between">
                                <h2 className="text-2xl font-semibold text-gray-800">Attendance Tracker</h2>
                                <div className="text-gray-600 text-xl font-mono">
                                    {currentTime.toLocaleTimeString()}
                                </div>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex justify-start mb-4">
                                {['Day', 'Week', 'Month'].map((filter) => (
                                    <button
                                        key={filter}
                                        className={`px-4 py-2 mx-1 text-sm font-medium text-white rounded-lg ${
                                            attendanceFilter === filter ? 'bg-[#70b8d3]' : 'bg-gray-400'
                                        }`}
                                        onClick={() => setAttendanceFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* Attendance Table */}
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Time In
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Time Out
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAttendanceData.map((record, index) => (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
                                                {index + 1}
                                            </td>
                                            <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
                                                {record.name}
                                            </td>
                                            <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
                                                {record.date}
                                            </td>
                                            <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
                                                {record.timeIn}
                                            </td>
                                            <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
                                                {record.timeOut}
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
}

export default AdminDash;