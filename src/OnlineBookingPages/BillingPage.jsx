import { useState, useEffect } from "react";
import ReceiptModal from "../Modal/ReceiptModal";
import Loader from "../components/Loader";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate, useLocation } from "react-router-dom"; // For navigation
import api from '../api';


function BillingPage() {
    const [showModal, setShowModal] = useState(false);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation
    const location = useLocation();
    const billingData = location.state || {};

    const { customerInfo, units, selectedDate } = location.state || {};


    // Temporary data for testing
    const customerName = "John Doe";
    const customerPhone = "+1 (234) 567-890";
    const transactionDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const transactions = [
        { name: "Cottage A", date: "Oct 1 - Oct 3", price: 500 },
        { name: "Cottage B", date: "Oct 4 - Oct 7", price: 500 },
        { name: "Cottage C", date: "Oct 8 - Oct 10", price: 600 },
    ];

    const totalPrice = units?.reduce((total, unit) => {
        return total + unit.timeAndPrice.reduce((sum, { price }) => sum + parseFloat(price), 0);
    }, 0);

    const handleContinue = async () => {
        // Swal.fire({
        //     title: "IMPORTANT!",
        //     text: "Screenshot or download the receipt first before you continue.",
        //     icon: "warning",
        //     showCancelButton: true,
        //     cancelButtonText: "Close",
        //     confirmButtonText: "Continue",
        //     customClass: {
        //         confirmButton:
        //             "bg-[#12B1D1] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#3ebae7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#12B1D1]",
        //         cancelButton:
        //             "bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
        //         actions: "flex justify-center gap-4", // Adds space between the buttons
        //     },
        //     buttonsStyling: false, // Disable SweetAlert2's default button styles
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         navigate("/booking"); // Navigate to booking main page
        //     }
        // });
        const reservationData = billingData.units.map((unit) => ({
            customer_name: `${billingData.customerInfo.firstName} ${billingData.customerInfo.lastName}`,
            customer_email: billingData.customerInfo.email,
            customer_mobile: billingData.customerInfo.mobile,
            unit_type: unit.type,
            unit_name: unit.name,
            transaction_date: new Date().toISOString().split('T')[0],
            date_of_reservation: new Date(selectedDate).toISOString().split('T')[0],
            time_of_use: unit.timeAndPrice.map(({ time }) => time).join(', '),
            total_price: unit.timeAndPrice.reduce((sum, { price }) => sum + parseFloat(price), 0),
            content_type: unit.type.toLowerCase() === "cottage" ? "cottage" : "lodge",
            object_id: unit.id, // Pass the ID of the unit
        }));
    
        console.log("Sending reservation data:", reservationData);
    
        try {
            const response = await Promise.all(
                reservationData.map((data) => api.post("/reservations/", data))
            );
            console.log("Reservation saved successfully:", response);
            Swal.fire({
                title: "Success!",
                text: "Your reservation has been saved successfully.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/book");
            });
        } catch (error) {
            console.error("Error saving reservation:", error.response?.data || error.message);
            Swal.fire({
                title: "Error",
                text: error.response?.data || "There was a problem saving your reservation. Please try again.",
                icon: "error",
                confirmButtonText: "Close",
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="w-[90%] mx-auto mt-10">
                <h1 className="text-[30px] font-bold uppercase mb-6">Details</h1>
                <div className="mb-4 space-y-2">
                    <h2 className="font-bold text-[20px]">Customer Information</h2>
                    <p className="text-md text-gray-700">Name: {customerInfo?.firstName}{customerInfo?.lastName}</p>
                    <p className="text-md text-gray-700">Email Address: {customerInfo?.email}</p>
                    <p className="text-md text-gray-700">Phone: {customerInfo?.mobile}</p>
                    <p>Transaction Date: {new Date().toLocaleDateString()}</p>
                    <p>Selected Date: {selectedDate ? new Date(selectedDate).toLocaleDateString() : "Not selected"}</p>
                </div>

                <div className="relative overflow-x-auto shadow p-6 rounded-md">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name Type</th>
                                <th scope="col" className="px-6 py-3">Date of Reservation</th>
                                <th scope="col" className="px-6 py-3">Time of Use</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units?.length > 0 ? (
                                units.map((unit, index) =>
                                    unit.timeAndPrice?.length > 0 ? (
                                        unit.timeAndPrice.map(({ time, price }, idx) => (
                                            <tr key={`${index}-${idx}`} className="bg-white border-b">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {unit.name} ({unit.type})
                                                </td>
                                                <td className="px-6 py-4">
                                                <td>{selectedDate ? new Date(selectedDate).toLocaleDateString() : "N/A"}</td>
                                                </td>
                                                <td className="px-6 py-4">{time}</td> {/* Display time */}
                                                <td className="px-6 py-4">₱{price}</td> {/* Display price */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr key={index}>
                                            <td colSpan="3" className="px-6 py-4 text-center">
                                                No prices available for {unit.name} ({unit.type})
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center">No units selected.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-gray-700 uppercase">
                                <th scope="row" className="px-6 py-3 text-base">Total</th>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3">₱{totalPrice.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="w-full flex flex-col justify-center items-center mt-10">
                    <div className="w-[500px] text-center space-y-5 text-con">
                        <p>For online payment transactions, please call 0917 708 4368. We only accept GCASH payments through this number.</p>
                        <p>For walk-in payments, please download the receipt below to serve as proof of your booking for this property.</p>

                        <div className="flex justify-center">
                            <button
                                className="text-[#31BEFF] font-semibold flex items-center hover:underline"
                                onClick={() => setShowModal(true)}
                            >
                                Get Receipt
                                <span>
                                    <img src="./src/assets/receipt.png" alt="" className="w-5 h-5 ml-1" />
                                </span>
                            </button>
                        </div>
                    </div>
                    <button 
                        className="mt-10 px-4 py-2 bg-[#12B1D1] hover:bg-[#3ebae7] text-white font-semibold rounded-md"
                        onClick={handleContinue}
                    >
                        Continue
                    </button>
                </div>
            </div>

            <ReceiptModal
                showModal={showModal}
                setShowModal={setShowModal}
                transactions={transactions}
                customerName={customerName}
                transactionDate={transactionDate}
                totalPrice={totalPrice}
                customerInfo={customerInfo} // Pass customer info
                units={units} // Pass selected units
                selectedDate={selectedDate} // Pass the selected date
            />
        </div>
    );
}

export default BillingPage;
