import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import api from "../api";
import Loader from "../components/Loader";
import Header from "../components/Header";

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
    const [isMultiDateMode, setIsMultiDateMode] = useState(false);
    const [multiSelectedDates, setMultiSelectedDates] = useState([]);
    const [reservedEvents, setReservedEvents] = useState([]);
    const [confirmedDates, setConfirmedDates] = useState([]);
    const [reservedTimesByDate, setReservedTimesByDate] = useState({});


    useEffect(() => {
        const fetchReservedDates = async () => {
            try {
                const response = await api.get("/reservations/", {
                    params: { unit_name: location.state?.unit?.name },
                });
    
                const reservations = response.data;
    
                const reservedByDate = {};
    
                const eventsData = reservations.flatMap((res) => {
                    // Populate reservedByDate for each date
                    if (res.date_range) {
                        res.date_range.forEach((date) => {
                            if (!reservedByDate[date]) {
                                reservedByDate[date] = [];
                            }
                            if (res.time_of_use) {
                                reservedByDate[date].push(res.time_of_use);
                            }
                        });
    
                        return res.date_range.map((date) => ({
                            title: res.time_of_use
                                ? `Reserved: ${formatTimeRange(res.time_of_use)}`
                                : "Reserved",
                            start: date,
                            backgroundColor: "#50b0d0",
                            borderColor: "#50b0d0",
                        }));
                    } else if (res.date_of_reservation) {
                        if (!reservedByDate[res.date_of_reservation]) {
                            reservedByDate[res.date_of_reservation] = [];
                        }
                        if (res.time_of_use) {
                            reservedByDate[res.date_of_reservation].push(res.time_of_use);
                        }
    
                        return {
                            title: res.time_of_use
                                ? `Reserved: ${formatTimeRange(res.time_of_use)}`
                                : "Reserved",
                            start: res.date_of_reservation,
                            backgroundColor: "#50b0d0",
                            borderColor: "#50b0d0",
                        };
                    }
                    return [];
                });
    
                setReservedTimesByDate(reservedByDate); // Update reserved times by date state
                setReservedEvents(eventsData);
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchReservedDates();
    }, [location.state?.unit?.name]);
    
    const formatTimeTo12Hour = (time24) => {
        if (!time24) return "Invalid Time"; // Handle undefined or null values
        const [hour, minute] = time24.split(":");
        const period = +hour >= 12 ? "PM" : "AM";
        const hour12 = +hour % 12 || 12; // Convert to 12-hour format
        return `${hour12}:${minute} ${period}`;
    };  

    const formatTimeRange = (timeRange) => {
        if (!timeRange || !timeRange.includes("-")) return "Invalid Time"; // Handle undefined or invalid formats
        const [start, end] = timeRange.split("-");
        return `${formatTimeTo12Hour(start)} - ${formatTimeTo12Hour(end)}`;
    };
    
    
    const handleDateClick = (info) => {
        const clickedDate = info.dateStr;
    
        if (isMultiDateMode) {
            setMultiSelectedDates((prevDates) => {
                const alreadySelected = prevDates.includes(clickedDate);
    
                // Toggle date in selection
                const updatedDates = alreadySelected
                    ? prevDates.filter((date) => date !== clickedDate)
                    : [...prevDates, clickedDate];
    
                // Update events: add/remove "Selected" markers while keeping reserved ones
                const selectedEvents = updatedDates.map((date) => ({
                    title: "Selected",
                    start: date,
                    backgroundColor: "#37bc4e",
                    borderColor: "#37bc4e",
                }));
    
                setEvents([...reservedEvents, ...selectedEvents]);
                return updatedDates;
            });
        } else {
            // Default single date selection
            setSelectedDate(clickedDate);
            setEvents([...reservedEvents, { title: "Selected", start: clickedDate, backgroundColor: "#37bc4e" }]);
        }
    };

    const toggleMultiDateMode = () => {
        setIsMultiDateMode((prev) => !prev);
        setMultiSelectedDates([]); // Reset multi-date selection
        setEvents(reservedEvents); // Reset events to only reserved ones
    };

    
    const handleConfirmDates = () => {
        if (multiSelectedDates.length === 0) {
            alert("No dates selected.");
            return;
        }
    
        console.log("Confirmed dates:", multiSelectedDates);
        alert(`Confirmed dates: ${multiSelectedDates.join(", ")}`);
    
        // Save confirmed dates and reset multi-date mode
        setConfirmedDates(multiSelectedDates);
    
        // Update the events state with confirmed dates
        const selectedEvents = multiSelectedDates.map((date) => ({
            title: "Selected",
            start: date,
            backgroundColor: "#37bc4e",
            borderColor: "#37bc4e",
        }));
    
        setEvents([...reservedEvents, ...selectedEvents]); // Merge reserved events with confirmed dates
        setIsMultiDateMode(false);
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
    const selectedDates = confirmedDates.length > 0 ? confirmedDates : selectedDate ? [selectedDate] : [];

    if (!selectedDates.length || units.length === 0) {
        Swal.fire("Error", "Please select a date and at least one unit.", "error");
        return;
    }

    const state = {
        selectedDates, // Pass selected confirmed dates
        units: units.map((unit) => ({
            ...unit,
            timeAndPrice: unit.selectedPrices.map((time) => ({
                time,
                price: unit.custom_prices[time],
            })),
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
                            validRange={{
                                start: new Date().toISOString().split("T")[0], // Prevent dates before today
                            }}
                            eventContent={(eventInfo) => (
                                <div
                                    style={{
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        fontSize: "12px",
                                        lineHeight: "1.2",
                                        padding: "4px",
                                        textAlign: "center",
                                    }}
                                >
                                    {eventInfo.event.title}
                                </div>
                            )}
                        />
                        <div className="mt-4">
                            <h3 className="text-md font-semibold">Selected Date:</h3>
                            <p>
                                {isMultiDateMode
                                    ? multiSelectedDates.length > 0
                                        ? multiSelectedDates.join(", ")
                                        : "No dates selected"
                                    : selectedDate || "No date selected"}
                            </p>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={toggleMultiDateMode}
                                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                            >
                                {isMultiDateMode ? "Disable Multi-Date Selection" : "Enable Multi-Date Selection"}
                            </button>
                            {isMultiDateMode && (
                                <button
                                    onClick={handleConfirmDates}
                                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                                >
                                    Confirm Selected Dates
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Unit Details */}
                    <div className="w-1/3 space-y-4">
                    <div className="border rounded-md p-4 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Selected Date</h3>
                            <p>
                                {isMultiDateMode
                                    ? multiSelectedDates.length > 0
                                        ? multiSelectedDates.join(", ")
                                        : "No dates selected"
                                    : selectedDate || "No date selected"}
                            </p>
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
                                    Object.entries(units[currentUnitIndex].custom_prices).map(([time, price]) => {
                                        const isTimeReserved =
                                            reservedTimesByDate[selectedDate]?.includes(time) ?? false;

                                        return (
                                            <div key={time} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    disabled={isTimeReserved} // Disable if time is reserved
                                                    checked={
                                                        !isTimeReserved &&
                                                        units[currentUnitIndex]?.selectedPrices?.includes(time)
                                                    }
                                                    onChange={(e) => handlePriceChange(time, e.target.checked)}
                                                />
                                                <label
                                                    className={`${
                                                        isTimeReserved ? "text-gray-400 line-through" : ""
                                                    }`}
                                                >
                                                    {time}: ₱{price} {isTimeReserved ? "(Unavailable)" : ""}
                                                </label>
                                            </div>
                                        );
                                    })}
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
                            disabled={
                                confirmedDates.length === 0 && !selectedDate || units.length === 0
                            }
                            className={`w-full px-4 py-2 rounded-md ${
                                (confirmedDates.length > 0 || selectedDate) && units.length > 0
                                    ? "bg-green-500 text-white hover:bg-green-600"
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
