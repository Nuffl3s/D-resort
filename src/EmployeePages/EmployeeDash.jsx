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
    const [units, setUnits] = useState([]);
    const [timeRanges, setTimeRanges] = useState([]);
    const [unitType, setUnitType] = useState("cottage"); // Default to cottage
    const [totals, setTotals] = useState({ total_cottages: 0, total_lodges: 0 });
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = unitType === "cottage" ? "/cottages/" : "/lodges/";
                const response = await api.get(endpoint);
                const jsonData = response.data;
    
                console.log("Fetched Data:", jsonData);
    
                // Normalize custom_prices keys and collect unique time slots
                const uniqueKeys = new Set();
                const normalizedData = jsonData.map((item) => {
                    const customPrices = item.custom_prices || {};
                    const normalizedPrices = Object.entries(customPrices).reduce((acc, [key, value]) => {
                        const normalizedKey = key.replace(/\s+/g, "").toUpperCase(); // Remove spaces and make uppercase
                        acc[normalizedKey] = value;
                        uniqueKeys.add(normalizedKey); // Add normalized key to the unique set
                        return acc;
                    }, {});
                    return { ...item, custom_prices: normalizedPrices }; // Return the item with normalized prices
                });
    
                setTimeSlots([...uniqueKeys].sort()); // Sort keys alphabetically
                setData(normalizedData); // Update state with normalized data
            } catch (error) {
                console.error(`Error fetching ${unitType} data:`, error);
            }
        };
    
        fetchData();
    }, [unitType]);    

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
        api.get('/total-units/')
            .then((response) => {
            setTotals(response.data);
            })
            .catch((error) => {
                console.error('Error fetching total units:', error);
        });
    }, []);
    
    useEffect(() => {
        fetchData();
    }, [selectedCategory]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    
    const handleUnitTypeChange = (type) => {
        setUnitType(type);
        setData([]);
        setTimeSlots([]);
    };
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
                                        <p className="text-white font-semibold line-clamp-3">Total of Cottage: {totals.total_cottages}</p>
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
                                        <p className="text-white font-semibold line-clamp-3">Total of Lodges: {totals.total_lodges}</p>
                                        <p className="text-white font-semibold line-clamp-3">Availability:</p>
                                        <p className="text-white font-semibold line-clamp-3">Booked:</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex-row w-full h-[615px] mt-8 p-6 mx-auto bg-white shadow-lg rounded-lg border-gray-200">
                            <div className="flex justify-between mb-5">
                                <h1 className="text-2xl font-bold">Rates</h1>
                                <div>
                                    <button
                                        onClick={() => handleUnitTypeChange("cottage")}
                                        className={`text-sm p-2 w-[100px] mr-3 text-white cursor-pointer rounded-[5px] bg-[#70b8d3] hover:bg-[#09B0EF] shadow`}>
                                        Cottage
                                    </button>
                                    <button
                                        onClick={() => handleUnitTypeChange("lodge")}
                                        className={`text-sm p-2 w-[100px] text-white cursor-pointer rounded-[5px] bg-[#70b8d3] hover:bg-[#09B0EF] shadow`}>
                                        Lodge
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="relative">
                                    <div className="max-h-[500px] overflow-y-auto">
                                    <table className="table-auto border-collapse border border-gray-300 w-full">
                                        <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 px-4 py-2">#</th>
                                            <th className="border border-gray-300 px-4 py-2">Type</th>
                                            <th className="border border-gray-300 px-4 py-2">Capacity</th>
                                            {timeSlots.map((slot) => (
                                                <th key={slot} className="border border-gray-300 px-4 py-2">
                                                    {slot}
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.type}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{row.capacity}</td>
                                            {timeSlots.map((slot) => (
                                                <td key={slot} className="border border-gray-300 px-4 py-2 text-center">
                                                {row.custom_prices?.[slot] || "-"}
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