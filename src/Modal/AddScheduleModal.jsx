import { useEffect, useState } from 'react';
import api from '../api';

// eslint-disable-next-line react/prop-types
const AddScheduleModal = ({ onClose }) => {
    const [form, setForm] = useState({
        employee: '',
        schedule: {
            Monday: { start_time: '', end_time: '', day_off: false },
            Tuesday: { start_time: '', end_time: '', day_off: false },
            Wednesday: { start_time: '', end_time: '', day_off: false },
            Thursday: { start_time: '', end_time: '', day_off: false },
            Friday: { start_time: '', end_time: '', day_off: false },
            Saturday: { start_time: '', end_time: '', day_off: false },
            Sunday: { start_time: '', end_time: '', day_off: false },
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%]">
                <h2 className="text-2xl font-bold mb-4">Add Schedule</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block font-semibold text-lg mb-1">Employee</label>
                        <select
                            name="employee"
                            value={form.employee}
                            onChange={(e) =>
                                setForm({ ...form, employee: e.target.value })
                            }
                            className="border border-gray-300 p-2 w-full rounded"
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

                    <div className="grid grid-cols-2 gap-4">
                        {Object.keys(form.schedule).map((day) => (
                            <div key={day} className="day-section">
                                <label type="checkbox" className="block font-semibold text-lg mb-3 text-left">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                                <div className="flex items-center mb-2">
                                    <div className="flex">
                                        <div className="flex items-center mr-4">
                                            <label className="mr-[20px]">Start Time</label>
                                            <input
                                                type="time"
                                                value={form.schedule[day].start_time}
                                                onChange={(e) =>
                                                    handleInputChange(day, 'start_time', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <label className="mr-[20px]">End Time</label>
                                            <input
                                                type="time"
                                                value={form.schedule[day].end_time}
                                                onChange={(e) =>
                                                    handleInputChange(day, 'end_time', e.target.value)
                                                }
                                            />
                                        </div>
                                </div>

                                <div className="form-group">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={form.schedule[day].day_off}
                                            onChange={(e) =>
                                                handleInputChange(day, 'day_off', e.target.checked)
                                            }
                                        />
                                        <span className="ml-2">Day Off</span>
                                    </label>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-[#70b8d3] hover:bg-[#09B0EF] text-white px-4 py-2 rounded mr-4">
                            Add
                        </button>
                        <button 
                            type="button"
                            className="bg-[#ED6565] hover:bg-[#F24E4E] text-white px-4 py-2 rounded mr-2"
                            onClick={onClose}
                            
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddScheduleModal;
