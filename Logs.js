import { useState, useEffect } from "react";
import api from "../api"; // Adjust import as per your project structure
import AdminSidebar from '../components/AdminSidebar';

const AdminAddUnit = () => {
    const [unitType, setUnitType] = useState("Cottage"); // Default to Cottage
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [image, setImage] = useState(null);
    const [customPrices, setCustomPrices] = useState([]);
    const [cottages, setCottages] = useState([]);
    const [lodges, setLodges] = useState([]);

    // Fetch units
    const fetchUnits = async () => {
        try {
            const cottageResponse = await api.get("/cottages/");
            setCottages(cottageResponse.data);
            const lodgeResponse = await api.get("/lodges/");
            setLodges(lodgeResponse.data);
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const handleAddUnit = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("unit_type", unitType.toLowerCase());
        formData.append("capacity", capacity);
        if (image) formData.append("image", image);
        formData.append("custom_prices", JSON.stringify(customPrices));

        try {
            await api.post("/add-unit/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Unit added successfully");
            fetchUnits(); // Refresh the table data
        } catch (error) {
            console.error("Error adding unit:", error.response?.data || error.message);
        }
    };

    const handleCustomPriceChange = (index, field, value) => {
        const updatedPrices = [...customPrices];
        updatedPrices[index][field] = value;
        setCustomPrices(updatedPrices);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-grow p-4 bg-gray-100">
                <h2 className="text-2xl font-bold mb-4">Add New Unit</h2>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="mb-4">
                            <label className="block font-medium mb-2">Unit Type</label>
                            <select
                                value={unitType}
                                onChange={(e) => setUnitType(e.target.value)}
                                className="border rounded px-3 py-2 w-full"
                            >
                                <option value="Cottage">Cottage</option>
                                <option value="Lodge">Lodge</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border rounded px-3 py-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-2">Capacity</label>
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="border rounded px-3 py-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-2">Image</label>
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="border rounded px-3 py-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-2">Custom Prices</label>
                            {customPrices.map((price, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Time Range"
                                        value={price.timeRange}
                                        onChange={(e) =>
                                            handleCustomPriceChange(index, "timeRange", e.target.value)
                                        }
                                        className="border rounded px-3 py-2 w-1/2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={price.price}
                                        onChange={(e) =>
                                            handleCustomPriceChange(index, "price", e.target.value)
                                        }
                                        className="border rounded px-3 py-2 w-1/2"
                                    />
                                    <button
                                        onClick={() =>
                                            setCustomPrices(customPrices.filter((_, i) => i !== index))
                                        }
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() =>
                                    setCustomPrices([...customPrices, { timeRange: "", price: "" }])
                                }
                                className="text-blue-500 underline"
                            >
                                Add Price
                            </button>
                        </div>
                        <button
                            onClick={handleAddUnit}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add Unit
                        </button>
                    </div>

                    {/* Tables */}
                    <div>
                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={() => setUnitType("Cottage")}
                                className={`px-4 py-2 rounded ${
                                    unitType === "Cottage"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                Cottage
                            </button>
                            <button
                                onClick={() => setUnitType("Lodge")}
                                className={`px-4 py-2 rounded ${
                                    unitType === "Lodge"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                Lodge
                            </button>
                        </div>
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Capacity</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(unitType === "Cottage" ? cottages : lodges).map((unit) => (
                                    <tr key={unit.id}>
                                        <td className="border px-4 py-2">{unit.name}</td>
                                        <td className="border px-4 py-2">{unit.capacity}</td>
                                        <td className="border px-4 py-2">
                                            <button className="text-blue-500">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAddUnit;
