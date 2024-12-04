import React, { useState, useEffect } from "react";
import api from "../api"; // Adjust the path to your API utility
import AdminSidebar from '../components/AdminSidebar';

const AdminAddUnit = () => {
  const [unitType, setUnitType] = useState("cottage"); // Default to cottage
  const [unitList, setUnitList] = useState([]); // Stores fetched cottages or lodges
  const [timeSlots, setTimeSlots] = useState([]); // Time slots for cottages or lodges
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    type: unitType,
    custom_prices: [],
    image: null,
  });
  const [editMode, setEditMode] = useState(false); // Track if editing a unit
  const [editId, setEditId] = useState(null); // ID of the unit being edited

  // Fetch units and time slots based on type (cottage or lodge)
  useEffect(() => {
    fetchUnits();
  }, [unitType]);

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

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("capacity", formData.capacity);
    data.append("type", unitType); // Ensure type is included
    data.append("custom_prices", JSON.stringify(formData.custom_prices));
    if (formData.image) {
        data.append("image", formData.image);
    }

    try {
        if (editMode) {
            // Edit existing unit
            const endpoint = unitType === "cottage" ? `/cottages/${editId}/` : `/lodges/${editId}/`;
            await api.put(endpoint, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Unit updated successfully!");
        } else {
            // Add new unit
            await api.post("/api/add-unit/", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Unit added successfully!");
        }

        setEditMode(false);
        setEditId(null);
        setFormData({
            name: "",
            capacity: "",
            type: unitType,
            custom_prices: [],
            image: null,
        });
        fetchUnits(); // Refresh the unit list
    } catch (error) {
        console.error("Error saving unit:", error.response?.data || error.message);
        alert("An error occurred while saving the unit.");
    }
};

  // Handle Edit
  const handleEdit = (unit) => {
    setEditMode(true);
    setEditId(unit.id);
    setFormData({
      name: unit.name,
      capacity: unit.capacity,
      type: unit.type,
      custom_prices: unit.custom_prices || [],
      image: null, // Do not prepopulate the image
    });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const endpoint = unitType === "cottage" ? `/cottages/${id}/` : `/lodges/${id}/`;
      await api.delete(endpoint);
      alert("Unit deleted successfully!");
      fetchUnits(); // Refresh the unit list
    } catch (error) {
      console.error("Error deleting unit:", error.response?.data || error.message);
      alert("An error occurred while deleting the unit.");
    }
  };

  return (
    <div className="flex gap-4">
        <AdminSidebar />
      {/* Add/Edit Unit Form */}
      <div className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">{editMode ? "Edit Unit" : "Add New Unit"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Unit Type</label>
            <select
              name="type"
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              disabled={editMode} // Prevent changing type during edit
            >
              <option value="cottage">Cottage</option>
              <option value="lodge">Lodge</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className={`${
              editMode ? "bg-yellow-500" : "bg-blue-500"
            } text-white px-4 py-2 rounded`}
          >
            {editMode ? "Update Unit" : "Add Unit"}
          </button>
        </form>
      </div>

      {/* Unit List */}
      <div className="w-1/2">
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
              <th className="border border-gray-300 px-4 py-2">Actions</th>
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
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(row)}
                    className="text-yellow-500 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAddUnit;
