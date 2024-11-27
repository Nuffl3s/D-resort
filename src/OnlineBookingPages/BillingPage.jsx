import { useState, useEffect } from "react";
import ReceiptModal from "../Modal/ReceiptModal";
import Loader from "../components/Loader";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom"; // For navigation

function BillingPage() {
    const [showModal, setShowModal] = useState(false);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    // Temporary data for testing
    const customerName = "John Doe";
    const customerPhone = "+1 (234) 567-890";
    const transactionDate = "Oct 1, 2024";

    const transactions = [
        { name: "Cottage A", date: "Oct 1 - Oct 3", price: 500 },
        { name: "Cottage B", date: "Oct 4 - Oct 7", price: 500 },
        { name: "Cottage C", date: "Oct 8 - Oct 10", price: 600 },
    ];

    const totalPrice = transactions.reduce((total, transaction) => total + transaction.price, 0);

    const handleContinue = () => {
        Swal.fire({
            title: "IMPORTANT!",
            text: "Screenshot or download the receipt first before you continue.",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Close",
            confirmButtonText: "Continue",
            customClass: {
                confirmButton:
                    "bg-[#12B1D1] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#3ebae7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#12B1D1]",
                cancelButton:
                    "bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
                actions: "flex justify-center gap-4", // Adds space between the buttons
            },
            buttonsStyling: false, // Disable SweetAlert2's default button styles
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/booking"); // Navigate to booking main page
            }
        });
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
                <h1 className="text-[30px] font-bold uppercase mb-6">Billing Details</h1>
                <div className="mb-4 space-y-2">
                    <h2 className="font-bold text-[20px]">Customer Information</h2>
                    <p className="text-md text-gray-700">Name: {customerName}</p>
                    <p className="text-md text-gray-700">Phone: {customerPhone}</p>
                    <p className="text-md text-gray-700">Transaction Date: {transactionDate}</p>
                </div>

                <div className="relative overflow-x-auto shadow p-6 rounded-md">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name type</th>
                                <th scope="col" className="px-6 py-3">DATE OF USE</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index} className="bg-white border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {transaction.name}
                                    </th>
                                    <td className="px-6 py-4">{transaction.date}</td>
                                    <td className="px-6 py-4">${transaction.price}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-gray-700 uppercase">
                                <th scope="row" className="px-6 py-3 text-base">Total</th>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3">${totalPrice}</td>
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
                note={note}
                setNote={setNote}
            />
        </div>
    );
}

export default BillingPage;
