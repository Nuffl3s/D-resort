import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import api from '../api';

const CalendarView = () => {
    const { title } = useParams();
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const handleGoBack = () => navigate(-1);

    const formatTimeTo12Hour = (time24) => {
        const [hour, minute] = time24.split(":");
        const period = +hour >= 12 ? "PM" : "AM";
        const hour12 = +hour % 12 || 12; // Convert to 12-hour format
        return `${hour12}:${minute} ${period}`;
    };
    
    const formatTimeRange = (timeRange) => {
        const [start, end] = timeRange.split("-"); // Split start and end times
        return `${formatTimeTo12Hour(start)} - ${formatTimeTo12Hour(end)}`;
    };

    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                const response = await api.get('/calendar/', {
                    params: { unit_name: title }, // Filter by unit name
                });
                const reservations = response.data;

                const eventsData = reservations.map((res) => ({
                    title: `Reserved: ${res.times.map(time => formatTimeRange(time)).join(", ")}`,
                    start: res.date,
                    backgroundColor: "#50b0d0", // Change to desired color
                    borderColor: "#50b0d0", 
                    extendedProps: {
                        unitName: res.unit_name,
                        reservedTimes: res.times,
                    },
                }));

                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching calendar events:", error);
            }
        };

        fetchCalendarEvents();
    }, [title]);

    return (
        <div className="flex-row calendar-con">
            <button onClick={handleGoBack} className="absolute top-4 left-5">
                <img src="/src/assets/back.png" alt="" className="w-8 h-8" />
            </button>
            <div className="flex flex-col h-screen p-16 calendar">
                <h2 className="text-2xl font-semibold mb-4">Events for {title}</h2>
                <div className="flex-grow overflow-hidden">
                <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventContent={(eventInfo) => (
                            <div className="text-black text-base font-semibold" style={{ whiteSpace: 'normal', padding: '2px' }}>
                                {eventInfo.event.title}
                            </div>
                        )}
                        height="100%"
                        headerToolbar={{
                            right: 'prev,next today',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
