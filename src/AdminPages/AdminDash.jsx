import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CottageModal from '../Modal/CottageModal';
import LodgeModal from '../Modal/LodgeModal';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';
import SalesSummaryModal from '../Modal/SalesSummaryModal';
import api from '../api';

function AdminDash () {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [cottageModalOpen, setCottageModalOpen] = useState(false);
    const [lodgeModalOpen, setLodgeModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [products, setProducts] = useState([]);
    const [date, setDate] = useState(); 
    const [totals, setTotals] = useState({ total_cottages: 0, total_lodges: 0 });
    const [salesSummaryModalOpen, setSalesSummaryModalOpen] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);

    const lightTheme = createTheme({
        palette: {
          mode: 'light',
          text: {
            primary: '#000', // Black for light mode
          },
        },
      });
      
      const darkTheme = createTheme({
        palette: {
          mode: 'dark',
          background: {
            paper: '#424242',
          },
          text: {
            primary: '#e7e6e6', // White for dark mode
          },
        },
      });
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('http://localhost:8000/api/products/'); // Adjust the API URL as needed
                console.log("Fetched products:", response.data);  // Log API response to check if it contains data
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error.response?.data || error.message);
                if (error.response?.status === 401) {
                    alert("Unauthorized: Please log in again or check permissions.");
                }
            } 
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        api.get('/total-units/')
            .then((response) => {
            setTotals(response.data);
            })
            .catch((error) => {
                console.error('Error fetching total units:', error);
        });
    }, []);

    // Update the current time every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);


     // Fetch Attendance Data
     useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await api.get('http://localhost:8000/api/attendance/');
                console.log("Fetched attendance data:", response.data);
    
                // Sort attendance data by date and time_in (latest first)
                const sortedData = response.data.sort((a, b) => {
                    const dateTimeA = new Date(`${a.date} ${a.time_in}`);
                    const dateTimeB = new Date(`${b.date} ${b.time_in}`);
                    return dateTimeB - dateTimeA; // Descending order
                });
    
                setAttendanceData(sortedData); // Save sorted data to state
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };
    
        fetchAttendanceData();
    }, []);
    
      
  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


    useEffect(() => {
        applyTheme();
    }, []);

    const handleViewAllClick = () => {
        setSalesSummaryModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setSalesSummaryModalOpen(false);
      };

    return (
        <div className="flex dark:bg-[#111827] bg-gray-100">
            <AdminSidebar />
            <div id="dashboard" className="p-6 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">DASHBOARD</h1>
                
                <div className="flex justify-between">
                    <div className="flex-row w-full mr-5">
                        <div className="flex space-x-10 h-[200px]">
                            <div className="bg-gradient-to-r from-[#1089D3] to-[#12B1D1] rounded-lg shadow-xl w-[470px] relative">
                                <div className="p-4">
                                    <h1 className="text-lg font-semibold mb-2 text-white">COTTAGE</h1>
                                    <p className="text-sm mb-4 text-white">
                                        Number of Cottages: {totals.total_cottages}
                                        <br />
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
                                        Number of Lodges: {totals.total_lodges}
                                        <br />
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

                        <div className="p-6 w-full mx-auto mt-8 bg-white shadow-lg rounded-lg border-gray-200 mb-4 min-h-[610px] dark:bg-[#374151]">
                            <div className="flex justify-between">
                                <h1 className="text-xl font-bold text-start mb-10 dark:text-[#e7e6e6]">Summary</h1>
                                <button onClick={handleViewAllClick} className="bg-[#70b8d3] hover:bg-[#09B0EF] mb-10 px-2 text-white text-sm rounded-[5px] font-medium">View all</button>
                            </div>

                            <SalesSummaryModal
                                isOpen={salesSummaryModalOpen}
                                onClose={handleCloseModal}
                                products={products}
                            />

                            <div className="overflow-x-auto">
                                <div className="relative">
                                    <div className="max-h-[500px] overflow-y-auto table-scrollbar-hide">
                                        <table className="min-w-full shadow rounded-lg border-collapse">
                                            <thead className="sticky text-gray-600 top-0 bg-white dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                                <tr className="text-center">
                                                    <th className="px-5 py-3 text-sm font-bold  uppercase tracking-wider text-start">Product Name</th>
                                                    <th className="px-5 py-3 text-sm font-bold  uppercase tracking-wider text-start">Date</th>
                                                    <th className="px-5 py-3 text-sm font-bold  uppercase tracking-wider text-start">Quantity</th>
                                                    <th className="px-5 py-3 text-sm font-bold  uppercase tracking-wider text-start">Acquisition Cost</th>
                                                    <th className="px-5 py-3 text-sm font-bold  uppercase tracking-wider text-start">Selling Price</th>
                                                    <th className="px-5 py-3 text-sm font-bold  uppercase tracking-wider text-start">Total Profit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="dark:text-[#e7e6e6]">
                                                {products.length > 0 ? (
                                                    products.map((product, index) => (
                                                        <tr key={index}>
                                                            <td className="px-5 py-5 border-b border-gray-200 text-start">{product.name}</td>
                                                            <td className="px-5 py-5 border-b border-gray-200 text-start">{product.date_added}</td>
                                                            <td className="px-5 py-5 border-b border-gray-200 text-start">{product.quantity}</td>
                                                            <td className="px-5 py-5 border-b border-gray-200 text-start">${product.avgPrice}</td> {/* Acquisition Cost */}
                                                            <td className="px-5 py-5 border-b border-gray-200 text-start">${product.sellingPrice}</td> {/* Selling Price */}
                                                            <td className="px-5 py-5 border-b border-gray-200 text-start">${(product.quantity * (product.sellingPrice - product.avgPrice)).toFixed(2)}</td> {/* Total Profit */}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-5 py-5 text-center">No Products Available</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                        
                    <div className="flex-col mr-2 ml-4">
                        <div className="p-6 bg-white shadow-lg rounded-lg border-gray-200 mb-4 dark:bg-[#374151] dark:text-[#e7e6e6]">
                            <h2 className="text-2xl font-semibold text-gray-800 text-center dark:text-[#e7e6e6]">Calendar</h2>
                            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>                                
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    className="
                                        [&_.MuiDayCalendar-weekDayLabel]:text-black
                                        dark:[&_.MuiDayCalendar-weekDayLabel]:text-[#e7e6e6]
                                        [&_.MuiPickersDay-root]:text-black
                                        dark:[&_.MuiPickersDay-root]:text-[#e7e6e6]
                                        [&_.MuiPickersArrowSwitcher-button]:text-black
                                        dark:[&_.MuiPickersArrowSwitcher-button]:text-[#e7e6e6]
                                    "
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                />

                                </LocalizationProvider>
                            </ThemeProvider>
                        </div>

                        {/* Attendance Tracker */}
                        <div className="p-6 w-[500px] bg-white shadow-lg rounded-lg border-gray-200 dark:bg-[#374151]">
                            <div className="flex items-center mb-4 border-b pb-2 border-gray-200 justify-between">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#e7e6e6]">Attendance Tracker</h2>
                                <div className="text-gray-600 text-xl font-mono dark:text-[#e7e6e6]">
                                    {currentTime.toLocaleTimeString()}
                                </div>
                            </div>


                            {/* Attendance Table */}
                            <div className="overflow-x-auto max-h-[305px]"> {/* Added outer wrapper for horizontal scrolling */}
                                <table className="min-w-full bg-white rounded-lg">
                                    <thead className="sticky top-0 border-gray-200 bg-gray-100 text-gray-600 dark:bg-[#1f2937] dark:text-[#e7e6e6] z-10"> {/* Fixes header position */}
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Time in</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">Time out</th>
                                        </tr>
                                    </thead>

                                    <tbody className=""> {/* Scrollable body */}
                                        {attendanceData.length > 0 ? (
                                            attendanceData.map((record) => (
                                                <tr key={record.id} className="hover:bg-gray-50 dark:bg-[#66696e] dark:text-[#e7e6e6]">
                                                    <td className="px-5 py-5 border-b border-r text-sm">{record.user}</td>
                                                    <td className="px-5 py-5 border-b border-r text-sm">{record.name}</td>
                                                    <td className="px-5 py-5 border-b border-r text-sm">{record.date}</td>
                                                    <td className="px-5 py-5 border-b border-r text-sm">{record.time_in}</td>
                                                    <td className={`px-5 py-5 border-b border-r text-sm ${!record.time_out ? 'text-red-400' : ''}`}>
                                                        {record.time_out || 'No time out yet'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-5 py-5 text-center">No Attendance Data Available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDash;