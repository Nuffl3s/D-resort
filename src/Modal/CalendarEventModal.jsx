import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CalendarEventModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [cottages, setCottages] = useState([]);
    const [lodges, setLodges] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchUnits = async () => {
            try {
                const [cottagesResponse, lodgesResponse] = await Promise.all([
                    api.get('/cottages/'),
                    api.get('/lodges/')
                ]);

                setCottages(cottagesResponse.data);
                setLodges(lodgesResponse.data);
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };

        fetchUnits();
    }, [isOpen]);

    const checkAvailability = (unitName) => {
        navigate(`/calendar/${unitName}`, { state: { unitName } });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%]">
                <h2 className="text-[25px] font-semibold mb-4">CALENDAR EVENTS</h2>

                <div className="flex justify-between">
                    {/* Cottages Table */}
                    <div className="w-1/2 mr-2">
                        <h3 className="text-md font-semibold mb-2">Cottages</h3>
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
                                    {cottages.map((cottage, index) => (
                                        <tr key={cottage.id}>
                                            <td className="border py-4 text-center">{index + 1}</td>
                                            <td className="border py-4 text-center">{cottage.name}</td>
                                            <td className="border py-4 text-center">
                                                <button 
                                                    onClick={() => checkAvailability(cottage.name)}
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
                        <h3 className="text-md font-semibold mb-2">Lodges</h3>
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
                                    {lodges.map((lodge, index) => (
                                        <tr key={lodge.id}>
                                            <td className="border py-4 text-center">{index + 1}</td>
                                            <td className="border py-4 text-center">{lodge.name}</td>
                                            <td className="border py-4 text-center">
                                                <button 
                                                    onClick={() => checkAvailability(lodge.name)}
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
