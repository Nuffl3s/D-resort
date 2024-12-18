import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Input from "../components/Inputs";
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import api from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isDateFullyReserved } from '../Utils/reservationUtils';

function BookingPage({ setBookingDetails }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { startDate: initialStartDate = null, endDate: initialEndDate = null, persons: initialPersons = 1 } = location.state || {};
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [persons, setPersons] = useState(initialPersons);
    const [loading, setLoading] = useState(true);
    const [showGuestDropdown, setShowGuestDropdown] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState({
        cottage: false,
        lodge: false,
    });

    const [cottages, setCottages] = useState([]);
    const [lodges, setLodges] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterType, setFilterType] = useState("");
    const [priceRange, setPriceRange] = useState("all");
    const [sortOption, setSortOption] = useState('recommended');
    const [zoomedImage, setZoomedImage] = useState(null); 
    const [showScrollButton, setShowScrollButton] = useState(false); 
    const [scrollProgress, setScrollProgress] = useState(0);
    const [filter, setFilter] = useState('cottage'); // Default to 'cottage'
    const [units, setUnits] = useState([]);
    const [capacityFilter, setCapacityFilter] = useState(null);
    const [capacity, setCapacity] = useState(''); // Capacity filter
    const [filters, setFilters] = useState({ capacity: null, date: null });
    const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today's date
    const [reservedDates, setReservedDates] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); 
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = () => {
        console.log("Search clicked", { startDate, endDate, persons });
        // Implement your search logic here
    };
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            setScrollProgress(scrollPercent); // Update progress percentage

            if (scrollTop > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        fetchUnits();
        }, [filter, filters]);
        
        const fetchUnits = async () => {
            try {
            const endpoint = filter === 'cottage' ? '/cottages/' : '/lodges/';
            const response = await api.get(endpoint, {
                params: {
                capacity: filters.capacity || null,
                date: filters.date ? filters.date.toISOString().split('T')[0] : null, // Format date to YYYY-MM-DD
                },
            });
            setUnits(response.data);
            } catch (error) {
            console.error('Error fetching units:', error);
            }
    };
    
    useEffect(() => {
        const fetchReservedDates = async () => {
            try {
                const response = await api.get("/reservations/");
                const reservations = response.data;
    
                // Extract dates for the currently viewed units
                const unitReservedDates = reservations.map(reservation => ({
                    unitName: reservation.unit_name,
                    reservedDate: reservation.date_of_reservation, // Date format: "YYYY-MM-DD"
                }));
    
                setReservedDates(unitReservedDates);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };
    
        fetchReservedDates();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setBookingDetails((prevDetails) => ({
            ...prevDetails,
            date,
        }));
    };
    
    const handleFilterChange = (e) => {
    setFilter(e.target.value);
    };

    const handleCapacityChange = (e) => {
    setCapacity(e.target.value);
    };

    const handleFilterClick = () => {
    fetchUnits();
    };

    useEffect(() => {
        let data = [...cottages, ...lodges];
    
        // Apply type filter
        if (filterType === "Cottage") {
            data = cottages;
        } else if (filterType === "Lodge") {
            data = lodges;
        }
    
        // Debugging: Log the data structure
        console.log("Unfiltered Data:", data);
    
        // Apply price range filter
        if (priceRange === "Under 100") {
            data = data.filter(item => {
                const prices = extractPrices(item.custom_prices);
                return prices.some(price => price < 100);
            });
        } else if (priceRange === "100-200") {
            data = data.filter(item => {
                const prices = extractPrices(item.custom_prices);
                return prices.some(price => price >= 100 && price <= 200);
            });
        } else if (priceRange === "200 and above") {
            data = data.filter(item => {
                const prices = extractPrices(item.custom_prices);
                return prices.some(price => price > 200);
            });
        }
    
        // Debugging: Log filtered results
        console.log("Filtered Data:", data);
    
        setFilteredData(data);
    }, [filterType, priceRange, cottages, lodges]);
    
    // Helper function to extract and sanitize prices
    const extractPrices = (customPrices) => {
        if (!customPrices || typeof customPrices !== "object") {
            return [];
        }
        // Convert all values in customPrices to numbers
        return Object.values(customPrices)
            .map(price => parseFloat(price))
            .filter(price => !isNaN(price));
    };
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adjust month to be 1-based
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
        return `${year}-${month}-${day}`;
    };
    
    const isDateReserved = (unit) => {
        const formattedSelectedDate = formatDate(selectedDate);
        return reservedDates.some(
            (res) => res.unitName === unit.name && res.reservedDate === formattedSelectedDate
        );
    };
    
    // Function to check if a specific time is reserved
    const isTimeReserved = (unit, selectedTime) => {
        const formattedDate = formatDate(selectedDate);
    
        return reservedDates.some((res) =>
            res.unit_name === unit.name &&
            res.date_of_reservation === formattedDate &&
            res.time_of_use?.includes(selectedTime) // Check reserved times
        );
    };
    

const handleBookClick = (unit) => {
    if (!isDateReserved(unit)) {
        navigate("/payment", { state: { unit, selectedDate } });
    }
};


    const handleCheckAvailability = (unit) => {
        navigate(`/calendar/${unit.name}`);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Return the loader if still loading
    if (loading) {
        return <Loader />;
    }

     // Array of cottage data
     const Data = [
    ];

    const handleTypeChange = (type) => {
        setSelectedTypes((prevSelectedTypes) => ({
            ...prevSelectedTypes,
            [type]: !prevSelectedTypes[type],
        }));
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };


    // Handle zoom on click and hold
    const handleZoomStart = (id) => {
        setZoomedImage(id);
    };

    const handleZoomEnd = () => {
        setZoomedImage(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white parent">
            <Header />
            <div className="flex-grow">
                <div className="w-full max-w-[1200px] m-auto mt-10 flex  sort-con items-center">
                    <div className="w-full max-w-sm mt-8 p-2 rounded-lg">
                        <label htmlFor="date-picker" className="block text-lg font-semibold text-gray-700 mb-3">
                            Select Date:
                        </label>
                        
                        <div className="relative">
                            <DatePicker
                                id="date-picker"
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy/MM/dd"
                                minDate={new Date()}
                                placeholderText="Select a date"
                                className="w-full p-3 text-gray-700 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                                />
                                <div className="absolute top-3 right-3 text-gray-400 pointer-events-none">
                                <i className="fa fa-calendar"></i>
                            </div>
                        </div>

                            {/* Optional: Display a message if no date is selected */}
                            {selectedDate ? (
                                <p className="mt-2 text-sm text-gray-600">You selected: {selectedDate.toLocaleDateString()}</p>
                            ) : (
                                <p className="mt-2 text-sm text-gray-400">Please select a date</p>
                            )}
                        </div>

                        <div className="w-1/3 relative sort">
                            <select 
                                id="sort-by" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10 appearance-none"
                                value={sortOption} 
                                onChange={handleSortChange}
                                style={{ paddingTop: '20px', paddingLeft: '10px' }}  
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price-low-high">Price: low to high</option>
                                <option value="price-high-low">Price: high to low</option>
                            </select>

                            <span className="absolute left-3 top-0 font-bold pt-1 text-gray-500 text-xs pointer-events-none">
                                Sort by
                            </span>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <img src="./src/assets/down.png" alt="Dropdown Icon" className="w-5 h-5 text-gray-500" />
                            </span>
                        </div>
                </div>

                <div className="w-full max-w-[1200px] flex items-start mx-auto mt-5 space-x-4 con3">
                    {/* Sidebar Filter Section */}
                    <div className="w-full sm:w-1/4 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Filter by</h3>
                        <div className="space-y-6">
                            {/* Type Filter Section */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-700 mb-3">Type</h4>
                                <div className="flex flex-col gap-4">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Select Type</label>
                                        <select
                                            value={filter}
                                            onChange={handleFilterChange}
                                            className="block w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option value="cottage">Cottage</option>
                                            <option value="lodge">Lodge</option>
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Minimum Capacity</label>
                                        <input
                                            type="number"
                                            value={capacity}
                                            onChange={handleCapacityChange}
                                            placeholder="Enter minimum capacity"
                                            className="block w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <button
                                        onClick={handleFilterClick}
                                        className="w-full mt-4 px-4 py-2 bg-[#12B1D1] hover:bg-[#3ebae7] text-white rounded-lg  focus:outline-none focus:ring-2">
                                        Apply Filter
                                    </button>
                                </div>
                            </div>

                            {/* Price Range Filter Section */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-700 mb-3">Price Range</h4>
                                <div className="space-y-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="All"
                                            checked={priceRange === 'All'}
                                            onChange={() => setPriceRange('All')}
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">All</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="Under 100"
                                            checked={priceRange === 'Under 100'}
                                            onChange={() => setPriceRange('Under 100')}
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">Under 100 per night</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="100-200"
                                            checked={priceRange === '100-200'}
                                            onChange={() => setPriceRange('100-200')}
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">100-200 per night</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="200 and above"
                                            checked={priceRange === '200 and above'}
                                            onChange={() => setPriceRange('200 and above')}
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">200 and above</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Section */}
                    <div className="w-full sm:w-3/4 flex flex-col space-y-6">
                    {units.map((unit) => {
                        const isReserved = isDateFullyReserved(unit, selectedDate, reservedDates);

                        return (
                            <div key={unit.id} className="bg-white rounded-xl shadow-lg p-6 flex items-center mx-auto border border-gray-200 transition-transform duration-300 hover:scale-105 w-full">
                                {/* Image Section */}
                                <div className="w-full sm:w-1/3">
                                    <img
                                        src={unit.image_url}
                                        alt={unit.name}
                                        className="w-full h-[200px] object-cover rounded-lg"
                                    />
                                </div>

                                {/* Unit Details Section */}
                                <div className="w-full sm:w-2/3 ml-6 mt-4 sm:mt-0">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{unit.name}</h3>
                                    <p className="text-sm text-gray-600">Type: {unit.type}</p>
                                    <p className="text-sm text-gray-600 mb-4">Capacity: {unit.capacity}</p>

                                    <div className="text-lg font-semibold mb-4">
                                        Prices:
                                        {unit.custom_prices && Object.entries(unit.custom_prices).map(([time, price]) => (
                                            <div key={time} className="flex items-center mb-2">
                                                <span
                                                    className={`mr-2 ${
                                                        isTimeReserved(unit, time) ? "text-red-500 line-through" : "text-gray-700"
                                                    }`}
                                                >
                                                    {time}: ₱{price} {isTimeReserved(unit, time) && "(Reserved)"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-4 mt-4">
                                    <button
                                        onClick={() => {
                                            if (!isReserved) {
                                                handleBookClick(unit);
                                            }
                                        }}
                                        className={`px-6 py-3 rounded-md font-semibold shadow-md transition-transform ${
                                            isReserved
                                                ? "bg-gray-400 text-gray-500 cursor-not-allowed line-through opacity-70"
                                                : "bg-[#12B1D1] hover:bg-[#3ebae7] text-white hover:scale-105"
                                        }`}
                                        disabled={isReserved}
                                        style={{
                                            backgroundColor: isReserved ? "#d1d5db" : "", // Force light gray color for disabled
                                            color: isReserved ? "#6b7280" : "",          // Force gray text color
                                            textDecoration: isReserved ? "line-through" : "none", // Ensure line-through text
                                        }}
                                    >
                                        {isReserved ? "Book Now (Unavailable)" : "Book Now"}
                                    </button>
                                        <button
                                            onClick={() => handleCheckAvailability(unit)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md transition-colors font-semibold shadow-md transform hover:scale-105"
                                        >
                                            Check Availability
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    </div>

                    {showScrollButton && (
                        <div
                            className="fixed bottom-5 right-5 z-50"
                            onClick={scrollToTop}
                        >
                            <div className="relative w-14 h-14 flex items-center justify-center">
                                <div
                                    style={{
                                        background: `conic-gradient(#ffdeba ${scrollProgress}%, #f7f5f5 ${scrollProgress}% 100%)`
                                    }}
                                    className="absolute inset-0 rounded-full"
                                />
                                <button className="bg-[#12B1D1] text-white p-3 w-[70%] h-[70%] rounded-full shadow-lg hover:bg-[#3ebae7] transition-colors z-10 flex justify-center items-center">
                                    <img src="/src/assets/up2.png" alt="Up Arrow" className="fill-current w-5 h-5" style={{ filter: 'invert(100%)' }} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default BookingPage
