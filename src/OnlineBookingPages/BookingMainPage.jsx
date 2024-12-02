import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CottageSlider from '../OnlineBookingSlider/CottageSlider';
import LodgeSlider from '../OnlineBookingSlider/LodgeSlider';
import ImgSlider from '../OnlineBookingSlider/ImgSlider';
import Loader from '../components/Loader';
import MapComponent from '../components/Map';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

function BookingMainPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false); // For scroll-to-top button
    const [scrollProgress, setScrollProgress] = useState(0); // To track the scroll progress


    const handleAboutUs = () => {
        navigate('/about-us');
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); 
        return () => clearTimeout(timer);
    }, []);

    // Scroll button visibility logic and scroll progress tracking
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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen flex-col bg-white">
            <div className="w-full relative flex justify-center mt-auto con">
                <Header isMainPage={true} />
                <Swiper
                    centeredSlides={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    className="w-full h-[970px] shadow-lg relative"
                >
                    <SwiperSlide>
                        <img src="./src/assets/sample1.jpg" alt="Slideshow Image 1" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-30" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="./src/assets/c1.jpg" alt="Slideshow Image 2" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-30" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="./src/assets/c2.jpg" alt="Slideshow Image 3" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-30" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="./src/assets/sample6.jpg" alt="Slideshow Image 3" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-30" />
                    </SwiperSlide>
                </Swiper>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <h1 className="text-white font-bold text-4xl md:text-6xl px-4 py-2 rounded-lg text-center font-lemon front-text ">
                        Enjoy your stay at D.Yasay <br />
                        <a className="mt-2 block">Beach Resort</a>
                        <a className="text-[20px] font-sans font-normal">Experience the perfect blend of relaxation and adventure by the sea. <span className="font-bold">Book now!</span></a>
                    </h1>
                </div>
            </div>
            

            {/* Content */}
            <div className="mx-auto mt-20">

                <div className="bg-gradient-to-r from-[#1089D3] to-[#12B1D1] p-6 rounded-lg flex space-x-6 items-center justify-between w-full max-w-[1200px] mx-auto con2">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-white font-semibold font-lemon text-xl">
                            Find and book your perfect stay
                        </h2>
                    </div>
                    <div className="cal">
                        <div className="bg-[#ebf6f8] p-4 rounded-lg flex items-center space-x-2 h-[80px]">
                            <img src="./src/assets/calendar.png" className="w-10 h-10" />
                            <p className="text-black text-[15px] p-2">Free cancellation options if plans change</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <CottageSlider />
                    <div className="mt-20">
                        <ImgSlider />
                    </div>
                    <LodgeSlider />
                </div>
                <div className="bg-white rounded-[20px] shadow-md p-4 flex items-center w-full max-w-[1200px] mx-auto mt-20 map-con">
                    <div className="w-1/3 map">
                        <div className="">
                            <MapComponent />
                        </div>
                    </div>
                    <div className="w-2/3 ml-10 map">
                        <h2 className="text-2xl font-bold mb-2">Enjoy your stay at our Resort</h2>
                        <p className="text-gray-600 mb-4">
                            Experience luxurious amenities and breathtaking views at our exclusive resort.
                        </p>
                        <button href="#" className="bg-[#12B1D1] hover:bg-[#3ebae7] text-white px-4 py-2 rounded-md transition-colors font-semibold" onClick={handleAboutUs}>
                            Learn More
                        </button>
                    </div>
                </div>                    
            </div>
            
            {/* Scroll-to-Top Button with Circular Progress */}
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
            <Footer />
        </div>
    );
}

export default BookingMainPage;
