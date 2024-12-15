import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import your API utility

const CottageSlider = () => {
    const navigate = useNavigate();
    const [cottages, setCottages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const [cardsToShow, setCardsToShow] = useState(3);

    // Fetch cottages from the API
    useEffect(() => {
        const fetchCottages = async () => {
            try {
                const response = await api.get('/cottages/');
                setCottages(response.data); // Use fetched cottages
            } catch (error) {
                console.error('Error fetching cottages:', error);
            }
        };

        fetchCottages();
    }, []);

    // Adjust visible cards based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setCardsToShow(1);
            } else if (window.innerWidth <= 768) {
                setCardsToShow(2);
            } else {
                setCardsToShow(showAll ? cottages.length : 3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [showAll, cottages.length]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            Math.min(prevIndex + 1, Math.max(0, cottages.length - cardsToShow))
        );
    };

    const handleView = (index) => {
        setSelectedCardIndex(index);
        setCurrentImageIndex(0);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCardIndex(null);
    };

    const handleModalPrevious = () => {
        setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleModalNext = () => {
        setCurrentImageIndex((prevIndex) =>
            Math.min(prevIndex + 1, cottages[selectedCardIndex]?.images?.length - 1)
        );
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrevious,
        trackMouse: true,
    });

    const modalSwipeHandlers = useSwipeable({
        onSwipedLeft: handleModalNext,
        onSwipedRight: handleModalPrevious,
        trackMouse: true,
    });

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const handleBookNow = (cottage) => {
        navigate('/payment', { state: { unit: cottage, selectedDate: new Date() } });
    };

    return (
        <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden mt-16 slider">
            <div className="flex w-full justify-between items-end mt-2">
                <h1 className="font-semibold text-[28px] p-2 title">Browse your cottage types</h1>
                <p className="cursor-pointer p-2 text" onClick={toggleShowAll}>
                    {showAll ? 'Show less' : 'View all'}
                </p>
            </div>

            <div
                className={`flex ${showAll ? 'flex-wrap' : 'transition-transform ease-in-out duration-500'} cursor-grab`}
                style={!showAll ? { transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)` } : {}}
                {...handlers}
            >
                {cottages.map((cottage, index) => (
                    <div
                        key={cottage.id}
                        className="flex-shrink-0 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 p-2"
                    >
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={cottage.image_url || '/default-image.jpg'}
                                alt={cottage.name}
                                className="w-full h-48 object-cover"
                                loading="lazy"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{cottage.name}</h2>
                                <p className="text-gray-700 mb-4">
                                    Capacity: {cottage.capacity}
                                </p>
                                <button
                                    className="shadow-sm bg-[#12B1D1] hover:bg-[#3ebae7] text-white font-semibold px-4 py-2 rounded-md"
                                    onClick={() => handleView(index)}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!showAll && (
                <>
                    <button
                        className="absolute cursor-pointer left-0 top-[250px] w-[30px] h-[30px] transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:bg-opacity-100"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        &#10094;
                    </button>
                    <button
                        className="absolute cursor-pointer right-0 top-[250px] w-[30px] h-[30px] transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:bg-opacity-100"
                        onClick={handleNext}
                        disabled={currentIndex >= Math.max(0, cottages.length - cardsToShow)}
                    >
                        &#10095;
                    </button>
                </>
            )}

            {showModal && selectedCardIndex !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] h-[80%] relative modal">
                        <h2 className="text-2xl font-bold mb-4">{cottages[selectedCardIndex].name}</h2>
                        <div className="relative flex items-center">
                            <button
                                className="absolute cursor-pointer ml-2 left-0 top-[50%] w-[30px] h-[30px] transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:bg-opacity-100"
                                onClick={handleModalPrevious}
                                disabled={currentImageIndex === 0}
                            >
                                &#10094;
                            </button>
                            <div className="w-full" {...modalSwipeHandlers}>
                                <img
                                    src={
                                        cottages[selectedCardIndex]?.images?.[currentImageIndex] ||
                                        cottages[selectedCardIndex]?.image_url ||
                                        '/default-image.jpg'
                                    }
                                    alt={cottages[selectedCardIndex].name}
                                    className="w-full h-[400px] object-cover mb-4"
                                />
                            </div>
                            <button
                                className="absolute cursor-pointer mr-2 right-0 top-[50%] w-[30px] h-[30px] transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:bg-opacity-100"
                                onClick={handleModalNext}
                                disabled={
                                    currentImageIndex ===
                                    (cottages[selectedCardIndex]?.images?.length || 1) - 1
                                }
                            >
                                &#10095;
                            </button>
                        </div>
                        <p className="text-gray-700 mb-6">
                            {cottages[selectedCardIndex].description || 'No description available'}
                        </p>

                        <div className="absolute bottom-8 right-5 space-x-2">
                            <button
                                className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md"
                                onClick={() => handleBookNow(cottages[selectedCardIndex])}
                            >
                                Book now
                            </button>
                            <button
                                className="bg-[#FF6767] hover:bg-[#f35656] text-white px-4 py-2 rounded-md "
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CottageSlider;
