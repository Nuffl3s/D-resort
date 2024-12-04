import React, { useState, useEffect } from "react";
import api from "../api";

const AdminAddUnit = () => {
  const [unitType, setUnitType] = useState("Cottage");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState(null);
  const [customPrices, setCustomPrices] = useState([{ timeRange: "", price: "" }]);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [cottages, setCottages] = useState([]);
  const [lodges, setLodges] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cottageResponse = await api.get("/cottages/");
      const lodgeResponse = await api.get("/lodges/");
      setCottages(cottageResponse.data);
      setLodges(lodgeResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const resetForm = () => {
    setUnitType("Cottage");
    setName("");
    setCapacity("");
    setImage(null);
    setCustomPrices([{ timeRange: "", price: "" }]);
    setSelectedUnitId(null);
  };

  const handleAddUnit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("unit_type", unitType.toLowerCase());
      formData.append("capacity", capacity);
      formData.append("custom_prices", JSON.stringify(customPrices));
      if (image) formData.append("image", image);

      const response = selectedUnitId
        ? await api.put(
            `/${unitType.toLowerCase()}/${selectedUnitId}/`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
        : await api.post("/add-unit/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      console.log("Unit saved successfully:", response.data);
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error adding/editing unit:", error.response?.data || error.message);
    }
  };

  const handleSelectUnitForEdit = (unit, isLodge) => {
    setSelectedUnitId(unit.id);
    setUnitType(isLodge ? "Lodge" : "Cottage");
    setName(unit.name);
    setCapacity(unit.capacity);
    setCustomPrices(
      Object.entries(unit.custom_prices || {}).map(([timeRange, price]) => ({
        timeRange,
        price,
      }))
    );
    setImage(null);
  };

  const addCustomPrice = () => {
    setCustomPrices([...customPrices, { timeRange: "", price: "" }]);
  };

  const updateCustomPrice = (index, field, value) => {
    const updatedPrices = [...customPrices];
    updatedPrices[index][field] = value;
    setCustomPrices(updatedPrices);
  };

  const removeCustomPrice = (index) => {
    setCustomPrices(customPrices.filter((_, i) => i !== index));
  };

  const toggleUnitType = (type) => {
    setUnitType(type);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Unit</h1>
      <div className="mb-4">
        <label>Unit Type</label>
        <select
          className="border p-2 w-full"
          value={unitType}
          onChange={(e) => setUnitType(e.target.value)}
        >
          <option value="Cottage">Cottage</option>
          <option value="Lodge">Lodge</option>
        </select>
      </div>
      <div className="mb-4">
        <label>Name</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label>Capacity</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label>Image</label>
        <input
          type="file"
          className="border p-2 w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <div className="mb-4">
        <label>Custom Prices</label>
        {customPrices.map((price, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Time Range"
              className="border p-2 mr-2"
              value={price.timeRange}
              onChange={(e) => updateCustomPrice(index, "timeRange", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="border p-2 mr-2"
              value={price.price}
              onChange={(e) => updateCustomPrice(index, "price", e.target.value)}
            />
            <button
              onClick={() => removeCustomPrice(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={addCustomPrice} className="text-blue-500">
          Add Price
        </button>
      </div>
      <button onClick={handleAddUnit} className="bg-blue-500 text-white p-2">
        {selectedUnitId ? "Edit Unit" : "Add Unit"}
      </button>

      <div className="flex mt-8">
        <button
          onClick={() => toggleUnitType("Cottage")}
          className={`p-2 ${unitType === "Cottage" ? "bg-blue-500 text-white" : ""}`}
        >
          Cottage
        </button>
        <button
          onClick={() => toggleUnitType("Lodge")}
          className={`p-2 ${unitType === "Lodge" ? "bg-blue-500 text-white" : ""}`}
        >
          Lodge
        </button>
      </div>

      <div className="mt-4">
        {unitType === "Cottage" && (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cottages.map((cottage) => (
                <tr key={cottage.id}>
                  <td>{cottage.name}</td>
                  <td>{cottage.capacity}</td>
                  <td>
                    <button
                      onClick={() => handleSelectUnitForEdit(cottage, false)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {unitType === "Lodge" && (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lodges.map((lodge) => (
                <tr key={lodge.id}>
                  <td>{lodge.name}</td>
                  <td>{lodge.capacity}</td>
                  <td>
                    <button
                      onClick={() => handleSelectUnitForEdit(lodge, true)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAddUnit;
