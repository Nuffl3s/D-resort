import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api'; // Import API setup

const LodgeModal = ({ isOpen, onClose }) => {
    const [lodges, setLodges] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1); // Reset to first page when modal opens
            fetchLodges(); // Fetch lodges data
        }
    }, [isOpen]);

    const fetchLodges = async () => {
        try {
            const response = await api.get('/lodges/');
            setLodges(response.data); // Update state with fetched data
        } catch (error) {
            console.error('Error fetching lodges:', error);
        }
    };

    const filteredLodges = lodges.filter(lodge =>
        lodge.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastLodge = currentPage * itemsPerPage;
    const indexOfFirstLodge = indexOfLastLodge - itemsPerPage;
    const currentLodges = filteredLodges.slice(indexOfFirstLodge, indexOfLastLodge);

    const totalPages = Math.ceil(filteredLodges.length / itemsPerPage);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1300px] h-[720px]">
                <div className="flex justify-between mb-5">
                    <h2 className="self-center text-xl font-semibold">LODGES</h2>
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
                                placeholder="Search lodges..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white outline-none ml-2 flex-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-col">
                    {/* Lodges Table */}
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
                                {currentLodges.map((lodge, index) => (
                                    <tr key={lodge.id}>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            {indexOfFirstLodge + index + 1}
                                        </td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            <img
                                                src={lodge.image_url}
                                                alt={lodge.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            {lodge.name}
                                        </td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            {lodge.capacity}
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
LodgeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default LodgeModal;
