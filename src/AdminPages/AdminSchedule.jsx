import React, { useEffect, useState } from 'react';
import api from '../api'; // Adjust this import based on your project structure
import AddScheduleModal from '../Modal/AddScheduleModal'; // Adjust this import based on your project structure

const AdminSchedule = () => {
    const [schedules, setSchedules] = useState([]); // Stores the list of schedules
    const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

    // Fetch the schedules from the backend
    useEffect(() => {
        api.get('/weekly-schedules/')
            .then((response) => {
                console.log('Fetched schedules:', response.data); // Debugging log
                setSchedules(response.data); // Update the state with fetched schedules
            })
            .catch((error) => console.error('Error fetching schedules:', error));
    }, []);

    // Function to close the modal and refresh schedules
    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
        // Refresh the list of schedules
        api.get('/weekly-schedules/')
            .then((response) => setSchedules(response.data))
            .catch((error) => console.error('Error refreshing schedules:', error));
    };

    // Fixed day order for consistent display
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div>
            <h1>Work Schedules</h1>
            <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)} // Open the modal
            >
                Add
            </button>
            {isModalOpen && <AddScheduleModal onClose={handleModalClose} />} {/* Modal Component */}
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Employee</th>
                        <th>Schedule</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.length === 0 ? ( // If no schedules exist, show a placeholder row
                        <tr>
                            <td colSpan="4">No schedules available.</td>
                        </tr>
                    ) : (
                        schedules.map((schedule, index) => (
                            <tr key={schedule.id}>
                                <td>{index + 1}</td> {/* Serial number */}
                                <td>{schedule.employee}</td> {/* Employee name */}
                                <td>
                                    {dayOrder.map((day) => ( // Render days in fixed order
                                        <div key={day}>
                                            <strong>{day}:</strong>{' '}
                                            {schedule.schedule[day]?.day_off
                                                ? 'Day Off'
                                                : `${schedule.schedule[day]?.start_time || 'N/A'} - ${
                                                        schedule.schedule[day]?.end_time || 'N/A'
                                                    } (${schedule.schedule[day]?.duty || 'N/A'})`}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <button className="btn btn-danger">Delete</button> {/* Delete button */}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSchedule;
