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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); 
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

    // useEffect(() => {
    //     // Fetch cottages
    //     api
    //         .get("/cottages/") // Update the URL based on your Django REST API endpoint
    //         .then((response) => {
    //         setCottages(response.data);
    //     })
    //         .catch((error) => console.error("Error fetching cottages:", error));
    
    //     // Fetch lodges
    //     api
    //         .get("/lodges/") // Update the URL based on your Django REST API endpoint
    //         .then((response) => {
    //         setLodges(response.data);
    //     })
    //         .catch((error) => console.error("Error fetching lodges:", error));
    // }, []);

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
    
    const handleBookClick = (unit) => {
        navigate("/payment", { state: { unit, selectedDate } });
    };

    const handleCheckAvailability = (title) => {
        navigate(`/calendar/${title}`);
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
                <div className="w-full max-w-[1200px] mx-auto mt-10 flex justify-end sort-con">
                <div className="date-picker-container">
                    <label htmlFor="date-picker" className="date-label">
                        Select Date:
                    </label>
                    <DatePicker
                        id="date-picker"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        minDate={new Date()} // Restrict selection to today and future dates
                        placeholderText="Select a date"
                    />
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
                        <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md fil">    
                            <h3 className="text-lg font-semibold mb-4">Filter by</h3>
                            <div className="sub-filter flex flex-col gap-4">
                                <div className="mb-4">
                                    <h4 lassName="font-semibold mb-2">Type</h4>
                                    <div className="filter-container">
                                    <select value={filter} onChange={handleFilterChange}>
                                    <option value="cottage">Cottage</option>
                                    <option value="lodge">Lodge</option>
                                    </select>

                                    <input
                                    type="number"
                                    value={capacity}
                                    onChange={handleCapacityChange}
                                    placeholder="Enter minimum capacity"
                                    />

                                    <button onClick={handleFilterClick}>Filter</button>
                                </div>
                                </div>
                                
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Price Range</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="All"
                                                checked={priceRange === 'All'}
                                                onChange={() => setPriceRange('All')}
                                                className="mr-2"
                                            />
                                            All
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="Under 100"
                                                checked={priceRange === 'Under 100'}
                                                onChange={() => setPriceRange('Under 100')}
                                                className="mr-2"
                                            />
                                            Under 100 per night
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="100-200"
                                                checked={priceRange === '100-200'}
                                                onChange={() => setPriceRange('100-200')}
                                                className="mr-2"
                                            />
                                            100-200 per night
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="200 and above"
                                                checked={priceRange === '200 and above'}
                                                onChange={() => setPriceRange('200 and above')}
                                            />
                                            200 and above
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Section */}
                        <div style={{ flex: 1 }}>
                        <div className="w-3/4 flex flex-col space-y-4 cards">
                            {units.map((unit) => (
                                    <div key={unit.id} className="bg-white rounded-[20px] shadow-md p-4 flex items-center mx-auto sub-card">
                                        <div className="w-1/3">
                                        <img src={unit.image_url} alt={unit.name} 
                                        className={`md:w-[230px]  img rounded-lg transition-transform duration-300 ${zoomedImage === unit.id ? 'scale-150' : ''} cursor-zoom-in`}
                                        onMouseDown={() => handleZoomStart(unit.id)}
                                        onMouseUp={handleZoomEnd}
                                        onMouseLeave={handleZoomEnd} />
                                        </div>
                                        <div className="w-2/3 ml-10">
                                            <h3 className="text-2xl font-bold mb-2">{unit.name}</h3>
                                            <p>Type: {unit.type}</p>
                                            <p className="text-gray-600 mb-4">Capacity: {unit.capacity}</p>
                                            <p className="text-lg font-semibold mb-2">
                                            Prices:
                                            {unit.custom_prices && Object.entries(unit.custom_prices).length > 0 ? (
                                                Object.entries(unit.custom_prices).map(([key, value]) => (
                                                <p key={`${unit.id}-${key}`}>{key}: ${value}</p>
                                                ))
                                            ) : (
                                                <p>No prices available</p>
                                            )}
                                            </p>
                                                <div className="flex space-x-2">
                                                <button onClick={() => handleBookClick(unit)} className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md transition-colors font-semibold">
                                                    Book
                                                </button>
                                                <button
                                                    className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md"
                                                    onClick={() => handleCheckAvailability(unit.title)}
                                                >
                                                    Check Availability
                                                </button>
                                            </div>
                                        </div> 
                                    </div>
                                    ))}
                            </div>
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
