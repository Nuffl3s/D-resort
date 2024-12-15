import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../api";

const BookingModal = ({ isOpen, onClose }) => {
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        mobile: "",
    });
    const [dateOfReservation, setDateOfReservation] = useState(new Date());
    const [bookingType, setBookingType] = useState("cottage");
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [confirmedUnits, setConfirmedUnits] = useState([]);

    // Fetch units dynamically
    useEffect(() => {
        const fetchUnits = async () => {
            const endpoint = bookingType === "cottage" ? "/cottages/" : "/lodges/";
            try {
                const response = await api.get(endpoint);
                setUnits(response.data);
            } catch (error) {
                console.error("Error fetching units:", error);
            }
        };
        fetchUnits();
    }, [bookingType]);

    // Handle input changes for customer info
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    // Select a unit to view in the right panel
    const handleSelectUnit = (unit) => {
        setSelectedUnit({ ...unit, selectedTime: "", selectedPrice: 0 });
    };

    // Select a unit from the confirmed list
    const handleSelectConfirmedUnit = (unit) => {
        setSelectedUnit({ ...unit });
    };

    // Handle time and price change
    const handleTimePriceChange = (time, price) => {
        setSelectedUnit((prev) => ({
            ...prev,
            selectedTime: time,
            selectedPrice: price,
        }));
    };

    // Confirm selection and move to confirmed units list
    const handleAddUnit = () => {
        if (selectedUnit && selectedUnit.selectedTime && selectedUnit.selectedPrice) {
            setConfirmedUnits((prev) => {
                // Replace the unit if it already exists, otherwise add it
                const updatedUnits = prev.map((unit) =>
                    unit.id === selectedUnit.id ? selectedUnit : unit
                );
    
                // If unit doesn't exist, add it
                if (!updatedUnits.some((unit) => unit.id === selectedUnit.id)) {
                    updatedUnits.push(selectedUnit);
                }
    
                return updatedUnits;
            });
            setSelectedUnit(null); // Reset the selected unit
        } else {
            alert("Please select time and price before adding the unit.");
        }
    };    

    // Calculate total price
    const totalPrice = confirmedUnits.reduce((sum, unit) => sum + unit.selectedPrice, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[95%] max-w-[1200px]">
                <h2 className="text-2xl font-bold mb-4">Book a Reservation</h2>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        name="name"
                        placeholder="Customer Name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        name="email"
                        placeholder="Email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        name="mobile"
                        placeholder="Contact Number"
                        value={customerInfo.mobile}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="date"
                        value={dateOfReservation.toISOString().split("T")[0]}
                        onChange={(e) => setDateOfReservation(new Date(e.target.value))}
                        className="border rounded p-2"
                    />
                </div>

                <div className="flex space-x-6">
                    {/* Units Table */}
                        <div className="flex-1">
                            <label className="font-bold">Booking Type:</label>
                            <select
                                value={bookingType}
                                onChange={(e) => setBookingType(e.target.value)}
                                className="border rounded p-2 mb-4 w-full"
                            >
                                <option value="cottage">Cottage</option>
                                <option value="lodge">Lodge</option>
                            </select>

                            {/* Scrollable Units Table */}
                            <div className="overflow-y-auto max-h-60 border rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Capacity</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {units.map((unit) => (
                                            <tr key={unit.id}>
                                                <td>
                                                    <img src={unit.image_url} alt={unit.name} className="w-12 h-12" />
                                                </td>
                                                <td>{unit.name}</td>
                                                <td>{unit.capacity}</td>
                                                <td>
                                                    {Object.entries(unit.custom_prices || {})
                                                        .map(([time, price]) => `${time}: ₱${price}`)
                                                        .join(", ")}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleSelectUnit(unit)}
                                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                                    >
                                                        Select
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    {/* Selected Unit */}
                    <div className="w-1/3 border rounded p-4">
                        <h3 className="font-bold mb-2">Selected Unit</h3>
                        {selectedUnit ? (
                            <>
                                <p>Name: {selectedUnit.name}</p>
                                <p>Capacity: {selectedUnit.capacity}</p>
                                <label className="block mb-2">Time and Price:</label>
                                <select
                                    className="border rounded p-2 w-full"
                                    onChange={(e) => {
                                        const [time, price] = e.target.value.split(",");
                                        handleTimePriceChange(time, parseFloat(price));
                                    }}
                                >
                                    <option value="">Select Time and Price</option>
                                    {Object.entries(selectedUnit.custom_prices || {}).map(
                                        ([time, price]) => (
                                            <option key={time} value={`${time},${price}`}>
                                                {time}: ₱{price}
                                            </option>
                                        )
                                    )}
                                </select>
                                <button
                                    onClick={handleAddUnit}
                                    className="bg-blue-500 text-white mt-4 px-4 py-2 rounded w-full"
                                >
                                    Add
                                </button>
                            </>
                        ) : (
                            <p>No unit selected</p>
                        )}
                    </div>
                </div>

                {/* Confirmed Units */}
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-2">Confirmed Units</h3>
                    {/* Scrollable Confirmed Units */}
                    <div className="border rounded p-4 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {confirmedUnits.map((unit, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleSelectConfirmedUnit(unit)}
                                className="flex justify-between border-b py-2 cursor-pointer hover:bg-gray-100"
                            >
                                <span>{unit.name} - Time: {unit.selectedTime}</span>
                                <span>₱{unit.selectedPrice}</span>
                            </div>
                        ))}
                    </div>
                    <p className="font-bold mt-2 text-right">Total Price: ₱{totalPrice}</p>
                </div>

                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

BookingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default BookingModal;
