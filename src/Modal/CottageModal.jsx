import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api'; // Import your API setup

const CottageModal = ({ isOpen, onClose }) => {
    const [cottages, setCottages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1); // Reset to first page when modal opens
            fetchCottages(); // Fetch data when modal is opened
        }
    }, [isOpen]);

    const fetchCottages = async () => {
        try {
            const response = await api.get('/cottages/');
            setCottages(response.data); // Update state with API data
        } catch (error) {
            console.error('Error fetching cottages:', error);
        }
    };

    const filteredCottages = cottages.filter(cottage =>
        cottage.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCottage = currentPage * itemsPerPage;
    const indexOfFirstCottage = indexOfLastCottage - itemsPerPage;
    const currentCottages = filteredCottages.slice(indexOfFirstCottage, indexOfLastCottage);

    const totalPages = Math.ceil(filteredCottages.length / itemsPerPage);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1300px] h-[720px]">
                <div className="flex justify-between mb-5">
                    <h2 className="self-center text-xl font-semibold">COTTAGES</h2>
                    <button onClick={onClose} className="text-[25px] font-bold hover:text-[#0f8bb1]">
                        &times;
                    </button>
                </div>

                {/* Search Bar */}
                <div className="flex justify-between">
                    <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-900">
                        <span className="text-[13px] font-semibold text-gray-600 uppercase">Show</span>
                        <select className="appearance-none border border-gray-300 bg-white py-1 px-2 pr-8 rounded leading-tight focus:outline-none">
                            <option value="5">5</option>
                        </select>
                        <span className="text-[13px] font-semibold text-gray-600 uppercase">entries</span>
                    </div>

                    <div className="flex">
                        <div className="flex items-center bg-white border border-gray-300 rounded-md p-2 mb-4">
                            <img src="./src/assets/search.png" className="w-5 h-5" alt="search icon" />
                            <input
                                type="text"
                                placeholder="Search cottages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white outline-none ml-2 flex-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-col">
                    {/* Cottages Table */}
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Unit Name
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Capacity
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCottages.map((cottage, index) => (
                                    <tr key={cottage.id}>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            {indexOfFirstCottage + index + 1}
                                        </td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            <img
                                                src={cottage.image_url}
                                                alt={cottage.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            {cottage.name}
                                        </td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            {cottage.capacity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="hover:bg-[#09B0EF] bg-[#70b8d3] text-sm text-white font-semibold px-4 py-2 rounded"
                        >
                            Prev
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className="hover:bg-[#09B0EF] bg-[#70b8d3] text-sm text-white font-semibold px-4 py-2 rounded"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Define PropTypes
CottageModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CottageModal;
