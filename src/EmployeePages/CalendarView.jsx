import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import api from '../api';

const CalendarView = () => {
    const { title } = useParams(); // Title from URL parameter
    const location = useLocation(); // Navigation state
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const unitName = location.state?.unitName || title; // Use state or fallback to URL

    const handleGoBack = () => navigate(-1);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                console.log("Selected Unit Name:", unitName); // Debug unitName
                const response = await api.get('/reservations/', {
                    params: { unit_name: unitName },
                });
    
                if (!response || !response.data) {
                    console.error("Invalid response structure:", response);
                    setEvents([]);
                    return;
                }
    
                const reservations = response.data;
                console.log("API Response:", reservations); // Debug response data
    
                const events = reservations.flatMap((res) => {
                    if (res.unit_name === unitName) { // Ensure filtering by unit
                        if (res.date_range && Array.isArray(res.date_range)) {
                            return res.date_range.map((date) => ({
                                title: `Reserved: ${res.time_of_use || "Unavailable"}`,
                                start: date,
                                backgroundColor: "#50b0d0",
                                borderColor: "#50b0d0",
                            }));
                        } else if (res.date_of_reservation) {
                            return [{
                                title: `Reserved: ${res.time_of_use || "Unavailable"}`,
                                start: res.date_of_reservation,
                                backgroundColor: "#50b0d0",
                                borderColor: "#50b0d0",
                            }];
                        }
                    }
                    return [];
                });
    
                setEvents(events);
            } catch (error) {
                console.error("Error fetching reservations:", error);
                setEvents([]);
            }
        };
    
        fetchCalendarEvents();
    }, [unitName]);
    

    return (
        <div className="flex-row calendar-con">
            <button onClick={handleGoBack} className="absolute top-4 left-5">
                <img src="/src/assets/back.png" alt="" className="w-8 h-8" />
            </button>
            <div className="flex flex-col h-screen p-16 calendar">
                <h2 className="text-2xl font-semibold mb-4">Availability for {unitName}</h2>
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
    headerToolbar={{ right: 'prev,next today' }}
/>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
