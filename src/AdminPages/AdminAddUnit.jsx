import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar'; // Importing AdminSidebar
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Importing the API for backend requests

export default function AdminAddUnit() {
    const navigate = useNavigate(); // Navigation hook for potential redirects
    const [unitType, setUnitType] = useState('cottage'); // Default to cottage
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [image, setImage] = useState(null);
    const [customPrices, setCustomPrices] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [unitList, setUnitList] = useState([]); // Stores fetched cottages or lodges
    const [timeSlots, setTimeSlots] = useState([]); // Time slots for cottages or lodges
    const [formData, setFormData] = useState({
        name: "",
        capacity: "",
        type: unitType,
        custom_prices: [],
        image: null,
    });

    const addCustomPrice = () => {
        setCustomPrices([...customPrices, { timeRange: '', price: '' }]);
    };

    const updateCustomPrice = (index, key, value) => {
        const updatedPrices = [...customPrices];
        updatedPrices[index][key] = value;
        setCustomPrices(updatedPrices);
    };

    const removeCustomPrice = (index) => {
        const updatedPrices = customPrices.filter((_, i) => i !== index);
        setCustomPrices(updatedPrices);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        // Validate required fields
        if (!name || !capacity || !image || customPrices.length === 0) {
            setErrorMessage('Please fill in all fields and add at least one custom price.');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('unit_type', unitType); // Send 'cottage' or 'lodge'
        formData.append('capacity', capacity);
        formData.append('image', image); // Ensure this is a file object
        formData.append('custom_prices', JSON.stringify(customPrices)); // Ensure this is used
        
        // Debugging: Log the form data before sending
        console.log('Form Data Entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            const response = await api.post('/add-unit/', formData);
    
            if (response.status === 201) {
                Swal.fire('Success!', 'Unit added successfully!', 'success');
                setName('');
                setCapacity('');
                setImage(null);
                setCustomPrices([]);
                setErrorMessage('');
            } else {
                const errorData = await response.data;
                console.log('Response Error:', errorData); // Debugging: Log response errors
                setErrorMessage(errorData.error || 'Failed to add unit.');
                Swal.fire('Error', errorData.error || 'Failed to add unit.', 'error');
            }
        } catch (error) {
            console.error('Error while adding unit:', error); // Debugging: Log exceptions
            setErrorMessage('An error occurred while adding the unit.');
            Swal.fire('Error', 'An error occurred while adding the unit.', 'error');
        }
    };

    useEffect(() => {
        const fetchUnits = async () => {
        try {
            const endpoint = unitType === "cottage" ? "/cottages/" : "/lodges/";
            const response = await api.get(endpoint);

            // Extract time slots or hourly rates from custom prices
            const uniqueKeys = new Set();
            response.data.forEach((item) => {
            const customPrices = item.custom_prices || {};
            Object.keys(customPrices).forEach((key) => {
                uniqueKeys.add(key.toUpperCase());
            });
            });

            setTimeSlots([...uniqueKeys].sort());
            setUnitList(response.data);
        } catch (error) {
            console.error(`Error fetching ${unitType} data:`, error);
        }
        };

        fetchUnits();
    }, [unitType]);

    
    return (
        <div className="flex">
            <AdminSidebar /> {/* Adding the sidebar component */}
            <div className="p-6 bg-gray-100 flex-grow min-h-screen">
                <h2 className="text-2xl font-bold mb-4">Add New Unit</h2>
                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

                <form onSubmit={handleFormSubmit} className="bg-white p-6 shadow-md rounded">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Unit Type</label>
                        <select
                            value={unitType}
                            onChange={(e) => setUnitType(e.target.value)}
                            className="block w-full p-2 border rounded"
                        >
                            <option value="cottage">Cottage</option>
                            <option value="lodge">Lodge</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Capacity</label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="block w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="block w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Custom Prices</label>
                        {customPrices.map((price, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Time Range (e.g., 6AM-12PM)"
                                    value={price.timeRange}
                                    onChange={(e) => updateCustomPrice(index, 'timeRange', e.target.value)}
                                    className="block w-1/2 p-2 border rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={price.price}
                                    onChange={(e) => updateCustomPrice(index, 'price', e.target.value)}
                                    className="block w-1/3 p-2 border rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeCustomPrice(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addCustomPrice}
                            className="text-blue-500 mt-2"
                        >
                            + Add Custom Price
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Add Unit
                    </button>
                </form>
                {/* Unit List */}
                <div className="w-1/2 p-4 border-l">
                    <h1 className="text-2xl font-bold mb-4">Rates</h1>
                    <div className="flex mb-4">
                    <button
                        onClick={() => setUnitType("cottage")}
                        className={`px-4 py-2 mr-2 ${
                        unitType === "cottage" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Cottage
                    </button>
                    <button
                        onClick={() => setUnitType("lodge")}
                        className={`px-4 py-2 ${
                        unitType === "lodge" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Lodge
                    </button>
                    </div>
                    <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead>
                        <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">#</th>
                        <th className="border border-gray-300 px-4 py-2">Type</th>
                        <th className="border border-gray-300 px-4 py-2">Capacity</th>
                        {timeSlots.map((slot) => (
                            <th key={slot} className="border border-gray-300 px-4 py-2">
                            {slot}
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {unitList.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2 text-center">
                            {index + 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                            {row.type}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                            {row.capacity}
                            </td>
                            {timeSlots.map((slot) => (
                            <td key={slot} className="border border-gray-300 px-4 py-2 text-center">
                                {row.custom_prices?.[slot] || "-"}
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
