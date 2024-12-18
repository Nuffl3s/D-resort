/* eslint-disable react/prop-types */
const DeductionModal = ({ isOpen, data, onChange, onClose, onSave }) => {
    if (!isOpen) return null;

    const handleDescriptionChange = (e) => {
        onChange('descriptions', e.target.value);
    };

    const handleAmountChange = (e) => {
        onChange('amount', e.target.value);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-[30%]">
                <h2 className="text-xl font-bold mb-4 uppercase">Edit Deductions</h2>
                <h2 className="text-sm mb-4">Name:</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={data.descriptions || ""}  // Ensure correct field name
                        onChange={handleDescriptionChange}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter description"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={data.amount || ""}  // Ensure correct field name
                        onChange={handleAmountChange}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter amount"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-[#FF6767] hover:bg-[#f35656] text-white px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-[#70b8d3] hover:bg-[#3d9fdb] text-white px-4 py-2 rounded-md"
                        onClick={onSave}  // Ensure save is properly wired
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeductionModal;
