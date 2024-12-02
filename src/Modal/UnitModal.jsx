import React, { useState, useEffect } from "react";
import api from '../api';

const UnitModal = ({ isOpen, onClose }) => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
        fetchUnits();
        }
    }, [isOpen]);

    const fetchUnits = async () => {
        setLoading(true);
        try {
        const [cottagesResponse, lodgesResponse] = await Promise.all([
            api.get("/cottages/"),
            api.get("/lodges/"),
        ]);
        setUnits([
            ...cottagesResponse.data.map((unit) => ({ ...unit, type: "Cottage" })),
            ...lodgesResponse.data.map((unit) => ({ ...unit, type: "Lodge" })),
        ]);
        } catch (error) {
        console.error("Failed to fetch units", error);
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        try {
        const endpoint = `/${type.toLowerCase()}s/${id}/`; // Ensure this matches the backend
        console.log("DELETE endpoint:", endpoint); // Debugging
        await api.delete(endpoint);
        setUnits(units.filter((unit) => unit.id !== id));
        alert("Unit deleted successfully");
        } catch (error) {
        console.error("Failed to delete unit:", error.response?.data || error.message);
        alert("Failed to delete unit. Please try again.");
        }
    };

    const handleEdit = (id, type) => {
        // Redirect or open an edit modal
        alert(`Edit ${type} with ID: ${id}`);
    };

    return (
        <div className={`modal ${isOpen ? "is-active" : ""}`}>
        <div className="modal-background" onClick={onClose}></div>
        <div className="modal-content">
            <div className="box">
            <h3 className="title">Units</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table is-fullwidth">
                <thead>
                    <tr>
                    <th>Image</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {units.map((unit) => (
                        <tr key={`${unit.type}-${unit.id}`}>
                        <td>
                        <img
                            src={unit.image.startsWith("http") ? unit.image : `/media/images/${unit.image}`}
                            alt={unit.type}
                            width="50"
                            />
                        </td>
                        <td>{unit.type}</td>
                        <td>{unit.name}</td>
                        <td>{unit.capacity}</td>
                        <td>
                            <button
                            className="button is-warning"
                            onClick={() => handleEdit(unit.id, unit.type)}
                            >
                            Edit
                            </button>
                            <button
                            className="button is-danger"
                            onClick={() => handleDelete(unit.id, unit.type)}
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            </div>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
        </div>
    );
};

export default UnitModal;
