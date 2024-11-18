import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const cottages = [
    // Sample data
    { id: 1, image: '/path/to/image1.jpg', number: 'Cottage 1', type: 'Type A', status: 'Available' },
    { id: 2, image: '/path/to/image2.jpg', number: 'Cottage 2', type: 'Type B', status: 'Booked' },
    { id: 3, image: '/path/to/image3.jpg', number: 'Cottage 3', type: 'Type C', status: 'Available' },
    { id: 4, image: '/path/to/image4.jpg', number: 'Cottage 4', type: 'Type A', status: 'Booked' },
    { id: 5, image: '/path/to/image5.jpg', number: 'Cottage 5', type: 'Type B', status: 'Available' },
    { id: 6, image: '/path/to/image6.jpg', number: 'Cottage 6', type: 'Type C', status: 'Booked' },
    
    // Add more cottages as needed
];

const CottageModal = ({ isOpen, onClose }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCottages = cottages.filter(cottage =>
        cottage.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCottage = currentPage * itemsPerPage;
    const indexOfFirstCottage = indexOfLastCottage - itemsPerPage;
    const currentCottages = filteredCottages.slice(indexOfFirstCottage, indexOfLastCottage);

    const totalPages = Math.ceil(filteredCottages.length / itemsPerPage);

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1); // Reset to first page when modal opens
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1300px] h-[720px]">

                <div className="flex justify-between mb-5">
                    <h2 className="self-center text-xl font-semibold">COTTAGES</h2>

                    <button
                        onClick={onClose}
                        className="text-[25px] font-bold hover:text-[#0f8bb1]"
                    >
                        &times;
                    </button>
                </div>
                
                {/* Search Bar */}
                <div className="flex justify-between">
                    
                    <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-900">
                        <span className="text-[13px] font-semibold text-gray-600 uppercase">Show</span>
                        <div className="relative inline-block">
                            <select className="appearance-none border border-gray-300 bg-white py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                <option value="1">1</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <img src="./src/assets/down.png" className="fill-current w-4 h-4"/>
                            </div>
                         </div>
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

                        <div className="lg:ml-30 ml-4 space-x-8">
                            <button className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                                Check
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-col">
                    {/* Cottages Table */}
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Number</th>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="px-5 py-3 border-b-2 border-r border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCottages.map((cottage, index) => (
                                    <tr key={cottage.id}>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">{indexOfFirstCottage + index + 1}</td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">
                                            <img 
                                                src={cottage.image} 
                                                className="w-16 h-16 object-cover rounded" 
                                            />
                                        </td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">{cottage.number}</td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">{cottage.type}</td>
                                        <td className="p-3 border-b border-r border-gray-200 bg-white text-sm">{cottage.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="hover:bg-[#09B0EF] bg-[#70b8d3] text-sm text-white font-semibold  px-4 py-2 rounded"
                        >
                            Prev
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
    onClose: PropTypes.func.isRequired
};

export default CottageModal;
