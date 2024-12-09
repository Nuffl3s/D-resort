import React, { useState, useEffect } from "react";
import api from '../api';

const Modal = ({ onClose, onAddUnit, selectedUnits, onRemoveUnit }) => {
    const [isCottage, setIsCottage] = useState(true);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchUnits = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = isCottage
                    ? "/cottages/"
                    : "/lodges/";
                const response = await api.get(endpoint);
                setUnits(response.data);
            } catch (err) {
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, [isCottage]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[800px] rounded-lg shadow-lg flex flex-row max-h-[90vh] overflow-hidden">
                {/* Left Section: Add New Units */}
                <div className="w-1/2 border-r overflow-y-auto">
                    <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                        <h3 className="text-xl font-bold">{isCottage ? "Cottages" : "Lodges"}</h3>
                    </div>
                    <div className="flex justify-between p-4 border-b sticky top-[50px] bg-white z-10">
                        <button
                            onClick={() => setIsCottage(true)}
                            className={`px-4 py-2 rounded-md ${
                                isCottage ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                        >
                            Cottages
                        </button>
                        <button
                            onClick={() => setIsCottage(false)}
                            className={`px-4 py-2 rounded-md ${
                                !isCottage ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                        >
                            Lodges
                        </button>
                    </div>
                    {loading ? (
                        <p className="p-4">Loading...</p>
                    ) : error ? (
                        <p className="p-4 text-red-500">{error}</p>
                    ) : (
                        <div className="p-4 space-y-4">
                            {units.map((unit) => (
                                <div
                                    key={unit.id}
                                    className="border rounded-md p-4 shadow-sm hover:shadow-md"
                                >
                                    <h4 className="font-bold">{unit.name}</h4>
                                    <p>Capacity: {unit.capacity}</p>
                                    {Object.entries(unit.custom_prices || {}).map(([key, value]) => (
                                        <p key={key}>
                                            {key}: ₱{value}
                                        </p>
                                    ))}
                                    <button
                                        onClick={() => onAddUnit(unit)}
                                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Right Section: Selected Units */}
                <div className="w-1/2 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Selected Units</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                    {selectedUnits.length > 0 ? (
                        selectedUnits.map((unit, index) => (
                            <div
                                key={index}
                                className="border rounded-md p-4 shadow-sm mb-4"
                            >
                                <h4 className="font-bold">{unit.name}</h4>
                                <p>Type: <span className="font-semibold">{unit.type}</span></p>
                                <p>Capacity: {unit.capacity}</p>
                                {Object.entries(unit.custom_prices || {}).map(([key, value]) => (
                                    <p key={key}>
                                        {key}: ₱{value}
                                    </p>
                                ))}
                                <button
                                    onClick={() => onRemoveUnit(index)}
                                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No units selected.</p>
                    )}
                    <div className="p-4 border-t sticky bottom-0 bg-white z-10 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
