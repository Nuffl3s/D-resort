import React, { useState, useEffect } from "react";
import api from "../api";

const EditReservationModal = ({ isOpen, onClose, reservation, onUpdate }) => {
    const [customerInfo, setCustomerInfo] = useState({
        name: reservation.customer_name || "",
        email: reservation.customer_email || "",
        mobile: reservation.customer_mobile || "",
    });
    const [dateOfReservation, setDateOfReservation] = useState(reservation.date_of_reservation || new Date());
    const [bookingType, setBookingType] = useState(reservation.unit_type || "cottage");
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [timeOfUse, setTimeOfUse] = useState(reservation.time_of_use || "");
    const [confirmedUnit, setConfirmedUnit] = useState({
        id: reservation.object_id,
        name: reservation.unit_name,
        selectedTime: reservation.time_of_use,
        selectedPrice: reservation.total_price,
    });

    // Fetch units dynamically based on booking type
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

    // Select a unit to view its details
    const handleSelectUnit = (unit) => {
        setSelectedUnit({ ...unit, selectedTime: "", selectedPrice: 0 });
    };

    // Handle time and price selection for the selected unit
    const handleTimePriceChange = (time, price) => {
        setSelectedUnit((prev) => ({
            ...prev,
            selectedTime: time,
            selectedPrice: price,
        }));
    };

    // Confirm unit selection
    const handleConfirmUnit = () => {
        if (selectedUnit && selectedUnit.selectedTime && selectedUnit.selectedPrice) {
            setConfirmedUnit(selectedUnit);
            setSelectedUnit(null); // Clear selection after confirming
        } else {
            alert("Please select time and price before confirming the unit.");
        }
    };

    // Save updated reservation
    const handleSave = async () => {
        const updatedReservation = {
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            customer_mobile: customerInfo.mobile,
            unit_type: bookingType,
            unit_name: confirmedUnit.name,
            date_of_reservation: dateOfReservation,
            time_of_use: confirmedUnit.selectedTime,
            total_price: confirmedUnit.selectedPrice,
        };

        try {
            const response = await api.put(`/reservations/${reservation.id}/`, updatedReservation);
            onUpdate(response.data); // Update the parent component
            onClose();
        } catch (error) {
            console.error("Error updating reservation:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[90%]">
                <h2 className="text-2xl font-bold mb-4">Edit Reservation</h2>

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
                        value={new Date(dateOfReservation).toISOString().split("T")[0]}
                        onChange={(e) => setDateOfReservation(new Date(e.target.value))}
                        className="border rounded p-2"
                    />
                </div>

                {/* Unit Selection */}
                <div className="flex space-x-6">
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

                        {/* Units Table */}
                        <div className="overflow-y-auto h-[250px] border rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Capacity</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map((unit) => (
                                        <tr key={unit.id} className="hover:bg-gray-100">
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

                    {/* Selected Unit */}
                    <div className="w-[300px] border rounded p-4">
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
                                    {Object.entries(selectedUnit.custom_prices || {}).map(([time, price]) => (
                                        <option key={time} value={`${time},${price}`}>
                                            {time}: ₱{price}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleConfirmUnit}
                                    className="bg-blue-500 text-white mt-4 px-4 py-2 rounded w-full"
                                >
                                    Confirm Unit
                                </button>
                            </>
                        ) : (
                            <p>No unit selected</p>
                        )}
                    </div>
                </div>

                {/* Confirm Changes */}
                <div className="flex justify-end mt-4">
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                        Save
                    </button>
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditReservationModal;
