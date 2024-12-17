import { useState, useEffect } from "react";
import api from "../api";
import AdminSidebar from '../components/AdminSidebar';
import { useRef } from "react";


const AdminAddUnit = () => {
    const [unitType, setUnitType] = useState("Cottage"); // Default to Cottage
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [image, setImage] = useState(null);
    const [customPrices, setCustomPrices] = useState([
        { startTime: "", endTime: "", price: "" },
    ]);
    const [cottages, setCottages] = useState([]);
    const [lodges, setLodges] = useState([]);
    const [selectedUnitId, setSelectedUnitId] = useState(null); // Track the unit being edited
    const imageInputRef = useRef(null); // Add this at the top of your component

    // Fetch units
    const fetchUnits = async () => {
        try {
            const cottageResponse = await api.get("/cottages/");
            setCottages(cottageResponse.data.map(unit => ({ ...unit, type: "Cottage" })));
    
            const lodgeResponse = await api.get("/lodges/");
            setLodges(lodgeResponse.data.map(unit => ({ ...unit, type: "Lodge" })));
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    };
    

    useEffect(() => {
        fetchUnits();
    }, []);

    const handleCustomPriceChange = (index, field, value) => {
        setCustomPrices((prevPrices) =>
            prevPrices.map((price, i) =>
                i === index ? { ...price, [field]: value } : price
            )
        );
    };

    const convertTo12HourFormat = (time) => {
        const [hour, minute] = time.split(":");
        const period = +hour < 12 || +hour === 0 ? "AM" : "PM";
        const adjustedHour = +hour % 12 || 12; // Convert 0 to 12
        return `${adjustedHour}:${minute} ${period}`;
    };
    
    const formatTimeRange = (range) => {
        if (!range || !range.includes("-")) return range; // Return original if not a range
        const [start, end] = range.split("-");
        return `${convertTo12HourFormat(start)} - ${convertTo12HourFormat(end)}`;
    };
    
    const handleUnitTypeChange = (e) => {
        const newUnitType = e.target.value;
        setUnitType(newUnitType);
        setCustomPrices(newUnitType === "Cottage" ? [] : [{ timeRange: "Default", price: "" }]);
    };
    
    const handleDelete = async (unitId, unitType) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this unit?");
        if (!confirmDelete) return;
    
        try {
            const endpoint = `/${unitType.toLowerCase()}/${unitId}/`;
            await api.delete(endpoint);
            alert("Unit deleted successfully");
            fetchUnits(); // Refresh the unit list after deletion
        } catch (error) {
            console.error("Error deleting unit:", error.response?.data || error.message);
            alert("Failed to delete the unit. Please try again.");
        }
    };
    
    const handleAddOrEditUnit = async () => {
        let formattedCustomPrices = {};
    
        if (unitType === "Cottage") {
            formattedCustomPrices = customPrices.reduce((acc, price) => {
                const timeRange = `${price.startTime}-${price.endTime}`;
                acc[timeRange] = price.price;
                return acc;
            }, {});
        } else if (unitType === "Lodge") {
            formattedCustomPrices = customPrices.reduce((acc, price) => {
                acc[`${price.hours} Hours`] = price.price;
                return acc;
            }, {});
        }
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("unit_type", unitType.toLowerCase());
        formData.append("capacity", capacity);
        if (image) formData.append("image", image);
        formData.append("custom_prices", JSON.stringify(formattedCustomPrices));
    
        try {
            const endpoint = selectedUnitId
                ? `/${unitType.toLowerCase()}s/${selectedUnitId}/`
                : "/add-unit/";
            const method = selectedUnitId ? "put" : "post";
    
            const response = await api[method](endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            console.log("Response:", response.data);
            alert(`Unit ${selectedUnitId ? "updated" : "added"} successfully`);
            fetchUnits();
            resetForm();
        } catch (error) {
            console.error(`Error ${selectedUnitId ? "updating" : "adding"} unit:`, error.response?.data || error.message);
            alert(`Failed to ${selectedUnitId ? "update" : "add"} unit. Check console for more details.`);
        }
    };    

    const resetForm = () => {
        setName("");
        setCapacity("");
        setImage(null);
        setCustomPrices([]);
        setSelectedUnitId(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleEdit = (unit) => {
        setSelectedUnitId(unit.id);
        setName(unit.name);
        setCapacity(unit.capacity);
    
        // Infer unit type dynamically
        setUnitType(unit.type.charAt(0).toUpperCase() + unit.type.slice(1));
    
        if (unit.type === "Cottage") {
            setCustomPrices(
                Object.entries(unit.custom_prices || {}).map(([timeRange, price]) => {
                    const [startTime, endTime] = timeRange.split("-");
                    return { startTime, endTime, price };
                })
            );
        } else if (unit.type === "Lodge") {
            setCustomPrices(
                Object.entries(unit.custom_prices || {}).map(([hours, price]) => ({
                    hours: hours.replace(" Hours", ""),
                    price,
                }))
            );
        }
    };
    
    
    return (
        <div className="flex h-screen overflow-hidden dark:bg-[#111827] bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="p-7 flex-1 h-screen overflow-hidden">
                <h2 className="text-4xl font-bold mb-5 dark:text-[#e7e6e6]">{selectedUnitId ? "Edit Unit" : "ADD NEW UNIT"}</h2>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow dark:bg-[#374151] dark:shadow">
                        <div className="mb-4">
                            <label className="block font-medium mb-2 dark:text-[#e7e6e6]">Unit Type</label>
                            <select
                                value={unitType}
                                onChange={handleUnitTypeChange}
                                className="mt-1 p-2 w-full border border-gray-500 rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                            >
                                <option value="Cottage">Cottage</option>
                                <option value="Lodge">Lodge</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-2 dark:text-[#e7e6e6]">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-500 rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-2 dark:text-[#e7e6e6]">Capacity</label>
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-500 rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-2 dark:text-[#e7e6e6]">Image</label>
                            <input
                                type="file"
                                ref={imageInputRef} // Attach the ref here
                                onChange={(e) => setImage(e.target.files[0])}
                                className="mt-1 p-2 w-full border border-gray-500 rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                            />
                        </div>
                        {unitType === "Cottage" && (
    <div className="mb-4">
        <label className="block font-medium mb-2 dark:text-[#e7e6e6]">
            Custom Prices (Start Time, End Time, Price)
        </label>
        {customPrices.map((price, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                    type="time"
                    value={price.startTime}
                    onChange={(e) => handleCustomPriceChange(index, "startTime", e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="time"
                    value={price.endTime}
                    onChange={(e) => handleCustomPriceChange(index, "endTime", e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price.price}
                    onChange={(e) => handleCustomPriceChange(index, "price", e.target.value)}
                    className="p-2 border rounded"
                />
                <button
                    onClick={() => setCustomPrices(customPrices.filter((_, i) => i !== index))}
                    className="text-red-500 font-medium"
                >
                    Remove
                </button>
            </div>
        ))}
        <button
            onClick={() => setCustomPrices([...customPrices, { startTime: "", endTime: "", price: "" }])}
            className="underline text-blue-500"
        >
            Add Time & Price
        </button>
    </div>
)}

{unitType === "Lodge" && (
    <div className="mb-4">
        <label className="block font-medium mb-2 dark:text-[#e7e6e6]">Custom Prices (Hours & Price)</label>
        {customPrices.map((price, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
                {/* Hours Input */}
                <input
                    type="number"
                    placeholder="Hours"
                    value={price.hours}
                    onChange={(e) =>
                        handleCustomPriceChange(index, "hours", e.target.value)
                    }
                    className="p-2 border rounded w-1/2"
                />
                <span className="font-medium text-gray-600 dark:text-[#e7e6e6]">Hours</span>
                
                {/* Price Input */}
                <input
                    type="number"
                    placeholder="Price"
                    value={price.price}
                    onChange={(e) =>
                        handleCustomPriceChange(index, "price", e.target.value)
                    }
                    className="p-2 border rounded w-1/2"
                />

                {/* Remove Button */}
                <button
                    onClick={() =>
                        setCustomPrices(customPrices.filter((_, i) => i !== index))
                    }
                    className="text-red-500 font-medium"
                >
                    Remove
                </button>
            </div>
        ))}
        {/* Add Price Button */}
        <button
            onClick={() =>
                setCustomPrices([...customPrices, { hours: "", price: "" }])
            }
            className="underline text-blue-500"
        >
            Add Hours & Price
        </button>
    </div>
)}

                        <button
                            onClick={handleAddOrEditUnit}
                            className="bg-[#70b8d3] hover:bg-[#62c5e9] text-white px-4 py-2 rounded font-medium"
                        >
                            {selectedUnitId ? "Update Unit" : "Add Unit"}
                        </button>

                        <button
                            onClick={resetForm}
                            className="bg-[#FF6767] hover:bg-[#f35656] text-white px-4 py-2 rounded ml-2 font-medium"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Tables */}
                    <div className="bg-white p-6 rounded-lg shadow dark:bg-[#374151] dark:shadow">
                        <div className="flex space-x-2 mb-4">
                            <button
                                onClick={() => setUnitType("Cottage")}
                                className={`px-4 py-2 rounded font-medium ${
                                    unitType === "Cottage"
                                        ? "bg-[#70b8d3] text-white hover:text-white"
                                        : "bg-gray-200 hover:bg-[#70b8d3] hover:text-white"
                                }`}
                            >
                                Cottage
                            </button>
                            <button
                                onClick={() => setUnitType("Lodge")}
                                className={`px-4 py-2 rounded font-medium ${
                                    unitType === "Lodge"
                                        ? "bg-[#70b8d3] text-white hover:text-white"
                                        : "bg-gray-200 hover:bg-[#70b8d3] hover:text-white"
                                }`}
                            >
                                Lodge
                            </button>
                        </div>

                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead className="bg-gray-100 text-gray-600 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                    <tr>
                                        <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                                        <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider">Capacity</th>
                                        <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider">Time and Prices</th>
                                        <th className="px-5 py-3 border-b text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(unitType === "Cottage" ? cottages : lodges).map((unit) => (
                                        <tr key={unit.id}>
                                            <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">{unit.name}</td>
                                            <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">{unit.capacity}</td>
                                            <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">
                                            {Object.entries(unit.custom_prices || {}).map(([time, price]) => (
                                                <div key={time}>
                                                    {time === "Default" ? `Price: ${price}` : `${formatTimeRange(time)}: ${price}`}
                                                </div>
                                            ))}
                                            </td>

                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm dark:bg-[#66696e]">
                                                <div className="flex space-x-1">
                                                    <button 
                                                        onClick={() => {
                                                            setUnitType(unit.type); // Ensure type is set correctly
                                                            handleEdit(unit);
                                                        }}
                                                        className="bg-[#1089D3] hover:bg-[#3d9fdb] p-3 rounded-full">
                                                        <img src="./src/assets/edit.png" className="w-4 h-4 filter brightness-0 invert" alt="Edit" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(unit.id, unitType)}
                                                        className="bg-[#FF6767] hover:bg-[#f35656] p-3 rounded-full">
                                                            <img src="./src/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
                                                    </button>
                                                </div>
                                            </td>                
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAddUnit;