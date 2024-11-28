import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminAddUnit = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('Cottage'); // Default to "Cottage"
    const [images, setImages] = useState([]);
    const [capacity, setCapacity] = useState('');
    const [prices, setPrices] = useState({
        time_6am_6pm: '',
        time_6am_12mn: '',
        time_6pm_6am: '',
        time_24hrs: '',
        time_3hrs: '',
        time_6hrs: '',
        time_12hrs: '',
    });

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + images.length > 5) {
            alert('You can upload a maximum of 5 images.');
            return;
        }
        setImages([...images, ...files]);
    };

    const handlePriceChange = (field, value) => {
        setPrices((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct form data to handle submissions
        const formData = new FormData();
        formData.append('type', type);
        formData.append('capacity', capacity);
        images.forEach((image, index) => formData.append(`image_${index}`, image));
        Object.keys(prices).forEach((key) => {
            if (prices[key]) formData.append(key, prices[key]);
        });

        // Simulate a successful submission
        console.log('Submitting:', { type, capacity, prices, images });

        // Show SweetAlert confirmation
        Swal.fire({
            title: 'Success!',
            text: 'The new item has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    };

    const handleTempoBtnBooking = () => {
        navigate('/booking');
    };


    return (
        
        <div className="flex dark:bg-[#1c1e21]">
            <AdminSidebar />
            <div className="p-6 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">ADD UNIT</h1>

                <div className="mt-10">
                    <form onSubmit={handleSubmit} className=" bg-white p-8 shadow rounded dark:bg-[#303030]">
                        <div className="flex justify-between mb-5">
                            <h2 className="text-2xl font-bold uppercase dark:text-[#e7e6e6]">Add New {type}</h2>

                            <button
                                onClick={handleTempoBtnBooking}
                                type="submit"
                                className="text-white bg-[#70b8d3] hover:bg-[#09B0EF] font-medium shadow px-4 py-2 rounded"
                            >
                                Go to Booking
                            </button>
                        </div>
                        {/* Type Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                            >
                                <option value="Cottage">Cottage</option>
                                <option value="Lodge">Lodge</option>
                            </select>
                        </div>

                        {/* Capacity */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">Capacity</label>
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="Enter capacity"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                Upload Images (Max 5)
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="mt-1 block w-full text-gray-600 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                            />
                            <p className="text-xs text-gray-500 dark:text-[#e7e6e6]">Selected: {images.length} file(s)</p>
                        </div>

                        {/* Pricing Fields */}
                        {type === 'Cottage' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                        Price (6AM - 6PM)
                                    </label>
                                    <input
                                        type="number"
                                        value={prices.time_6am_6pm}
                                        onChange={(e) =>
                                            handlePriceChange('time_6am_6pm', e.target.value)
                                        }
                                        placeholder="Enter price"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                        Price (6AM - 12MN)
                                    </label>
                                    <input
                                        type="number"
                                        value={prices.time_6am_12mn}
                                        onChange={(e) =>
                                            handlePriceChange('time_6am_12mn', e.target.value)
                                        }
                                        placeholder="Enter price"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                        Price (6PM - 6AM)
                                    </label>
                                    <input
                                        type="number"
                                        value={prices.time_6pm_6am}
                                        onChange={(e) =>
                                            handlePriceChange('time_6pm_6am', e.target.value)
                                        }
                                        placeholder="Enter price"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                        Price (24 HRS)
                                    </label>
                                    <input
                                        type="number"
                                        value={prices.time_24hrs}
                                        onChange={(e) =>
                                            handlePriceChange('time_24hrs', e.target.value)
                                        }
                                        placeholder="Enter price"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                                    />
                                </div> 
                            </>
                        )}

                        {type === 'Lodge' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                        Price (3 HRS)
                                    </label>
                                    <input
                                        type="number"
                                        value={prices.time_3hrs}
                                        onChange={(e) =>
                                            handlePriceChange('time_3hrs', e.target.value)
                                        }
                                        placeholder="Enter price"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                        Price (6 HRS)
                                    </label>
                                    <input
                                        type="number"
                                        value={prices.time_6hrs}
                                        onChange={(e) =>
                                            handlePriceChange('time_6hrs', e.target.value)
                                        }
                                        placeholder="Enter price"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                        Price (12 HRS)
                                    </label>
                                    <input
                                        type="number"
                                        value={prices.time_12hrs}
                                        onChange={(e) =>
                                            handlePriceChange('time_12hrs', e.target.value)
                                        }
                                        placeholder="Enter price" 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                                        Price (24 HRS)
                                    </label>
                                    <input
                                        type="number"
                                        value={prices.time_24hrs}
                                        onChange={(e) =>
                                            handlePriceChange('time_24hrs', e.target.value)
                                        }
                                        placeholder="Enter price"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="reset"
                                className="text-white bg-red-600 hover:bg-red-500 font-medium shadow px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="text-white bg-[#70b8d3] hover:bg-[#09B0EF] font-medium shadow px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
    );
};

export default AdminAddUnit;
