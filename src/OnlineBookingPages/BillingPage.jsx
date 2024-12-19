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
        // Use billingData.selectedDates for multi-date selection; fallback to selectedDate
        const selectedDates = billingData.selectedDates || [selectedDate]; 
    
        if (!selectedDates || selectedDates.length === 0) {
            Swal.fire("Error", "No selected dates available.", "error");
            return;
        }
    
        // Generate reservation data for all selected dates
        const reservationData = selectedDates.flatMap((date) =>
            units.flatMap((unit) =>
                unit.timeAndPrice.map(({ time, price }) => {
                    const unitType = unit.unit_type || unit.type || "cottage";
    
                    return {
                        customer_name: userDetails.username || "Anonymous",
                        unit_name: unit.name,
                        unit_type: unitType,
                        date_of_reservation: date, // Use valid selected date
                        time_of_use: time,
                        total_price: price,
                    };
                })
            )
        );
    
        console.log("Reservation Data Sent:", reservationData); // Debugging log
    
        try {
            // Send each reservation entry to the server
            await Promise.all(
                reservationData.map((data) => api.post("/reservations/", data))
            );
            Swal.fire("Success!", "Reservation saved successfully.", "success");
            navigate("/book"); // Navigate to booking page after success
        } catch (error) {
            console.error("Error saving reservation:", error.response?.data || error.message);
            Swal.fire("Error", "Failed to save reservation. Please try again.", "error");
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
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
                                        <td className="px-6 py-4">
                                            {billingData.selectedDates
                                                ? billingData.selectedDates.join(", ")
                                                : "N/A"}
                                        </td>
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
