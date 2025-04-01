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
    const [customers, setCustomers] = useState([]);

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

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.get("/customer-accounts/");
                setCustomers(response.data);
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        };
        if (isOpen) fetchCustomers();
    }, [isOpen]);

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

    // Add this function to handle removal
    const handleRemoveUnit = (unitId) => {
        setConfirmedUnits(prev => prev.filter(unit => unit.id !== unitId));
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

    const handleConfirmReservation = async () => {
        if (!customerInfo.id) {
            alert("Please select a customer first");
            return;
        }
    
        const reservationData = {
            customer: customerInfo.id,
            unit_type: bookingType,
            unit_name: confirmedUnits[0].name,
            transaction_date: new Date().toISOString().split("T")[0],
            date_range: `[${dateOfReservation.toISOString().split("T")[0]}]`, // Format for date_range
            date_of_reservation: dateOfReservation.toISOString().split("T")[0], // Keep both for compatibility
            time_of_use: confirmedUnits[0].selectedTime,
            total_price: confirmedUnits[0].selectedPrice,
          };
    
        try {
            await api.post("/reservations/", reservationData);
            alert("Reservation confirmed successfully!");
            window.dispatchEvent(new Event("reservationUpdated"));
            onClose();
            setConfirmedUnits([]);
        } catch (error) {
            console.error("Full error response:", error.response); // Add this line
            const errorMessage = error.response?.data?.non_field_errors?.[0] 
                || "Failed to confirm reservation.";
            alert(`Error: ${errorMessage}`);
        }
    };
    
    
    // Calculate total price
    const totalPrice = confirmedUnits.reduce((sum, unit) => sum + unit.selectedPrice, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg  w-[90%]">
                <h2 className="text-2xl font-bold mb-4">Book a Reservation</h2>

                {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                    <select
                        name="customer"
                        value={customerInfo.id || ""}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value);
                            const selectedCustomer = customers.find(c => c.id === selectedId);
                            setCustomerInfo({
                                id: selectedId,
                                name: selectedCustomer?.name || "",
                                email: selectedCustomer?.email || "",
                                mobile: selectedCustomer?.phone_number || "",
                            });
                        }}
                    >
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name} ({customer.email})
                            </option>
                        ))}
                    </select>
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
                            <div className="overflow-y-auto h-[250px] border rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ">
                                <div className="flex">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10 ">
                                            <tr className="uppercase">
                                                <th className="px-6 py-3">Image</th>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Capacity</th>
                                                <th className="px-6 py-3">Price</th>
                                                <th className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="w-full items-center">
                                            {units.map((unit) => (
                                                <tr key={unit.id} className="mb-5">
                                                    <td className="px-6 py-4">
                                                        <img src={unit.image_url} alt={unit.name} className="w-[100px] h-[100px] rounded" />
                                                    </td>
                                                    <td className="px-6 py-4">{unit.name}</td>
                                                    <td className="px-6 py-4">{unit.capacity}</td>
                                                    <td className="px-6 py-4">
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
                        </div>

                    {/* Selected Unit */}
                    <div className="w-[500px] border rounded p-4">
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
                                    className=" bg-[#70b8d3] hover:bg-[#09B0EF] text-white mt-4 px-4 py-2 rounded w-full"
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
                    <div className="border rounded p-4 shadow h-[220px]">
                        <div className="overflow-x-auto">
                            <div className="relative">
                                <div className="max-h-[180px] overflow-y-auto table-scrollbar">
                                {confirmedUnits.map((unit, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between border-b py-2 cursor-pointer hover:bg-gray-100 p-2"
                                    >
                                        <span>{unit.name} - Time: {unit.selectedTime}</span>
                                        <div className="flex items-center gap-2">
                                        <span>₱{unit.selectedPrice}</span>
                                        <button 
                                            onClick={() => handleRemoveUnit(unit.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                        </div>
                                    </div>
                                    ))}
                                    </div>            
                                </div>
                            </div>
                        </div>
                    <p className="font-bold mt-2 text-right">Total Price: ₱{totalPrice}</p>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleConfirmReservation} // Call the confirmation handler
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Confirm
                    </button>
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
