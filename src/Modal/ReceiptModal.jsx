import PropTypes from 'prop-types';
import html2pdf from "html2pdf.js";


function ReceiptModal({ 
    showModal, 
    setShowModal, 
    transactions, 
    customerName, 
    transactionDate, 
    totalPrice, 
    customerInfo, 
    units, 
    selectedDate // Include the selected date
}) {
    
    // Function to print receipt
    const handlePrint = () => {
        window.print();
    };

    // Function to download receipt as PDF
    const handleDownloadPDF = () => {
        const element = document.getElementById("receipt-content");
        const options = {
            margin: 0.3,
            filename: "receipt.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        };
        html2pdf().from(element).set(options).save();
    };

    if (!showModal) return null; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-lg w-[80%] max-w-[700px] h-[800px]">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-bold">Receipt</h2>
                </div>
                <div className="mt-4" id="receipt-content">
                    {/* Receipt details */}
                    <div className="flex justify-between">
                        <div>
                            <h3 className="font-bold mb-2">D.Yasay Beach Resort</h3>
                            <p>Misamis Oriental Zone 2 Tabic, D. Yasay Beach Resort</p>
                            <p>Phone: {customerInfo.mobile}</p>
                            <p>Email: {customerInfo.email}</p>
                        </div>
                        <div>
                            <p>Date: {transactionDate}</p>
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <div>
                            <p className="font-bold">To:</p>
                            <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                        </div>
                        {/* <div>
                            <p>Confirmation ID: ZXC7HWC3</p>
                            <p>Date of Use: {selectedDate ? new Date(selectedDate).toLocaleDateString() : "N/A"}</p>
                        </div> */}
                    </div>

                    <table className="w-full mt-6 text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Name Type</th>
                                <th className="px-6 py-3">Time of use</th>
                                <th className="px-6 py-3 text-right">Price</th>
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
                                                <td className="px-6 py-4">{time}</td>
                                                <td className="px-6 py-4 text-right">₱{price}</td>
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
                            <tr className="font-bold">
                                <td className="p-2 text-right" colSpan="2">Total</td>
                                <td className="p-2 text-right">${totalPrice}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="mt-6 h-[60px]">
                        <p><span className="font-bold">Note:</span> This computer generated receipt does not require physical signature.</p>
                    </div>
                </div>

                <div className="mt-16 flex justify-center space-x-1">
                    <button onClick={handlePrint} className="px-4 py-2 border border-gray-400 rounded-md flex items-center hide-on-print"> 
                        <img src="./src/assets/printer.png" alt="" className="w-5 h-5 mr-2"
                        />Print</button>
                    <button onClick={handleDownloadPDF} className="px-4 py-2 border border-gray-400 rounded-md flex items-center hide-on-print">
                        <img src="./src/assets/download.png" alt="" className="w-5 h-5 mr-2"
                        />Download as PDF</button>
                </div>

                <div className="flex w-full justify-end mt-20 hide-on-print">
                    <button onClick={() => setShowModal(false)} className="text-white font-semibold bg-[#FF6767] hover:bg-[#f35656] p-2 px-4 rounded shadow">Close</button>
                </div>
            </div>
        </div>
    );
}

// Define prop types
ReceiptModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    setShowModal: PropTypes.func.isRequired,
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
        })
    ).isRequired,
    customerInfo: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        mobile: PropTypes.string.isRequired,
    }).isRequired,
    units: PropTypes.array.isRequired,
    
};

export default ReceiptModal;
