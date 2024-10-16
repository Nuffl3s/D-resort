import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CalendarEventModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    // Early return if modal is not open
    if (!isOpen) return null;

    const cottages = [
        { number: 1, type: 'Cottage A - Function Hall' },
        { number: 2, type: 'Cottage B' },
        { number: 3, type: 'Cottage C' },
        { number: 4, type: 'Cottage D' },
        { number: 5, type: 'Cottage E' },
        { number: 6, type: 'Cottage F' },
        { number: 7, type: 'Cottage G' },
        { number: 8, type: 'Cottage H' },
        { number: 9, type: 'Cottage I' },
        { number: 10, type: 'Cottage J' },
        { number: 11, type: 'Cottage K' },
        { number: 12, type: 'Cottage L' },
        { number: 13, type: 'Cottage M' },
        { number: 14, type: 'Cottage N' },
        { number: 15, type: 'Cottage O' },
        { number: 16, type: 'Cottage P' },
        { number: 17, type: 'Cottage Q' },
        { number: 18, type: 'Cottage R' },
        { number: 19, type: 'Cottage S' },
        { number: 20, type: 'Cottage T' },
        { number: 21, type: 'Cottage U' },
        { number: 22, type: 'Cottage V' },
        { number: 23, type: 'Cottage W - SOCIAL HALL' },
    ];

    const lodges = [
        { number: 1, type: 'Lodge A' },
        { number: 2, type: 'Lodge B' },
        { number: 3, type: 'Lodge C' },
        { number: 4, type: 'Lodge D' },
        { number: 5, type: 'Lodge E' },
    ];

    const checkAvailability = (type) => {
        navigate(`/calendar/${type}`); // Navigate to calendar page with type
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%]">
                <h2 className="text-[25px] font-semibold mb-4">CALENDAR EVENTS</h2>

                <div className="flex justify-between">
                    {/* Cottages Table */}
                    <div className="w-1/2 mr-2">
                        <div className="mb-2">
                            <h3 className="text-md font-semibold mb-2">Cottages</h3>
                        </div>

                        {/* Cottages Scrollable Table */}
                        <div className="w-full text-sm text-center text-gray-500 max-h-[500px] overflow-y-auto">
                            <table className="min-w-full border-collapse text-gray-700 uppercase bg-white table-fixed">
                                <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10">
                                    <tr>
                                        <th className="border p-2">No.</th>
                                        <th className="border p-2">Cottage Type</th>
                                        <th className="border p-2">Availability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cottages.map((cottage) => (
                                        <tr key={cottage.number}>
                                            <td className="border py-4 text-center">{cottage.number}</td>
                                            <td className="border py-4 text-center">{cottage.type}</td>
                                            <td className="border py-4 text-center">
                                                <button 
                                                    onClick={() => checkAvailability(cottage.type)}
                                                    className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded">
                                                    Check
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Lodges Table */}
                    <div className="w-1/2 ml-2">
                        <div className="mb-2">
                            <h3 className="text-md font-semibold mb-2">Lodges</h3>
                        </div>

                        {/* Lodges Scrollable Table */}
                        <div className="w-full text-sm text-center text-gray-500">
                            <table className="min-w-full border-collapse">
                                <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10">
                                    <tr>
                                        <th className="border p-2">No.</th>
                                        <th className="border p-2">Lodge Type</th>
                                        <th className="border p-2">Availability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lodges.map((lodge) => (
                                        <tr key={lodge.number}>
                                            <td className="border py-4 text-center">{lodge.number}</td>
                                            <td className="border py-4 text-center">{lodge.type}</td>
                                            <td className="border py-4 text-center">
                                                <button 
                                                    onClick={() => checkAvailability(lodge.type)}
                                                    className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded">
                                                    Check
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-end mt-5">
                    <button
                        onClick={onClose}
                        className="mt-4 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

CalendarEventModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CalendarEventModal;
