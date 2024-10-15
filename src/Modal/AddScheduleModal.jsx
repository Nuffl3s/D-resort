
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';

const AddScheduleModal = ({ 
    isModalOpen, 
    closeModal, 
    handleModalSubmit, 
    modalData, 
    setModalData, 
    employee 
}) => {
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%]">
                        <h2 className="text-2xl font-bold mb-4">Add Schedule</h2>
                        <form onSubmit={handleModalSubmit}>
                            <div className="mb-3">
                                <label className="block font-semibold text-lg mb-1">Name</label>
                                <select
                                    value={modalData.name}
                                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                    className="border border-gray-300 p-2 w-full rounded"
                                >
                                    <option value="">Select Employee</option>
                                    {employee.map((emp) => (
                                        <option key={emp.id} value={emp.name}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(modalData.schedule).map((day) => (
                                    <div key={day}>
                                        <label type="checkbox" className="block font-semibold text-lg mb-3 text-left">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                                        <div className="flex items-center mb-2">
                                            <div className="flex-col">
                                                <div className="flex items-center mr-4">
                                                    <label className="mr-[20px]">Start Time</label>
                                                    <TimePicker
                                                        value={modalData.schedule[day].startTime}
                                                        onChange={(newValue) => setModalData({
                                                            ...modalData,
                                                            schedule: {
                                                                ...modalData.schedule,
                                                                [day]: { ...modalData.schedule[day], startTime: newValue }
                                                            }
                                                        })}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </div>
                                                <div className="flex items-center mt-2">
                                                    <label className="mr-[25px]">End Time</label>
                                                    <TimePicker
                                                        value={modalData.schedule[day].endTime}
                                                        onChange={(newValue) => setModalData({
                                                            ...modalData,
                                                            schedule: {
                                                                ...modalData.schedule,
                                                                [day]: { ...modalData.schedule[day], endTime: newValue }
                                                            }
                                                        })}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </div>
                                            </div>

                                            <select
                                                value={modalData.schedule[day].duty}
                                                onChange={(e) => setModalData({
                                                    ...modalData,
                                                    schedule: {
                                                        ...modalData.schedule,
                                                        [day]: { ...modalData.schedule[day], duty: e.target.value }
                                                    }
                                                })}
                                                className="border border-gray-300 p-2 w-32 rounded mr-4"
                                            >
                                                <option value="">Select Duty</option>
                                                <option value="Store Duty">Store Duty</option>
                                                <option value="Cleaning Duty">Cleaning Duty</option>
                                            </select>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={modalData.schedule[day].dayOff}
                                                    onChange={(e) => setModalData({
                                                        ...modalData,
                                                        schedule: {
                                                            ...modalData.schedule,
                                                            [day]: { ...modalData.schedule[day], dayOff: e.target.checked }
                                                        }
                                                    })}
                                                    className="form-checkbox"
                                                />
                                                <span className="ml-2">Day Off</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-[#ED6565] hover:bg-[#F24E4E] text-white px-4 py-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#70b8d3] hover:bg-[#09B0EF] text-white px-4 py-2 rounded"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </LocalizationProvider>
    );
};

// Define prop types for validation
AddScheduleModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleModalSubmit: PropTypes.func.isRequired,
    modalData: PropTypes.object.isRequired,
    setModalData: PropTypes.func.isRequired,
    employee: PropTypes.array.isRequired,
};

export default AddScheduleModal;
