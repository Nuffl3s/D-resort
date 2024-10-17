import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Input from "../components/Inputs";
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function CottagePage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { startDate, endDate, persons } = location.state || { startDate: null, endDate: null, persons: 0 };
    
    const [loading, setLoading] = useState(true);
    const [showGuestDropdown, setShowGuestDropdown] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState({
        cottage: false,
        lodge: false,
    });

    const [sortOption, setSortOption] = useState('recommended');
    const [zoomedImage, setZoomedImage] = useState(null); 
    const [showScrollButton, setShowScrollButton] = useState(false); // For scroll-to-top button
    const [scrollProgress, setScrollProgress] = useState(0); // To track the scroll progress


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); 
        return () => clearTimeout(timer);
    }, []);

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

    const handleBook = () => {
        navigate('/payment');
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
        { id: 1, imgSrc: "./src/assets/c-A.jpg", title: "Cottage A - FUNCTION HALL", type: "cottage", description: "Experience luxurious amenities at Cottage 1.", price: "$150 per night" },
        { id: 2, imgSrc: "./src/assets/c-B.jpg", title: "Cottage B", type: "cottage", description: "Enjoy breathtaking views from Cottage 2.", price: "$200 per night" },
        { id: 3, imgSrc: "./src/assets/c-C.jpg", title: "Cottage C", type: "cottage", description: "Relax and unwind in Cottage 3's serene environment.", price: "$180 per night" },
        { id: 4, imgSrc: "./src/assets/c-D.jpg", title: "Cottage D", type: "cottage", description: "Secluded and peaceful stay.", price: "$220 per night" },
        { id: 5, imgSrc: "./src/assets/c-E.jpg", title: "Cottage E", type: "cottage", description: "Perfect for families and groups.", price: "$250 per night" },
        { id: 6, imgSrc: "./src/assets/c-F.jpg", title: "Cottage F", type: "cottage", description: "Wake up to the sound of waves.", price: "$300 per night" },
        { id: 7, imgSrc: "./src/assets/c-G.jpg", title: "Cottage G", type: "cottage", description: "Experience luxurious amenities at Cottage 1.", price: "$150 per night" },
        { id: 8, imgSrc: "./src/assets/c-H.jpg", title: "Cottage H", type: "cottage", description: "Enjoy breathtaking views from Cottage 2.", price: "$200 per night" },
        { id: 9, imgSrc: "./src/assets/c-I.jpg", title: "Cottage I", type: "cottage", description: "Relax and unwind in Cottage 3's serene environment.", price: "$180 per night" },
        { id: 10, imgSrc: "./src/assets/c-J.jpg", title: "Cottage J", type: "cottage", description: "Secluded and peaceful stay.", price: "$220 per night" },
        { id: 11, imgSrc: "./src/assets/c-K.jpg", title: "Cottage K", type: "cottage", description: "Perfect for families and groups.", price: "$250 per night" },
        { id: 12, imgSrc: "./src/assets/c-L.jpg", title: "Cottage L", type: "cottage", description: "Wake up to the sound of waves.", price: "$300 per night" },
        { id: 13, imgSrc: "./src/assets/c-M.jpg", title: "Cottage M", type: "cottage", description: "Experience luxurious amenities at Cottage 1.", price: "$150 per night" },
        { id: 14, imgSrc: "./src/assets/c-N.jpg", title: "Cottage N", type: "cottage", description: "Enjoy breathtaking views from Cottage 2.", price: "$200 per night" },
        { id: 15, imgSrc: "./src/assets/c-O.jpg", title: "Cottage O", type: "cottage", description: "Relax and unwind in Cottage 3's serene environment.", price: "$180 per night" },
        { id: 16, imgSrc: "./src/assets/c-P.jpg", title: "Cottage P", type: "cottage", description: "Secluded and peaceful stay.", price: "$220 per night" },
        { id: 17, imgSrc: "./src/assets/c-Q.jpg", title: "Cottage Q", type: "cottage", description: "Perfect for families and groups.", price: "$250 per night" },
        { id: 18, imgSrc: "./src/assets/c-R.jpg", title: "Cottage R", type: "cottage", description: "Wake up to the sound of waves.", price: "$300 per night" },
        { id: 19, imgSrc: "./src/assets/c-S.jpg", title: "Cottage S", type: "cottage", description: "Experience luxurious amenities at Cottage 1.", price: "$150 per night" },
        { id: 20, imgSrc: "./src/assets/c-T.jpg", title: "Cottage T", type: "cottage", description: "Enjoy breathtaking views from Cottage 2.", price: "$200 per night" },
        { id: 21, imgSrc: "./src/assets/c-U.jpg", title: "Cottage U", type: "cottage", description: "Relax and unwind in Cottage 3's serene environment.", price: "$180 per night" },
        { id: 22, imgSrc: "./src/assets/c-V.jpg", title: "Cottage V", type: "cottage", description: "Secluded and peaceful stay.", price: "$220 per night" },
        { id: 23, imgSrc: "./src/assets/c-W.jpg", title: "Cottage W - Social Hall", type: "cottage", description: "Perfect for families and groups.", price: "$250 per night" },
        { id: 24, imgSrc: "./src/assets/l-A.jpg", title: "Lodge A", type: "lodge", description: "Experience luxurious amenities at Cottage 1.", price: "$150 per night" },
        { id: 25, imgSrc: "./src/assets/l-B.jpg", title: "Lodge B", type: "lodge", description: "Enjoy breathtaking views from Cottage 2.", price: "$200 per night" },
        { id: 26, imgSrc: "./src/assets/l-C.jpg", title: "Lodge C", type: "lodge", description: "Relax and unwind in Cottage 3's serene environment.", price: "$180 per night" },
        { id: 27, imgSrc: "./src/assets/l-D.jpg", title: "Lodge D", type: "lodge", description: "Secluded and peaceful stay.", price: "$220 per night" },
        { id: 28, imgSrc: "./src/assets/l-E.jpg", title: "Lodge E", type: "lodge", description: "Perfect for families and groups.", price: "$250 per night" },
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

    // Filter the displayed data based on the selected filters
    const filteredData = Data.filter(item => {
        if (selectedTypes.cottage && selectedTypes.lodge) return true;
        if (selectedTypes.cottage) return item.type === "cottage";
        if (selectedTypes.lodge) return item.type === "lodge";
        return true; // Default: show all
    });

    // Sort the data based on the selected sort option
    const sortedData = [...filteredData].sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));

        if (sortOption === 'price-low-high') {
            return priceA - priceB;
        } else if (sortOption === 'price-high-low') {
            return priceB - priceA;
        } else {
            return 0; // No sorting for 'recommended'
        }
    });

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
                persons={persons}
                showGuestDropdown={showGuestDropdown}
                setShowGuestDropdown={setShowGuestDropdown}
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
                    {/* Sidebar for filters */}
                    <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md fil">
                        <h3 className="text-lg font-semibold mb-4">Filter by</h3>
                        <div className="sub-filter">
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Type</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={selectedTypes.cottage}
                                            onChange={() => handleTypeChange('cottage')}
                                        />
                                        Cottage
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={selectedTypes.lodge}
                                            onChange={() => handleTypeChange('lodge')}
                                        />
                                        Lodge
                                    </label>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Price Range</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" name="price" className="mr-2" />
                                        Under 100 per night
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" name="price" className="mr-2" />
                                        100 - 200 per night
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" name="price" className="mr-2" />
                                        200 and above
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="w-3/4 flex flex-col space-y-4 cards">
                        {sortedData.map((cottageAndlodge) => (
                            <div key={cottageAndlodge.id} className="bg-white rounded-[20px] shadow-md p-4 flex items-center mx-auto sub-card">
                                <div className="w-1/3">
                                    <img
                                        src={cottageAndlodge.imgSrc}
                                        alt={cottageAndlodge.title}
                                        className={`md:w-[230px]  img rounded-lg transition-transform duration-300 ${zoomedImage === cottageAndlodge.id ? 'scale-150' : ''} cursor-zoom-in`}
                                        onMouseDown={() => handleZoomStart(cottageAndlodge.id)}
                                        onMouseUp={handleZoomEnd}
                                        onMouseLeave={handleZoomEnd} 
                                    />
                                </div>
                                <div className="w-2/3 ml-10">
                                    <h2 className="text-2xl font-bold mb-2">{cottageAndlodge.title}</h2>
                                    <p className="text-gray-600 mb-4">{cottageAndlodge.description}</p>
                                    <p className="text-lg font-semibold mb-2">{cottageAndlodge.price}</p>
                                    <div className="flex space-x-2">
                                        <button onClick={handleBook} className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md transition-colors font-semibold">
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
                        ))}
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

export default CottagePage
