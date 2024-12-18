import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import api from "../api";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateEvent, setSelectedDateEvent] = useState(null);
    const [units, setUnits] = useState(location.state?.unit ? [{ ...location.state.unit, selectedPrices: [] }] : []);
    const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchReservedDates = async () => {
            try {
                // Add unit_name as a query parameter to fetch reservations for the specific unit
                const response = await api.get("/reservations/", {
                    params: { unit_name: location.state?.unit?.name },
                });
    
                const reservations = response.data;
    
                // Map reservation data to events, ensuring dates and times are processed correctly
                const eventsData = reservations.map((res) => ({
                    title: "Reserved",
                    start: res.date_of_reservation, // Ensure correct date
                    backgroundColor: "#50b0d0",
                    borderColor: "#50b0d0",
                }));
    
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchReservedDates();
    }, [location.state?.unit?.name]);

    const handleDateClick = (info) => {
        const newSelectedDate = info.dateStr;

        if (selectedDateEvent) {
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== "selected-date"));
        }

        const newEvent = {
            id: "selected-date",
            title: "Selected",
            start: newSelectedDate,
            backgroundColor: "#37bc4e",
            borderColor: "#37bc4e",
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setSelectedDate(newSelectedDate);
        setSelectedDateEvent(newEvent);
    };

    const handleAddUnit = (unit) => {
        setUnits((prevUnits) => [
            ...prevUnits,
            {
                ...unit,
                selectedPrices: [],
                unit_type: unit.unit_type || "Unit", // Add unit_type fallback
            },
        ]);
    };

    const handleRemoveUnit = (index) => {
        setUnits((prevUnits) => prevUnits.filter((_, i) => i !== index));
        setCurrentUnitIndex((prevIndex) =>
            prevIndex >= units.length - 1 ? units.length - 2 : prevIndex
        );
    };

    const handlePriceChange = (time, isChecked) => {
        setUnits((prevUnits) =>
            prevUnits.map((unit, index) =>
                index === currentUnitIndex
                    ? {
                          ...unit,
                          selectedPrices: isChecked
                              ? [...(unit.selectedPrices || []), time]
                              : (unit.selectedPrices || []).filter((t) => t !== time),
                      }
                    : unit
            )
        );
    };

    const nextUnit = () => {
        setCurrentUnitIndex((prevIndex) => (prevIndex + 1) % units.length);
    };

    const prevUnit = () => {
        setCurrentUnitIndex((prevIndex) => (prevIndex - 1 + units.length) % units.length);
    };

    const handleGoToBilling = () => {
        if (!selectedDate || units.length === 0) {
            Swal.fire("Error", "Please select a date and at least one unit.", "error");
            return;
        }
    
        const state = {
            selectedDate,
            units: units.map((unit) => ({
                ...unit,
                timeAndPrice: Object.entries(unit.custom_prices || {}).map(([time, price]) => ({ time, price })),
            })),
        };
    
        navigate("/billing", { state });
    };

    const calculateTotalPrice = (unit) =>
        unit.selectedPrices.reduce(
            (total, time) => total + parseFloat(unit.custom_prices[time] || 0),
            0
        );

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex-grow flex justify-center mt-10">
                <div className="w-full max-w-[1200px] flex space-x-6">
                    {/* Left: Calendar */}
                    <div className="w-2/3">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            height="600px"
                            dateClick={handleDateClick}
                        />
                        <div className="mt-4">
                            <h3 className="text-md font-semibold">Selected Date:</h3>
                            <p>{selectedDate || "No date selected"}</p>
                        </div>
                    </div>

                    {/* Right: Unit Details */}
                    <div className="w-1/3 space-y-4">
                    <div className="border rounded-md p-4 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Selected Date</h3>
                            <p>{selectedDate || "No date selected"}</p>
                    </div>
                    {units.length > 0 && units[currentUnitIndex] && (
                        <div className="border rounded-md p-4 shadow-sm">
                            <img
                                src={units[currentUnitIndex]?.image_url || ""}
                                alt={units[currentUnitIndex]?.name || "Unit"}
                                className="w-full h-32 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-bold">
                                {units[currentUnitIndex]?.name || "Unnamed Unit"}
                            </h3>
                            <p className="text-md">Capacity: {units[currentUnitIndex]?.capacity || "N/A"} persons</p>
                            <div className="mt-4">
                                <h4 className="font-semibold">Select Time and Price</h4>
                                {units[currentUnitIndex]?.custom_prices &&
                                    Object.entries(units[currentUnitIndex].custom_prices).map(([time, price]) => (
                                        <div key={time} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={units[currentUnitIndex]?.selectedPrices?.includes(time)}
                                                onChange={(e) => handlePriceChange(time, e.target.checked)}
                                            />
                                            <label>
                                                {time}: ₱{price}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                           {/* Breakdown Section */}
                            <div className="border rounded-md p-4 shadow-sm mt-6">
                                <h4 className="text-lg font-bold mb-4">Reservation Breakdown</h4>
                                <ul className="text-sm space-y-2">
                                {units.map((unit, index) => (
                                    <li key={index} className="border-b pb-2">
                                        <h5 className="font-semibold text-md">
                                            {unit.unit_type || "Unit"}: {unit.name || `Unit ${index + 1}`}
                                        </h5>
                                        {unit.selectedPrices.length > 0 ? (
                                            <ul className="ml-4">
                                                {unit.selectedPrices.map((time) => (
                                                    <li key={time}>
                                                        {time}: ₱{unit.custom_prices[time]}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 ml-4">No time selected</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                                {/* Grand Total */}
                                <p className="text-lg font-bold mt-4">
                                    Grand Total: ₱
                                    {units.reduce(
                                        (grandTotal, unit) =>
                                            grandTotal +
                                            unit.selectedPrices.reduce(
                                                (total, time) => total + parseFloat(unit.custom_prices[time] || 0),
                                                0
                                            ),
                                        0
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={prevUnit}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                            >
                                Prev Unit
                            </button>
                            <button
                                onClick={nextUnit}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                            >
                                Next Unit
                            </button>
                        </div>

                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Add More Units
                        </button>

                        <button
                            onClick={handleGoToBilling}
                            disabled={!selectedDate || units.length === 0}
                            className={`w-full px-4 py-2 rounded-md ${
                                selectedDate && units.length > 0
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-400 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            Go to Billing Page
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    onClose={() => setModalOpen(false)}
                    onAddUnit={handleAddUnit}
                    selectedUnits={units}
                    onRemoveUnit={handleRemoveUnit}
                />
            )}
        </div>
    );
}

export default Payment;
