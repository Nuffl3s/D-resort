import React, { useState, useEffect } from 'react';
import api from '../api'; // Ensure this is correctly set up
import Swal from 'sweetalert2';

export default function EmployeeDash() {
    const [cottages, setCottages] = useState([]);
    const [timeRanges, setTimeRanges] = useState([]);

    useEffect(() => {
        const fetchCottages = async () => {
            try {
                const response = await api.get('/cottages');
                const cottagesData = response.data;

                console.log('Cottages Data:', cottagesData); // Debugging

                // Extract all unique time ranges
                const allTimeRanges = new Set();
                cottagesData.forEach((cottage) => {
                    if (Array.isArray(cottage.custom_prices)) {
                        cottage.custom_prices.forEach((price) => {
                            allTimeRanges.add(price.timeRange);
                        });
                    } else {
                        console.warn('Invalid custom_prices format:', cottage.custom_prices);
                    }
                });

                setCottages(cottagesData);
                setTimeRanges(Array.from(allTimeRanges)); // Convert Set to Array
            } catch (error) {
                console.error('Error fetching cottages:', error);
                Swal.fire('Error', 'Failed to fetch cottages data.', 'error');
            }
        };

        fetchCottages();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Rates</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Type</th>
                        <th className="border px-4 py-2">Capacity</th>
                        {timeRanges.map((timeRange, index) => (
                            <th key={index} className="border px-4 py-2">{timeRange}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cottages.map((cottage, index) => (
                        <tr key={cottage.id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{cottage.type}</td>
                            <td className="border px-4 py-2">{cottage.capacity}</td>
                            {timeRanges.map((timeRange, index) => {
                                const priceObj = Array.isArray(cottage.custom_prices)
                                    ? cottage.custom_prices.find((price) => price.timeRange === timeRange)
                                    : null;
                                return (
                                    <td key={index} className="border px-4 py-2">
                                        {priceObj ? priceObj.price : 'N/A'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
