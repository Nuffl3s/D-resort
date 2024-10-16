import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Input = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    persons,
    setPersons,
    showGuestDropdown,
    setShowGuestDropdown,
    handleSearch,
    guestDropdownRef,
}) => {
    // State to control the visibility of the date pickers
    const [checkInDatePickerOpen, setCheckInDatePickerOpen] = useState(false);
    const [checkOutDatePickerOpen, setCheckOutDatePickerOpen] = useState(false);

    const formatSelectedDate = (date) => {
        if (!date) return '';
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleDone = () => {
        setCheckInDatePickerOpen(false);
        setCheckOutDatePickerOpen(false);
    };

    return (
        <div className="mx-auto">
            <div className="flex justify-center">
                {/* Check-in, Check-out, and People inputs */}
                <div className="flex items-center input">
                    {/* Check-in input */}
                    <div className="relative flex items-center mx-3">
                        <input
                            type="text"
                            placeholder="Check in"
                            value={startDate ? formatSelectedDate(startDate) : ''}
                            readOnly
                            onClick={() => {
                                setCheckInDatePickerOpen((prev) => !prev);
                                setCheckOutDatePickerOpen(false);
                            }}
                            className="bg-white border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-[340px] p-4 cursor-pointer checkIn-Out"
                        />
                        {/* Check-in Date Picker Popup */}
                        {checkInDatePickerOpen && (
                            <div className="absolute top-full mt-2 p-4 border rounded-lg shadow-md bg-white z-10">
                                <p className="text-gray-400 mb-1">Check in:</p>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        if (date && endDate && date >= endDate) {
                                            setEndDate(null);
                                        }
                                    }}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsStart
                                    inline
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleDone}
                                        className="bg-[#12B1D1] text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Check out"
                            value={endDate ? formatSelectedDate(endDate) : ''}
                            readOnly
                            onClick={() => {
                                setCheckOutDatePickerOpen((prev) => !prev);
                                setCheckInDatePickerOpen(false);
                            }}
                            className="bg-white border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-[340px] p-4 cursor-pointer checkIn-Out"
                        />
                        {/* Check-out Date Picker Popup */}
                        {checkOutDatePickerOpen && (
                            <div className="absolute top-full mt-2 p-4 border rounded-lg shadow-md bg-white z-10">
                                <p className="text-gray-400 mb-1">Check out:</p>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsEnd
                                    minDate={startDate}
                                    inline
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleDone}
                                        className="bg-[#12B1D1] text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Guests Dropdown */}
                    <div className="mx-3 relative">
                        <input
                            type="text"
                            readOnly
                            onClick={() => setShowGuestDropdown((prev) => !prev)}
                            value={`${persons} Persons`}
                            className="bg-white border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-96 p-4 cursor-pointer"
                        />
                        {showGuestDropdown && (
                            <div ref={guestDropdownRef} className="absolute top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 w-full">
                                <div className="p-4">
                                    {/* Persons */}
                                    <div className="flex justify-between items-center">
                                        <span>Persons</span>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setPersons(Math.max(1, persons - 1))}
                                                className="px-2 py-1 bg-gray-200 rounded">-
                                            </button>
                                            <span>{persons}</span>
                                            <button
                                                type="button"
                                                onClick={() => setPersons(persons + 1)}
                                                className="px-2 py-1 bg-gray-200 rounded">+ 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="bg-[#12B1D1] text-white px-8 py-4 rounded-md hover:bg-[#3ebae7] searchBtn"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Input.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
    persons: PropTypes.number.isRequired,
    setPersons: PropTypes.func.isRequired,
    showGuestDropdown: PropTypes.bool.isRequired,
    setShowGuestDropdown: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    guestDropdownRef: PropTypes.object.isRequired,
};

export default Input;
