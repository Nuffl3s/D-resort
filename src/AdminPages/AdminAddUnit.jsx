import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from '../api'

const AdminAddUnit = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('Cottage'); // Default to "Cottage"
    const [images, setImages] = useState([]);
    const [capacity, setCapacity] = useState('');
    const [formData, setFormData] = useState({
        type: "Cottage", // Default to Cottage
        image: null,
        capacity: "",
        price1: "",
        price2: "",
        price3: "",
        price4: "",
        });

    const [responseMessage, setResponseMessage] = useState("");

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
    
        // Ensure field names match the backend
        data.append("type", formData.type);
        data.append("image", formData.image);
        data.append("capacity", formData.capacity);
        if (formData.type === "Cottage") {
            data.append("time_6am_6pm_price", formData.price1);
            data.append("time_6am_12mn_price", formData.price2);
            data.append("time_6pm_6am_price", formData.price3);
            data.append("time_24hrs_price", formData.price4);
        } else if (formData.type === "Lodge") {
            data.append("time_3hrs_price", formData.price1);
            data.append("time_6hrs_price", formData.price2);
            data.append("time_12hrs_price", formData.price3);
            data.append("time_24hrs_price", formData.price4);
        }
    
        try {
            const response = await api.post("/add-unit/", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResponseMessage("Unit added successfully!");
            console.log("Response:", response.data);
        } catch (error) {
            setResponseMessage("Error adding unit. Please try again.");
            console.error("Error:", error.response?.data || error.message);
        }
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

    const renderPriceFields = () => {
        if (formData.type === "Cottage") {
            return (
            <>
                <div>
                <label htmlFor="price1" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6] dark:text-[#e7e6e6]">
                    6AM-6PM Price
                </label>
                <input
                    type="number"
                    id="price1"
                    name="price1"
                    placeholder="Price for 6AM-6PM"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                />
                </div>
                <div>
                <label htmlFor="price2" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                    6AM-12MN Price
                </label>
                <input
                    type="number"
                    id="price2"
                    name="price2"
                    placeholder="Price for 6AM-12MN"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                />
                </div>
                <div>
                <label htmlFor="price3" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                    6PM-6AM Price
                </label>
                <input
                    type="number"
                    id="price3"
                    name="price3"
                    placeholder="Price for 6PM-6AM"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                />
                </div>
                <div>
                <label htmlFor="price4" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                    24 Hours Price
                </label>
                <input
                    type="number"
                    id="price4"
                    name="price4"
                    placeholder="Price for 24 Hours"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                />
                </div>
            </>
            );
        } else if (formData.type === "Lodge") {
            return (
            <>
                <div>
                <label htmlFor="price1" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                    3 Hours Price
                </label>
                <input
                    type="number"
                    id="price1"
                    name="price1"
                    placeholder="Price for 3 Hours"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                />
                </div>
                <div>
                <label htmlFor="price2" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                    6 Hours Price
                </label>
                <input
                    type="number"
                    id="price2"
                    name="price2"
                    placeholder="Price for 6 Hours"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                />
                </div>
                <div>
                <label htmlFor="price3" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                    12 Hours Price
                </label>
                <input
                    type="number"
                    id="price3"
                    name="price3"
                    placeholder="Price for 12 Hours"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                />
                </div>
                <div>
                <label htmlFor="price4" className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6]">
                    24 Hours Price
                </label>
                <input
                    type="number"
                    id="price4"
                    name="price4"
                    placeholder="Price for 24 Hours"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                />
                </div>
            </>
            );
        }
        };

    return (
        <div className="flex dark:bg-[#111827] bg-gray-100">
            <AdminSidebar />
            <div className="p-6 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">ADD UNIT</h1>

                <div className="mt-10">
                    <form onSubmit={handleSubmit} className=" bg-white p-8 shadow rounded dark:bg-[#374151]">
                        <div className="flex justify-between mb-5">
                            <h2 className="text-2xl font-bold uppercase dark:text-[#e7e6e6]">Add New{type}</h2>
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6] dark:text-[#e7e6e6]">Type</label>
                            <select
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                            >
                                <option value="Cottage">Cottage</option>
                                <option value="Lodge">Lodge</option>
                            </select>
                        </div>

                        {/* Capacity */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6] dark:text-[#e7e6e6]">Capacity</label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                placeholder="Enter capacity"
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border-b-2 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#e7e6e6] dark:text-[#e7e6e6]">
                                Upload Images
                            </label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-gray-600 dark:border-[#bebdbd] dark:border dark:bg-[#303030] dark:text-[#e7e6e6] dark:placeholder-white"
                            />
                            <p className="text-xs text-gray-500 dark:text-[#e7e6e6]">Selected: {images.length} file(s)</p>
                        </div>

                        {renderPriceFields()}

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
