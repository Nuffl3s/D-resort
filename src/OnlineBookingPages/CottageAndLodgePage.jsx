import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Input from "../components/Inputs";
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import api from '../api';

function BookingPage() {
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
    const [priceRange, setPriceRange] = useState("");
    const [sortOption, setSortOption] = useState('recommended');
    const [zoomedImage, setZoomedImage] = useState(null); 
    const [showScrollButton, setShowScrollButton] = useState(false); 
    const [scrollProgress, setScrollProgress] = useState(0);
    const [people, setPeople] = useState(1); // Number of people
    const [recommendedUnits, setRecommendedUnits] = useState([]);
    const [filteredCottages, setFilteredCottages] = useState([]);
    const [filteredLodges, setFilteredLodges] = useState([]);
    const [numCombinations, setNumCombinations] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [showRecommendations, setShowRecommendations] = useState(false);

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

    const handleSearchRecommendations = async () => {
        if (!people || !numCombinations) {
            alert("Please provide both Number of People and Number of Combinations!");
            return;
        }
    
        setLoading(true);
        try {
            const response = await api.get("/filter-units/", {
                params: {
                people: parseInt(people), // Use input value for number of people
                num_combinations: parseInt(numCombinations), // Use input value for combinations
                },
            });
            setRecommendations(response.data.recommended || []);
            setShowRecommendations(true); // Set to true when recommendations are fetched
        } catch (error) {
            console.error("Error fetching recommendations:", error.response?.data || error.message);
            setRecommendations([]);
          setShowRecommendations(false); // Reset on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch cottages
        api
            .get("/cottages/") // Update the URL based on your Django REST API endpoint
            .then((response) => {
            setCottages(response.data);
        })
            .catch((error) => console.error("Error fetching cottages:", error));
    
        // Fetch lodges
        api
            .get("/lodges/") // Update the URL based on your Django REST API endpoint
            .then((response) => {
            setLodges(response.data);
        })
            .catch((error) => console.error("Error fetching lodges:", error));
    }, []);

    const fetchRecommendations = async () => {
        const response = await fetch(`/api/filter-units/?people=${people}&num_combinations=${combinations}&type=${type}&price_range=${priceRange}`);
        const data = await response.json();
        setRecommendations(data.recommended);
    };

    useEffect(() => {
            let data = [...cottages, ...lodges];
        
            // Apply type filter if selected
            if (filterType === "Cottage") {
            data = cottages;
            } else if (filterType === "Lodge") {
            data = lodges;
            }
        
            // Apply price range filter if selected
            if (priceRange === "Under 100") {
            data = data.filter(item =>
                item.time_6am_6pm_price
                ? item.time_6am_6pm_price < 100
                : item.time_3hrs_price < 100
            );
            } else if (priceRange === "100-200") {
            data = data.filter(item =>
                item.time_6am_6pm_price
                ? item.time_6am_6pm_price >= 100 && item.time_6am_6pm_price <= 200
                : item.time_3hrs_price >= 100 && item.time_3hrs_price <= 200
            );
            } else if (priceRange === "200 and above") {
            data = data.filter(item => {
                const price = item.time_6am_6pm_price || item.time_3hrs_price || 0;
                return price > 200;
            });
            }
        
            setFilteredData(data);
        }, [filterType, priceRange, cottages, lodges]);

        
    const handleBook = (cottageAndLodge) => {
        navigate('/payment', {
            state: {
                title: cottageAndLodge.title,
                price: cottageAndLodge.price,
                imgSrc: cottageAndLodge.imgSrc,
                description: cottageAndLodge.description,
                startDate, // pass the check-in/check-out date if needed
                endDate,
                persons, 
            },
        });
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
            <Input
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                persons={persons}
                setPersons={setPersons}
                showGuestDropdown={showGuestDropdown}
                setShowGuestDropdown={setShowGuestDropdown}
                handleSearch={handleSearch}
            />
            <div className="flex-grow">
                <div className="w-full max-w-[1200px] mx-auto mt-10 flex justify-end sort-con">
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
                                    <h4 className="font-semibold mb-2">Number of People</h4>
                                    <div className="space-y-2">
                                        <label className="block mb-4">
                                                <input
                                                    type="number"
                                                    value={people}
                                                    onChange={(e) => setPeople(e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                        </label>
                                        <label className="block mb-4">
                                            <h4 className="font-semibold mb-2">How many cottage you want:</h4>
                                                <input
                                                    type="number"
                                                    value={numCombinations}
                                                    onChange={(e) => setNumCombinations(e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                        </label>
                                            <button
                                                onClick={handleSearchRecommendations}
                                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none"
                                                >
                                                Show Recommendations
                                            </button>
                                    </div>
                                    <h4 lassName="font-semibold mb-2">Type</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value=""
                                                checked={filterType === ""}
                                                onChange={() => setFilterType("")}
                                            />
                                                All
                                            </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="Cottage"
                                                checked={filterType === "Cottage"}
                                                onChange={() => setFilterType("Cottage")}
                                            />
                                                Cottage
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="Lodge"
                                                checked={filterType === "Lodge"}
                                                onChange={() => setFilterType("Lodge")}
                                            />
                                                Lodge
                                            </label>
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
                        {recommendations.map((unit) => (
                                <div key={unit.id} className="unit-card">
                                    {unit.image_url ? (
                                        <img src={unit.image_url} alt={unit.name} className="unit-image" />
                                    ) : (
                                        <div>No Image Available</div>
                                    )}
                                    <h3>{unit.name}</h3>
                                    <p>Capacity: {unit.capacity}</p>
                                    <p>Price: ${unit.time_24hrs_price || unit.time_12hrs_price || unit.time_6hrs_price}</p>
                                    <button>Book</button>
                                    <button>Check Availability</button>
                                </div>
                            ))}
                        <div className="w-3/4 flex flex-col space-y-4 cards">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                <div key={item.id} className="bg-white rounded-[20px] shadow-md p-4 flex items-center mx-auto sub-card">
                                    <div className="w-1/3">
                                        
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className={`md:w-[230px]  img rounded-lg transition-transform duration-300 ${zoomedImage === item.id ? 'scale-150' : ''} cursor-zoom-in`}
                                            onMouseDown={() => handleZoomStart(cottageAndlodge.id)}
                                            onMouseUp={handleZoomEnd}
                                            onMouseLeave={handleZoomEnd} 
                                        />
                                    </div>
                                    <div className="w-2/3 ml-10">
                                        <h4 className="text-2xl font-bold mb-2">{item.name}</h4>
                                        <p className="text-gray-600 mb-4">Capacity: {item.capacity}</p>
                                        <p className="text-lg font-semibold mb-2">
                                            Price: $
                                            {item.time_6am_6pm_price
                                                ? item.time_6am_6pm_price
                                                : item.time_3hrs_price}
                                        </p>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleBook(cottageAndlodge)} className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md transition-colors font-semibold">
                                                Book
                                            </button>
                                            <button
                                                className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md"
                                                onClick={() => handleCheckAvailability(cottageAndlodge.title)}
                                            >
                                                Check Availability
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                ))
                            ) : (
                                <p>No results found.</p>
                            )}
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
