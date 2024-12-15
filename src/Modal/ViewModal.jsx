import PropTypes from "prop-types";

const ViewModal = ({ isOpen, onClose, booking }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">Booking Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Property Image */}
                <div className="mt-4">
                    <img
                        src={booking.image}
                        alt={booking.propertyName}
                        className="w-full h-[400px] object-cover rounded-lg"
                    />
                </div>

                {/* Property Information */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">{booking.propertyName}</h3>
                    <p className="text-gray-600">{booking.capacity}</p>
                    <p className="text-gray-600">{booking.price}</p>
                </div>

                {/* Customer Information */}
                <div className="mt-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">Customer Information</h4>
                    <table className="min-w-full bg-white border">
                        <tbody>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Name</th>
                                <td className="px-4 py-2 text-gray-600">{booking.customer.name}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Email</th>
                                <td className="px-4 py-2 text-gray-600">{booking.customer.email}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Phone</th>
                                <td className="px-4 py-2 text-gray-600">{booking.customer.phone}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Date of Reservation</th>
                                <td className="px-4 py-2 text-gray-600">{booking.customer.checkIn}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="bg-blue-500 text-blue-50 text-left px-4 py-2 font-semibold">Time of Use</th>
                                <td className="px-4 py-2 text-gray-600">{booking.customer.checkOut}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
        image: PropTypes.string.isRequired,
        propertyName: PropTypes.string.isRequired,
        capacity: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        customer: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            phone: PropTypes.string.isRequired,
            checkIn: PropTypes.string.isRequired,
            checkOut: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default ViewModal;
