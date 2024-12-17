import { useState, useEffect } from "react";
import ReceiptModal from "../Modal/ReceiptModal";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../api';

function BillingPage() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({}); // State for account details
    const navigate = useNavigate();
    const location = useLocation();
    const billingData = location.state || {};
    const { customerInfo, units, selectedDate } = location.state || {};

    const totalPrice = units?.reduce((total, unit) => {
        return total + unit.timeAndPrice.reduce((sum, { price }) => sum + parseFloat(price), 0);
    }, 0);

    // Fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await api.get('/customer/details/'); // Fetch user details
                setUserDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const handleSaveReservation = async () => {
        const selectedDateObject = new Date(selectedDate); // Use selectedDate passed from location.state
        const localDate = new Date(selectedDateObject.getTime() - selectedDateObject.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0]; // Format date as YYYY-MM-DD
    
        const reservationData = units.flatMap((unit) =>
            unit.timeAndPrice.map(({ time, price }) => ({
                customer_name: userDetails.username, // Get from userDetails state
                unit_name: unit.name,
                unit_type: unit.type.toLowerCase(), // Include unit type here (e.g., "cottage", "lodge")
                date_of_reservation: localDate, // Send corrected date
                time_of_use: time,
                total_price: price,
            }))
        );
    
        try {
            await Promise.all(
                reservationData.map((data) => api.post("/reservations/", data))
            );
            Swal.fire("Success!", "Reservation saved successfully.", "success");
            navigate("/book");
        } catch (error) {
            console.error("Error saving reservation:", error.response?.data || error.message);
            Swal.fire("Error", "Failed to save reservation.", "error");
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="w-[90%] mx-auto mt-10">
                <h1 className="text-[30px] font-bold uppercase mb-6">Billing Details</h1>
                <div className="mb-4 space-y-2">
                    <h2 className="font-bold text-[20px]">Account Information</h2>
                    <p className="text-md text-gray-700">Name: {userDetails?.username || "N/A"}</p>
                    <p className="text-md text-gray-700">Email: {userDetails?.email || "N/A"}</p>
                    <p className="text-md text-gray-700">Phone: {userDetails?.phone_number || "N/A"}</p>
                    <p>Transaction Date: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="relative overflow-x-auto shadow p-6 rounded-md">
                    <table className="w-full text-sm text-gray-500">
                        <thead className="text-xs uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Name Type</th>
                                <th className="px-6 py-3">Date of Reservation</th>
                                <th className="px-6 py-3">Time of Use</th>
                                <th className="px-6 py-3">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units?.map((unit, index) =>
                                unit.timeAndPrice?.map(({ time, price }, idx) => (
                                    <tr key={`${index}-${idx}`} className="bg-white border-b">
                                        <td className="px-6 py-4 font-medium text-gray-900">{unit.name} ({unit.type})</td>
                                        <td className="px-6 py-4">{selectedDate ? new Date(selectedDate).toLocaleDateString() : "N/A"}</td>
                                        <td className="px-6 py-4">{time}</td>
                                        <td className="px-6 py-4">₱{price}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-gray-700 uppercase">
                                <th className="px-6 py-3 text-base">Total</th>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3">₱{totalPrice.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Save Reservation Button */}
                <div className="mt-6 text-center">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                        onClick={handleSaveReservation}
                    >
                        Save Reservation
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BillingPage;
