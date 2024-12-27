import { useState, useEffect } from "react";
import ReceiptModal from "../Modal/ReceiptModal";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../api';
import Header from "../components/Header";

function BillingPage() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({}); // State for account details
    const navigate = useNavigate();
    const location = useLocation();
    const billingData = location.state || {};
    const { customerInfo = {}, units = [], selectedDate = null } = location.state || {};

    const totalPrice = units?.reduce((total, unit) => {
        const unitTotal = unit.timeAndPrice?.reduce(
            (sum, { price }) => sum + parseFloat(price || 0),
            0
        ) || 0;
        return total + unitTotal;
    }, 0) || 0;

    // Fetch user detail
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
        const selectedDates = billingData.selectedDates || [selectedDate];
    
        if (!selectedDates.length) {
            Swal.fire("Error", "No selected dates available.", "error");
            return;
        }
    
        const reservationData = {
            unit_name: units[0]?.name || "N/A",
            unit_type: units[0]?.unit_type || "Cottage",
            date_range: selectedDates, // Group multiple dates
            time_of_use: units[0]?.timeAndPrice[0]?.time || "N/A",
            total_price: totalPrice,
        };
        console.log("Reservation Data Sent:", reservationData);
    
        try {
            const response = await api.post("/reservations/", reservationData);
            Swal.fire("Success!", "Reservation saved successfully.", "success");
            navigate("/book");
        } catch (error) {
            console.error("Error saving reservation:", error);
            Swal.fire("Error", "Failed to save reservation. Please try again.", "error");
        }
    };    

    
    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="w-[90%] mx-auto mt-10 bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Billing Details</h1>

                {/* Account Information */}
                <div className="mb-6 border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Account Information</h2>
                    <p className="text-md text-gray-600">Name: {userDetails?.username || "N/A"}</p>
                    <p className="text-md text-gray-600">Email: {userDetails?.email || "N/A"}</p>
                    <p className="text-md text-gray-600">Phone: {userDetails?.phone_number || "N/A"}</p>
                    <p className="text-md text-gray-600">Transaction Date: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Billing Information Table */}
                <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 mb-6">
                    <table className="w-full text-sm text-gray-600">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-3 text-left">Unit Name</th>
                                <th className="px-6 py-3 text-left">Reservation Date</th>
                                <th className="px-6 py-3 text-left">Time of Use</th>
                                <th className="px-6 py-3 text-left">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units?.map((unit, index) =>
                                unit.timeAndPrice?.map(({ time, price }, idx) => (
                                    <tr key={`${index}-${idx}`} className="border-b">
                                        <td className="px-6 py-4 text-gray-700">{unit.name} ({unit.type})</td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {billingData.selectedDates
                                                ? billingData.selectedDates.join(", ")
                                                : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{time}</td>
                                        <td className="px-6 py-4 text-gray-700">₱{price}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-gray-700 bg-gray-100">
                                <td className="px-6 py-3 text-base">Total</td>
                                <td colSpan="2" className="px-6 py-3 text-right"></td>
                                <td className="px-6 py-3 text-right">₱{totalPrice.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Save Reservation Button */}
                <div className="text-center">
                    <button
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
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
