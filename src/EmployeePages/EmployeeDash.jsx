import { useState, useEffect } from 'react';
import Sidebar from '../components/EmployeeSidebar';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import api from '../api';

function EmployeeDash() {
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Cottage');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [date, setDate] = useState();

    const tableHeaders =
        selectedCategory === 'Cottage'
            ? ['#', 'Type', 'Capacity', '6AM - 6PM', '6AM - 12MN', '6PM - 6AM', '24 HRS', 'Status']
            : ['#', 'Type', 'Capacity', '3 Hrs', '6 Hrs', '12 Hrs', '24 Hrs', 'Status'];

    const fetchData = async () => {
        const endpoint = selectedCategory === 'Cottage' ? '/cottages/' : '/lodges/';
        try {
            const response = await api.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategory]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);
    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <div id="dashboard" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">DASHBOARD</h1>
                <div className="flex justify-between">
                    <div className="flex-row w-full mr-5">
                        <div className="flex space-x-10 h-[200px]">
                            <div 
                                className="relative rounded-lg shadow-xl w-[470px] cursor-pointer"
                                style={{ backgroundImage: "url('./src/assets/cottagebg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#000] to-[#12B1D1] opacity-50 rounded-lg"></div>
                                <div className="relative flex h-full items-center gap-2 p-4">
                                    <div className="flex flex-col p-2">
                                        <h1 className="text-white font-bold text-[20px]">Cottage</h1>
                                        <p className="text-white font-semibold line-clamp-3">Total of Lodges:</p>
                                        <p className="text-white font-semibold line-clamp-3">Availability:</p>
                                        <p className="text-white font-semibold line-clamp-3">Booked:</p>
                                    </div>
                                </div>
                            </div>

                            <div 
                                className="relative rounded-lg shadow-xl w-[470px] cursor-pointer"
                                style={{ backgroundImage: "url(./src/assets/lodgebg.jpg)", backgroundSize: 'cover', backgroundPosition: 'center' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#000] to-[#12B1D1] opacity-50 rounded-lg"></div>
                                <div className="relative flex h-full w-full items-center gap-2 p-4">
                                    <div className="flex flex-col">
                                        <h1 className="text-white font-bold text-[20px]">Lodge</h1>
                                        <p className="text-white font-semibold line-clamp-3">Total of Lodges:</p>
                                        <p className="text-white font-semibold line-clamp-3">Availability:</p>
                                        <p className="text-white font-semibold line-clamp-3">Booked:</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex-row w-full h-[615px] mt-8 p-6 mx-auto bg-white shadow-lg rounded-lg border-gray-200">
                            <div className="flex justify-between mb-5">
                                <h1 className="text-2xl font-bold">Ratings</h1>
                                <div>
                                    <button
                                        onClick={() => setSelectedCategory('Cottage')}
                                        className={`text-sm p-2 w-[100px] mr-3 text-white cursor-pointer rounded-[5px] bg-[#70b8d3] hover:bg-[#09B0EF] shadow`}>
                                        Cottage
                                    </button>
                                    <button
                                        onClick={() => setSelectedCategory('Lodge')}
                                        className={`text-sm p-2 w-[100px] text-white cursor-pointer rounded-[5px] bg-[#70b8d3] hover:bg-[#09B0EF] shadow`}>
                                        Lodge
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="relative">
                                    <div className="max-h-[500px] overflow-y-auto">
                                        <table className="w-full">
                                            <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100">
                                                <tr className="text-center">
                                                    {tableHeaders.map((header, index) => (
                                                        <th key={index} className="px-3 py-3 text-sm font-bold uppercase tracking-wider" >{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item, index) => (
                                                    <tr key={item.id} className="px-3 py-3 border-b bg-white text-sm">
                                                    <td className="px-3 py-3 border-b bg-white text-sm">{index + 1}</td>
                                                    <td className="px-3 py-3 border-b bg-white text-sm">{item.type}</td>
                                                    <td className="px-3 py-3 border-b bg-white text-sm">{item.capacity}</td>
                                                    {selectedCategory === "Cottage" ? (
                                                        <>
                                                        <td className="px-3 py-3 border-b bg-white text-sm">{item.time_6am_6pm_price}</td>
                                                        <td className="px-3 py-3 border-b bg-white text-sm">{item.time_6am_12mn_price}</td>
                                                        <td className="px-3 py-3 border-b bg-white text-sm">{item.time_12hrs_price}</td>
                                                        <td className="px-3 py-3 border-b bg-white text-sm">{item.time_24hrs_price}</td>
                                                        </>
                                                    ) : (
                                                        <>
                                                        <td className="px-3 py-3 border-b bg-white text-sm">{item.time_3hrs_price}</td>
                                                        <td className="px-3 py-3 border-b bg-white text-sm">{item.time_6hrs_price}</td>
                                                        <td className="px-3 py-3 border-b bg-white text-sm">{item.time_12hrs_price}</td>
                                                        <td className="px-3 py-3 border-b bg-white text-sm">{item.time_24hrs_price}</td>
                                                        </>
                                                    )}
                                                    <td className="px-3 py-3 border-b bg-white text-sm">{item.status}</td>
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
                        <div className="p-4 bg-white shadow-lg rounded-lg border-gray-200 mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800 text-center">Calendar</h2>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={date} 
                                    onChange={(newValue) => setDate(newValue)} 
                                />
                            </LocalizationProvider>
                        </div>

                        <div className="p-6 w-[500px] min-h-[430px] bg-white shadow-lg rounded-lg border-gray-200">
                            <div className="flex justify-between items-center">
                                <hi className="text-2xl font-semibold text-gray-800">Notification</hi>
                                <div className="text-gray-600 text-xl font-mono">
                                    {currentTime.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDash;