import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import api from '../api';
import { isDateFullyReserved } from "../Utils/reservationUtils";


const CalendarView = () => {
    const { title } = useParams(); // Unit name passed through navigation
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [reservedDates, setReservedDates] = useState([]);
    const handleGoBack = () => navigate(-1);

    useEffect(() => {
        const fetchReservedDates = async () => {
            try {
                const response = await api.get("/reservations/");
                const reservations = response.data;
    
                // Filter reservations for the specific unit
                const unitReservations = reservations.filter(
                    (res) => res.unit_name === title
                );
    
                const eventsData = unitReservations.map((res) => ({
                    title: `Reserved: ${
                        Array.isArray(res.time_of_use)
                            ? res.time_of_use.join(", ")
                            : res.time_of_use || "N/A" // Handle string or null case
                    }`,
                    start: res.date_of_reservation,
                    extendedProps: {
                        unitName: res.unit_name,
                        reservedTimes: Array.isArray(res.time_of_use)
                            ? res.time_of_use
                            : res.time_of_use
                            ? res.time_of_use.split(", ")
                            : [], // Split string into array if needed
                    },
                }));
    
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };
    
        fetchReservedDates();
    }, [title]);
    

    // Function to check if all time slots are reserved for a date and unit
    const isDateFullyReserved = (date, unitName) => {
        const formatDateToLocal = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", { timeZone: "Asia/Manila" });
        };
        console.log(formatDateToLocal("2024-12-26"));
        const reservedTimes = reservations.flatMap(event => event.extendedProps.reservedTimes);

        const allTimes = unit.custom_prices ? Object.keys(unit.custom_prices) : [];
        const remainingTimes = allTimes.filter((time) => !reservedTimes.includes(time));

        return remainingTimes.length === 0;
    };

    return (
        <div className="flex-row calendar-con">
            <button onClick={handleGoBack} className="absolute top-4 left-5">
                <img src="/src/assets/back.png" alt="" className="w-8 h-8" />
            </button>
            <div className="flex flex-col h-screen p-16 calendar">
                <h2 className="text-2xl font-semibold mb-4">Availability for {title}</h2>
                <div className="flex-grow overflow-hidden">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventContent={(eventInfo) => (
                            <div className="text-red-500 text-sm font-semibold">
                                {eventInfo.event.title}
                            </div>
                        )}                        
                        headerToolbar={{
                            left: 'title',
                            right: 'prev,next today',
                        }}
                        height="100%"
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
