import React from "react";
import PropTypes from "prop-types";

const ViewModal = ({ isOpen, onClose, booking }) => {
    if (!isOpen || !booking) return null;

    const unitDetails = booking?.unit_details ?? {};
    const image = unitDetails.image
        ? `http://localhost:8000${unitDetails.image}` // Ensure correct URL prefix
        : "/static/default-image.jpg";
    const capacity = unitDetails.capacity || "N/A";
    const prices = unitDetails.custom_prices
        ? Object.entries(unitDetails.custom_prices)
              .map(([key, value]) => `${key}: ₱${value}`)
              .join(", ")
        : "No pricing details available";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-5">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">Reservation Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        Close
                    </button>
                </div>

                {/* Image */}
                <div className="mt-4">
                    <img
                        src={image}
                        alt="Property"
                        className="w-full h-[300px] object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = "/static/default-image.jpg"; // Fallback image
                        }}
                    />
                </div>

                {/* Property Details */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">{booking.unit_name || "No Unit Name"}</h3>
                    <p className="text-gray-600"><strong>Capacity:</strong> {capacity}</p>
                    <p className="text-gray-600"><strong>Prices:</strong> {prices}</p>
                </div>

                {/* Customer Details */}
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Customer Information</h4>
                    <table className="min-w-full bg-white border">
                        <tbody>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Name</th>
                                <td className="px-4 py-2 text-gray-600">{booking.customer_name || "N/A"}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Email</th>
                                <td className="px-4 py-2 text-gray-600">{booking.customer_email || "N/A"}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Phone</th>
                                <td className="px-4 py-2 text-gray-600">{booking.customer_mobile || "N/A"}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Date of Reservation</th>
                                <td className="px-4 py-2 text-gray-600">{booking.date_of_reservation || "N/A"}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Time of Use</th>
                                <td className="px-4 py-2 text-gray-600">{booking.time_of_use || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Close Button */}
                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

ViewModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    booking: PropTypes.shape({
        unit_name: PropTypes.string,
        unit_details: PropTypes.shape({
            image: PropTypes.string,
            capacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            custom_prices: PropTypes.object,
        }),
        customer_name: PropTypes.string,
        customer_email: PropTypes.string,
        customer_mobile: PropTypes.string,
        date_of_reservation: PropTypes.string,
        time_of_use: PropTypes.string,
    }).isRequired,
};

export default ViewModal;
