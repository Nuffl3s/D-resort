import PropTypes from 'prop-types'; // Import PropTypes
import { useState, useEffect } from "react";
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';


function Payment({ startDate, endDate }) {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />;
    }

    const formatDate = (date) => {
        return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header className="bg-gradient-to-r from-[#1089D3] to-[#12B1D1] w-full h-full shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center p-3 px-8">
                    <div className="flex items-center space-x-3">
                        <img src="./src/assets/logo.png" alt="logo" className="w-16 h-16" />
                        <h1 className="bg-clip-text text-transparent bg-white text-[35px] font-bold font-lemon cursor-pointer">
                            <Link to="/booking">D.Yasay Resort</Link>
                        </h1>
                    </div> 
                </div>
            </header>
            <div className="flex-grow flex justify-center mt-10">
                <div className="w-full max-w-[1200px] flex">
                    <div className="w-2/3 p-4">
                        <div className="border rounded-md p-4">
                            <h2 className="text-2xl font-bold mb-4">Step 1: Personal Information</h2>
                            <form className="space-y-4">
                                {/* Existing form fields for personal information */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700" htmlFor="firstName">First Name</label>
                                    <p className="text-sm py-1 text-gray-500">Please give us the name of one of the people staying at this property.</p>
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 py-2" htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700" htmlFor="email">Email Address</label>
                                    <p className="text-sm py-1 text-gray-500">Your confirmation email goes here</p>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="mobile">Mobile Number</label>
                                    <p className="text-sm py-1 text-gray-500">Please provide your contact phone number</p>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        id="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                                        required
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Step 2: Payment Details */}
                        <div className="p-4 border rounded-md mt-4">
                            <h2 className="text-2xl font-bold mb-4">Step 2: Payment Details</h2>
                            <h3 className="text-lg font-semibold">We only accept Gcash payment</h3>
                            <label className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                />
                                <img src="./src/assets/gcash.png" alt=""  className="w-8 h-5 rounded-[3px]"/>
                                <span className="text-sm ml-2">GCash</span>
                            </label>
                            
                        </div>

                        {/* Cancellation Policy */}
                        <div className="mt-4 p-4 border rounded-md">
                            <h3 className="text-lg font-semibold">Cancellation Policy</h3>
                            <p className="text-sm font-bold">Non-refundable rate</p>
                            <p className="text-sm">If you change or cancel your booking you will not get a refund or credit to use for a future stay.</p>
                        </div>

                        {/* Terms of Booking */}
                        <div className="mt-4 p-4 border rounded-md">
                            <h3 className="text-lg font-semibold">Terms of Booking</h3>
                            <p className="text-sm">By proceeding with this booking, you agree to our terms and conditions.</p>

                            {/* Book Button */}
                            <div className="mt-6 flex justify-end">
                                <button className="bg-[#1089D3] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Accommodation Details on the Right */}
                    <div className="flex">
                        <div className="w-[400px] p-4 flex flex-col ">
                            <div className="w-full border p-4 rounded-md">
                                <div>
                                    {/* Image of the Accommodation */}
                                    <img src="./src/assets/sample1.jpg" className="w-full h-[250px] rounded-md mb-4" />
                                </div>
                                
                                {/* Main Details Block */}
                                <div className="border p-4 rounded-md shadow-sm">
                                    <h3 className="text-xl font-bold mb-2">Palms Cove Resort</h3>
                                    <div className="flex items-center mb-2">
                                        <span className="text-green-600 text-lg font-semibold">8.8</span>
                                        <span className="text-sm text-gray-500 ml-2">Excellent</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Hotels.com 54 guest reviews</p>

                                    {/* Check-in and Check-out details */}
                                    <div className="mt-4">
                                        <p className="text-md">Check-in: <span className="font-semibold">{formatDate(startDate)}</span></p>
                                        <p className="text-md">Check-out: <span className="font-semibold">{formatDate(endDate)}</span></p>
                                        <p className="text-sm text-gray-500 mt-1">2 nights, 1 unit</p>
                                    </div>
                                </div>

                                {/* Price Breakdown Section */}
                                <div className="border mt-4 p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-bold mb-2">Price Breakdown</h3>
                                    <div className="flex justify-between text-sm">
                                        <span>Avg Rate:</span>
                                        <span>₱7,371.51</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-2">
                                        <span>2 nights:</span>
                                        <span>₱14,743.02</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-2">
                                        <span>Taxes and Fees:</span>
                                        <span>₱1,769.16</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold mt-4 border-t pt-2">
                                        <span>Total Price:</span>
                                        <span>₱16,512.18</span>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// PropTypes validation
Payment.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
};

export default Payment;
