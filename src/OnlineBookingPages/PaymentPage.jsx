import PropTypes from 'prop-types'; // Import PropTypes
import { useState, useEffect } from "react";
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Modal from '../Modal/Modal';


function Payment({ startDate: propStartDate, endDate: propEndDate }) { // Rename props here
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
    });
    const unit = location.state?.unit;
    if (!unit) {
        return <div>No unit selected. Please go back and select a unit to book.</div>;
    }
    const { image_url: imgSrc, name: title, capacity: persons, custom_prices, description } = unit;
    const [selectedPrices, setSelectedPrices] = useState([]);
    const totalPrice = selectedPrices.reduce((total, price) => total + parseFloat(price), 0);
    const [selectedUnits, setSelectedUnits] = useState([location.state?.unit]); // Holds all selected units
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
    const currentUnit = selectedUnits[currentUnitIndex];

    const handleRemoveUnit = (index) => {
        setSelectedUnits((prevUnits) => {
            const updatedUnits = prevUnits.filter((_, unitIndex) => unitIndex !== index);
            // Update the currentUnitIndex
            if (updatedUnits.length > 0) {
                setCurrentUnitIndex((prevIndex) =>
                    prevIndex >= updatedUnits.length ? updatedUnits.length - 1 : prevIndex
                );
            } else {
                setCurrentUnitIndex(0); // Reset index if no units left
            }
            return updatedUnits;
        });
    };
    
    const handleAddUnit = (unit) => {
        setSelectedUnits((prevUnits) => [...prevUnits, unit]); // Add the selected unit
        setCurrentUnitIndex(selectedUnits.length); // Set the index to the newly added unit
    };

    const nextUnit = () => {
        setCurrentUnitIndex((prevIndex) =>
            prevIndex + 1 < selectedUnits.length ? prevIndex + 1 : 0
        );
    };

    const prevUnit = () => {
        setCurrentUnitIndex((prevIndex) =>
            prevIndex - 1 >= 0 ? prevIndex - 1 : selectedUnits.length - 1
        );
    };

    const handlePriceChange = (price, isChecked) => {
        if (isChecked) {
            setSelectedPrices([...selectedPrices, price]);
        } else {
            setSelectedPrices(selectedPrices.filter((p) => p !== price));
        }
    };

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

    const handleCheckboxChange = (unitIndex, time) => {
        const updatedUnits = [...selectedUnits];
        const unit = updatedUnits[unitIndex];
    
        // Initialize `selectedTimes` if it doesn't exist
        if (!unit.selectedTimes) {
            unit.selectedTimes = [];
        }
    
        // Toggle selection
        if (unit.selectedTimes.includes(time)) {
            unit.selectedTimes = unit.selectedTimes.filter((t) => t !== time);
        } else {
            unit.selectedTimes.push(time);
        }
    
        setSelectedUnits(updatedUnits); // Update state
    };
    
    const handleConfirm = () => {
        const billingData = {
            customerInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                mobile: formData.mobile,
            },
            units: selectedUnits.map((unit) => ({
                type: unit.type,
                name: unit.name,
                timeAndPrice: (unit.selectedPrices || []).map((time) => ({
                    time,
                    price: unit.custom_prices[time], // Get the price for the selected time
                })),
            })),
        };
    
        console.log("Billing Data to Pass:", billingData); // Debugging
        navigate("/billing", { state: billingData });
    };
    ;

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
                <div className="w-full max-w-[1200px] flex con4">
                    <div className="w-2/3 p-4 sub-con4">
                        <div className="border rounded-md p-4">
                            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
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

                        {/* Cancellation Policy */}
                        <div className="mt-4 p-4 border rounded-md">
                            <h3 className="text-lg font-semibold">Cancellation Policy</h3>
                            <p className="text-sm font-bold">Non-refundable rate</p>
                            <p className="text-sm">If you change or cancel your booking you will not get a refund or credit to use for a future stay.</p>
                        </div>

                        {/* Terms of Booking */}
                        <div className="mt-4 p-4 border rounded-md">
                            <h3 className="text-lg font-semibold">Terms of Booking</h3>
                            <div className="flex items-center text-sm">
                                <input
                                    type="checkbox"
                                    id="termsCheckbox"
                                    className="mr-2"
                                />
                                <label htmlFor="termsCheckbox" className="cursor-pointer">
                                    Agree to the <span className="text-[#7bbfff] font-semibold hover:underline">TERMS AND CONDITIONS</span> of this resort.
                                </label>
                            </div>

                            {/* Book Button */}
                            <div className="mt-6 flex justify-end">
                                <button onClick={handleConfirm} className="bg-[#12B1D1] text-white px-6 py-2 rounded-md hover:bg-[#3ebae7] transition duration-200">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Accommodation Details on the Right */}
                    <div className="flex">
                        <div className="w-[400px] p-4 flex flex-col accom-con">
                        <div className="w-full border p-4 rounded-md">
                            {/* Check if there are selected units */}
                            {selectedUnits.length > 0 ? (
                                <>
                                    {/* Image of the Accommodation */}
                                    <div>
                                        <img
                                            src={selectedUnits[currentUnitIndex].image_url}
                                            className="w-full h-[250px] rounded-md mb-4"
                                            alt={selectedUnits[currentUnitIndex].name}
                                        />
                                    </div>

                                    {/* Main Details Block */}
                                    <div className="border p-4 rounded-md shadow-sm">
                                        <h3 className="text-xl font-bold mb-2">{selectedUnits[currentUnitIndex].name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedUnits[currentUnitIndex].description || "No description available"}
                                        </p>

                                        {/* Number of persons */}
                                        <div className="mt-4">
                                            <p className="text-md mb-2">
                                                Number of persons:{" "}
                                                <span className="font-semibold">
                                                    {selectedUnits[currentUnitIndex].capacity}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                   {/* Price Selection Section */}
                                    <div className="border mt-4 p-4 rounded-md shadow-sm">
                                        <h3 className="text-lg font-bold mb-2">Select Time and Price</h3>
                                        {selectedUnits[currentUnitIndex].custom_prices &&
                                        Object.entries(selectedUnits[currentUnitIndex].custom_prices).length > 0 ? (
                                            Object.entries(selectedUnits[currentUnitIndex].custom_prices).map(([key, value]) => (
                                                <div key={key} className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`${currentUnitIndex}-${key}`} // Unique ID per unit
                                                        value={key}
                                                        checked={
                                                            selectedUnits[currentUnitIndex].selectedPrices?.includes(key) || false
                                                        }
                                                        onChange={(e) => {
                                                            const updatedUnits = [...selectedUnits];
                                                            const currentUnit = updatedUnits[currentUnitIndex];

                                                            // Initialize `selectedPrices` if not defined
                                                            if (!currentUnit.selectedPrices) {
                                                                currentUnit.selectedPrices = [];
                                                            }

                                                            if (e.target.checked) {
                                                                // Add selected time if it's checked
                                                                if (!currentUnit.selectedPrices.includes(key)) {
                                                                    currentUnit.selectedPrices.push(key);
                                                                }
                                                            } else {
                                                                // Remove unselected time
                                                                currentUnit.selectedPrices = currentUnit.selectedPrices.filter(
                                                                    (time) => time !== key
                                                                );
                                                            }

                                                            setSelectedUnits(updatedUnits); // Update the state with changes
                                                        }}
                                                    />
                                                    <label htmlFor={`${currentUnitIndex}-${key}`} className="ml-2">
                                                        {key}: ₱{value}
                                                    </label>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No prices available</p>
                                        )}
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={prevUnit}
                                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
                                        >
                                            &lt;
                                        </button>
                                        <button
                                            onClick={nextUnit}
                                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p>No units selected. Please add one using the "Book More" button.</p>
                            )}
                        </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => {
                                            const updatedUnits = selectedUnits.filter(
                                                (_, index) => index !== currentUnitIndex
                                            );
                                            setSelectedUnits(updatedUnits);
                                            setCurrentUnitIndex((prevIndex) =>
                                                prevIndex > 0 ? prevIndex - 1 : 0
                                            );
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                                {/* Book More Button */}
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                                    onClick={() => setModalOpen(true)}
                                >
                                    Book More
                                </button>
                                {/* Price Breakdown Section */}
                                <div className="border mt-4 p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-bold mb-2">Price Breakdown</h3>
                                    <div className="flex justify-between text-sm">
                                        <span>Selected Prices:</span>
                                        <span>
                                            ₱
                                            {selectedUnits.reduce((total, unit) => {
                                                const unitTotal = (unit.selectedPrices || []).reduce(
                                                    (unitSum, priceKey) =>
                                                        unitSum + parseFloat(unit.custom_prices[priceKey] || 0),
                                                    0
                                                );
                                                return total + unitTotal;
                                            }, 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold mt-4 border-t pt-2">
                                        <span>Total Price:</span>
                                        <span>
                                            ₱
                                            {selectedUnits.reduce((total, unit) => {
                                                const unitTotal = (unit.selectedPrices || []).reduce(
                                                    (unitSum, priceKey) =>
                                                        unitSum + parseFloat(unit.custom_prices[priceKey] || 0),
                                                    0
                                                );
                                                return total + unitTotal;
                                            }, 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {isModalOpen && (
                                <Modal
                                    onClose={() => setModalOpen(false)}
                                    onAddUnit={handleAddUnit}
                                    selectedUnits={selectedUnits} // Pass the state correctly
                                    onRemoveUnit={handleRemoveUnit}
                                />
                            )}
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
