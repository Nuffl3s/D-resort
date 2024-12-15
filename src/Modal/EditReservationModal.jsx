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
    const [timeOfUse, setTimeOfUse] = useState("");
    const [confirmedUnits, setConfirmedUnits] = useState([]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    const handleSelectUnit = (unit) => {
        setSelectedUnit(unit);
    };

    const handleConfirmUnit = () => {
        if (selectedUnit && timeOfUse) {
            setConfirmedUnits((prev) => [
                ...prev,
                { ...selectedUnit, selectedTime: timeOfUse, price: selectedUnit.custom_prices[timeOfUse] },
            ]);
            setSelectedUnit(null);
            setTimeOfUse("");
        } else {
            alert("Please select a unit and time before confirming.");
        }
    };

    const handleSave = async () => {
        const updatedReservation = {
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            customer_mobile: customerInfo.mobile,
            unit_type: bookingType,
            confirmed_units: confirmedUnits,
            date_of_reservation: dateOfReservation,
        };

        try {
            const response = await api.put(`/reservations/${reservation.id}/`, updatedReservation);
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error("Error updating reservation:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[80%] h-[80%] overflow-auto">
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

                        <table className="w-full text-sm text-left text-gray-500 border rounded mb-4">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Image</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Capacity</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-gray-100">
                                        <td className="px-4 py-2">
                                            <img src={unit.image_url} alt={unit.name} className="w-[50px] h-[50px] rounded" />
                                        </td>
                                        <td className="px-4 py-2">{unit.name}</td>
                                        <td className="px-4 py-2">{unit.capacity}</td>
                                        <td className="px-4 py-2">
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

                        {/* Confirmed Units */}
                        <div className="border rounded p-4 bg-gray-50">
                            <h3 className="font-bold mb-2">Confirmed Units</h3>
                            {confirmedUnits.map((unit, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <img src={unit.image_url} alt={unit.name} className="w-[40px] h-[40px] rounded" />
                                    <div>
                                        <p>{unit.name}</p>
                                        <p>
                                            {unit.selectedTime} - ₱{unit.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Unit */}
                    <div className="w-[300px] border rounded p-4">
                        <h3 className="font-bold mb-2">Selected Unit</h3>
                        {selectedUnit ? (
                            <>
                                <img
                                    src={selectedUnit.image_url}
                                    alt={selectedUnit.name}
                                    className="w-full h-[150px] object-cover rounded mb-2"
                                />
                                <p>Name: {selectedUnit.name}</p>
                                <p>Capacity: {selectedUnit.capacity}</p>
                                <label>Time and Price:</label>
                                <select
                                    className="border rounded p-2 w-full"
                                    onChange={(e) => setTimeOfUse(e.target.value)}
                                >
                                    <option value="">Select Time</option>
                                    {Object.keys(selectedUnit.custom_prices || {}).map((time) => (
                                        <option key={time} value={time}>
                                            {time}: ₱{selectedUnit.custom_prices[time]}
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
