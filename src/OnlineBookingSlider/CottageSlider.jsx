import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';

const CottageSlider = () => {
    const navigate = useNavigate();

    const cards = [
        { id: 1, imgSrc: "./src/assets/c-A.jpg", images: ["./src/assets/c-A.jpg","./src/assets/c-A2.jpg"], title: "Cottage A - Function Hall", description: "Full Description 1" },
        { id: 2, imgSrc: "./src/assets/c-B.jpg", images: ["./src/assets/c-B.jpg","./src/assets/c-B2.jpg"], title: "Cottage B", description: "Full Description 2" },
        { id: 3, imgSrc: "./src/assets/c-C.jpg", images: ["./src/assets/c-C.jpg","./src/assets/c-C2.jpg"], title: "Cottage C", description: "Full Description 3" },
        { id: 4, imgSrc: "./src/assets/c-D.jpg", images: ["./src/assets/c-D.jpg","./src/assets/c-D2.jpg"], title: "Cottage D", description: "Full Description 4" },
        { id: 5, imgSrc: "./src/assets/c-E.jpg", images: ["./src/assets/c-E.jpg","./src/assets/c-E2.jpg"], title: "Cottage E", description: "Full Description 5" },
        { id: 6, imgSrc: "./src/assets/c-F.jpg", images: ["./src/assets/c-F.jpg","./src/assets/c-F2.jpg"], title: "Cottage F", description: "Full Description 1" },
        { id: 7, imgSrc: "./src/assets/c-G.jpg", images: ["./src/assets/c-G.jpg","./src/assets/c-G2.jpg"], title: "Cottage G", description: "Full Description 2" },
        { id: 8, imgSrc: "./src/assets/c-H.jpg", images: ["./src/assets/c-H.jpg","./src/assets/c-H2.jpg"], title: "Cottage H", description: "Full Description 3" },
        { id: 9, imgSrc: "./src/assets/c-I.jpg", images: ["./src/assets/c-I.jpg","./src/assets/c-I2.jpg"], title: "Cottage I", description: "Full Description 4" },
        { id: 10, imgSrc: "./src/assets/c-J.jpg", images: ["./src/assets/c-G.jpg","./src/assets/c-J2.jpg"], title: "Cottage J", description: "Full Description 5" },
        { id: 11, imgSrc: "./src/assets/c-K.jpg", images: ["./src/assets/c-K.jpg","./src/assets/c-K2.jpg"], title: "Cottage K", description: "Full Description 1" },
        { id: 12, imgSrc: "./src/assets/c-L.jpg", images: ["./src/assets/c-L.jpg","./src/assets/c-L2.jpg"], title: "Cottage L", description: "Full Description 2" },
        { id: 13, imgSrc: "./src/assets/c-M.jpg", images: ["./src/assets/c-M.jpg","./src/assets/c-M2.jpg"], title: "Cottage M", description: "Full Description 3" },
        { id: 14, imgSrc: "./src/assets/c-N.jpg", images: ["./src/assets/c-N.jpg","./src/assets/c-N2.jpg"], title: "Cottage N", description: "Full Description 4" },
        { id: 15, imgSrc: "./src/assets/c-O.jpg", images: ["./src/assets/c-O.jpg","./src/assets/c-O2.jpg"], title: "Cottage O", description: "Full Description 5" },
        { id: 16, imgSrc: "./src/assets/c-P.jpg", images: ["./src/assets/c-P.jpg","./src/assets/c-P2.jpg"], title: "Cottage P", description: "Full Description 1" },
        { id: 17, imgSrc: "./src/assets/c-Q.jpg", images: ["./src/assets/c-Q.jpg","./src/assets/c-Q2.jpg"], title: "Cottage Q", description: "Full Description 2" },
        { id: 18, imgSrc: "./src/assets/c-R.jpg", images: ["./src/assets/c-R.jpg","./src/assets/c-R2.jpg"], title: "Cottage R", description: "Full Description 3" },
        { id: 19, imgSrc: "./src/assets/c-S.jpg", images: ["./src/assets/c-S.jpg","./src/assets/c-S2.jpg"], title: "Cottage S", description: "Full Description 4" },
        { id: 20, imgSrc: "./src/assets/c-T.jpg", images: ["./src/assets/c-T.jpg","./src/assets/c-T2.jpg"], title: "Cottage T", description: "Full Description 5" },
        { id: 21, imgSrc: "./src/assets/c-U.jpg", images: ["./src/assets/c-U.jpg","./src/assets/c-U2.jpg"], title: "Cottage U", description: "Full Description 1" },
        { id: 22, imgSrc: "./src/assets/c-V.jpg", images: ["./src/assets/c-V.jpg","./src/assets/c-V2.jpg"], title: "Cottage V", description: "Full Description 2" },
        { id: 23, imgSrc: "./src/assets/c-W.jpg", images: ["./src/assets/c-W.jpg","./src/assets/c-W2.jpg"], title: "Cottage W - Social Hall", description: "Full Description 3" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAll, setShowAll] = useState(false); // State to toggle between showing all cards or limited

    const cardsToShow = showAll ? cards.length : 3;

    const handlePrevious = () => {
        setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => {
            const maxIndex = Math.max(0, cards.length - cardsToShow);
            return Math.min(prevIndex + 1, maxIndex);
        });
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
        setCurrentImageIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const handleModalNext = () => {
        setCurrentImageIndex(prevIndex => Math.min(prevIndex + 1, cards[selectedCardIndex].images.length - 1));
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrevious(),
        trackMouse: true
    });

    const modalSwipeHandlers = useSwipeable({
        onSwipedLeft: handleModalNext,
        onSwipedRight: handleModalPrevious,
        trackMouse: true
    });

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const handleCheckAvailability = (type) => {
        navigate(`/calendar/${type}`);
    };

    return (
        <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden mt-16">
        <div className="flex w-full justify-between items-end mt-2 ">
            <h1 className="font-semibold text-[28px] p-2">Browse your lodge types</h1>
            <p 
                className="cursor-pointer p-2" 
                onClick={toggleShowAll}
            >
                {showAll ? 'Show less' : 'View all'}
            </p>
        </div>

        <div
            className={`flex ${showAll ? 'flex-wrap' : 'transition-transform ease-in-out duration-500'} cursor-grab`}
            style={!showAll ? { transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)` } : {}}
            {...handlers}
        >
            {cards.map((card, index) => (
                <div key={card.id} className={`flex-shrink-0 ${showAll ? 'w-full md:w-1/3' : 'w-full md:w-1/3'} p-2`}>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <img src={card.imgSrc} alt={card.title} className="w-full h-48 object-cover" loading="lazy"/>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                            <p className="text-gray-700 mb-4">{card.description.slice(0, 50)}...</p>
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

        {/* Show arrows only when not in "View all" mode */}
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
                    disabled={currentIndex >= Math.max(0, cards.length - cardsToShow)}
                >
                    &#10095;
                </button>
            </>
        )}

        {showModal && selectedCardIndex !== null && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] h-[80%] relative">
                    <h2 className="text-2xl font-bold mb-4">{cards[selectedCardIndex].title}</h2>
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
                                src={cards[selectedCardIndex].images[currentImageIndex]} 
                                alt={cards[selectedCardIndex].title} 
                                className="w-full h-[400px] object-cover mb-4" 
                            />
                        </div>
                        <button 
                            className="absolute cursor-pointer mr-2 right-0 top-[50%] w-[30px] h-[30px] transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:bg-opacity-100"
                            onClick={handleModalNext}
                            disabled={currentImageIndex === cards[selectedCardIndex].images.length - 1}
                        >
                            &#10095;
                        </button>
                    </div>
                    <p className="text-gray-700 mb-6">{cards[selectedCardIndex].description}</p>

                    <div className="absolute bottom-8 right-5 space-x-2">
                        <button 
                            className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md"
                            onClick={handleCloseModal}
                        >
                            Book now
                        </button>
                        <button 
                            className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md"
                            onClick={() => handleCheckAvailability(cards[selectedCardIndex].title)} // Pass the title or type of cottage
                        >
                            Check Availability
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
``
