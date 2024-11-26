import React, { useEffect, useState } from 'react';
import api from '../api';

const AddScheduleModal = ({ onClose }) => {
    const [form, setForm] = useState({
        employee: '',
        schedule: {
            Monday: { start_time: '', end_time: '', duty: 'Store', day_off: false },
            Tuesday: { start_time: '', end_time: '', duty: 'Store', day_off: false },
            Wednesday: { start_time: '', end_time: '', duty: 'Store', day_off: false },
            Thursday: { start_time: '', end_time: '', duty: 'Store', day_off: false },
            Friday: { start_time: '', end_time: '', duty: 'Store', day_off: false },
            Saturday: { start_time: '', end_time: '', duty: 'Store', day_off: false },
            Sunday: { start_time: '', end_time: '', duty: 'Store', day_off: false },
        },
    });

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Fetch employees from the backend
        api.get('/employees/')
            .then((response) => setEmployees(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleInputChange = (day, field, value) => {
        setForm((prevForm) => ({
            ...prevForm,
            schedule: {
                ...prevForm.schedule,
                [day]: {
                    ...prevForm.schedule[day],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the payload for submission
        const payload = {
            employee: form.employee,
            schedule: form.schedule,
        };

        console.log('Submitting payload:', payload);

        api.post('/weekly-schedules/', payload)
            .then(() => {
                alert('Weekly schedule added successfully!');
                onClose();
            })
            .catch(error => console.error('Error submitting schedule:', error));
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add Work Schedule</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Employee</label>
                        <select
                            name="employee"
                            value={form.employee}
                            onChange={(e) =>
                                setForm({ ...form, employee: e.target.value })
                            }
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.name}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {Object.keys(form.schedule).map((day) => (
                        <div key={day} className="day-section">
                            <h3>{day}</h3>
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    value={form.schedule[day].start_time}
                                    onChange={(e) =>
                                        handleInputChange(day, 'start_time', e.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={form.schedule[day].end_time}
                                    onChange={(e) =>
                                        handleInputChange(day, 'end_time', e.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Duty</label>
                                <select
                                    value={form.schedule[day].duty}
                                    onChange={(e) =>
                                        handleInputChange(day, 'duty', e.target.value)
                                    }
                                >
                                    <option value="Store">Store</option>
                                    <option value="Cleaning">Cleaning</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={form.schedule[day].day_off}
                                        onChange={(e) =>
                                            handleInputChange(day, 'day_off', e.target.checked)
                                        }
                                    />
                                    Day Off
                                </label>
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary">
                        Add
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddScheduleModal;
