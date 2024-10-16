import { useState, useEffect } from 'react';
import { useSwipeable } from "react-swipeable";

const ImgSlider = () => {
    const images = [
        "./src/assets/sample1.jpg",
        "./src/assets/sample2.jpg",
        "./src/assets/sample3.jpg",
        "./src/assets/sample4.jpg",
        "./src/assets/sample5.jpg",
        "./src/assets/sample6.jpg",
        "./src/assets/c3.jpg",

    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-slide every 3 seconds
    useEffect(() => {
        if (!isPaused) {
            const interval = setInterval(() => {
                handleNext();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [currentIndex, isPaused]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    // Swipe handlers for mobile
    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrevious,
    });

    return (
        <div
            className="relative w-full max-w-[1200px] mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            {...handlers}
        >
            <div className="overflow-hidden relative">
                <div
                    className="flex transition-transform duration-900 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="w-full flex-shrink-0"
                            style={{ width: "100%" }}
                        >
                            <div className="w-full h-[600px] rounded-[25px] overflow-hidden">
                                <img
                                    src={image}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Previous Button */}
            <button
                onClick={handlePrevious}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:bg-opacity-100"
            >
                &#10094;
            </button>

            {/* Next Button */}
            <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:bg-opacity-100"
            >
                &#10095;
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            currentIndex === index ? "bg-blue-500" : "bg-gray-400"
                        }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ImgSlider;
