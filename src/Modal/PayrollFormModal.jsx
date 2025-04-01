import PropTypes from "prop-types"; // Import PropTypes

const PayrollFormModal = ({ isOpen, onClose, payroll }) => {
    if (!isOpen) return null; // Only render if the modal is open

    // Function to print the payslip
    const printPayslip = () => {
        // eslint-disable-next-line no-unused-vars
        const printContent = document.getElementById("payslip-content").innerHTML;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; }
                    h2 { text-align: center; font-size: 24px; font-weight: bold; }
                    .info { margin: 15px 0; }
                    .info span { font-weight: bold; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    .table td { padding: 8px; border: 1px solid #ddd; }
                    .table th { padding: 8px; text-align: left; background-color: #f4f4f4; }
                    .footer { text-align: right; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Payroll Slip for ${payroll.name}</h2>
                    <div class="info">
                        <div><span>Employee Name:</span> ${payroll.name}</div>
                        <div><span>Employee ID:</span> ${payroll.employee_id || "N/A"}</div>
                    </div>
                    <table class="table">
                        <tr>
                            <td><strong>Total Hours:</strong></td>
                            <td>${payroll.total_hours || 0}</td>
                        </tr>
                        <tr>
                            <td><strong>Rate:</strong></td>
                            <td>$${payroll.rate || 0}</td>
                        </tr>
                        <tr>
                            <td><strong>Deductions:</strong></td>
                            <td>-${payroll.deductions || 0}</td>
                        </tr>
                        <tr>
                            <td><strong>Net Pay:</strong></td>
                            <td><strong>$${payroll.net_pay || 0}</strong></td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[40%] dark:bg-[#374151] dark:text-[#e7e6e6]">
                {/* Modal Header */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">Payroll Slip</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Employee Details for {payroll.name}</p>
                </div>

                {/* Payroll Information - Structured like a standard payslip */}
                <div id="payslip-content" className="space-y-4">
                    {/* Employee Information */}
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Employee Name:</span>
                            <span className="text-sm font-medium">{payroll.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Employee ID:</span>
                            <span className="text-sm">{payroll.employee_id || "N/A"}</span>
                        </div>
                    </div>

                    {/* Payroll Details */}
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Total Hours:</span>
                            <span className="text-sm">{payroll.total_hours || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Rate:</span>
                            <span className="text-sm">${payroll.rate || 0}</span>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Deductions:</span>
                            <span className="text-sm">-${payroll.deductions || 0}</span>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="grid grid-cols-2 gap-x-4 border-t border-gray-300 pt-4">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Net Pay:</span>
                            <span className="text-lg font-semibold">{payroll.net_pay || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Footer - Close Button */}
                <div className="flex justify-end mt-6 items-center gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                        Close
                    </button>

                     {/* Print Button Image */}
                    <div
                        className="bg-white px-4 py-2 rounded-md border cursor-pointer flex items-center gap-1"
                        onClick={printPayslip}
                        >
                            <img 
                            src="src/assets/printer.png" // Replace this with the path to your print icon
                            alt="Print Payslip"
                            className="w-4 h-4"
                        />
                        Print
                    </div>
                </div>
            </div>
        </div>
    );
};

// Define PropTypes
PayrollFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // isOpen must be a boolean and is required
    onClose: PropTypes.func.isRequired, // onClose must be a function and is required
    payroll: PropTypes.shape({
        name: PropTypes.string.isRequired,
        employee_id: PropTypes.string,
        total_hours: PropTypes.number,
        rate: PropTypes.number,
        deductions: PropTypes.number,
        net_pay: PropTypes.number
    }).isRequired, // payroll should be an object with the given properties
};

export default PayrollFormModal;
