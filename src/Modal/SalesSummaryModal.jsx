import { Bar, Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const SalesSummaryModal = ({ isOpen, onClose, products }) => {
  if (!isOpen) return null;

  // Prepare data for Bar Chart (Total sales per product)
  const productNames = products.map(product => product.name);
  const quantities = products.map(product => product.quantity);
  const amounts = products.map(product => product.quantity * product.avgPrice);

  const barChartData = {
    labels: productNames,
    datasets: [
      {
        label: 'Quantity Sold',
        data: quantities,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color for Quantity
      },
      {
        label: 'Total Amount',
        data: amounts,
        backgroundColor: 'rgba(153, 102, 255, 0.6)', // Bar color for Amount
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  // Prepare data for Line Chart (Sales trend over time)
  const dates = [...new Set(products.map(product => product.date_added))]; // Unique dates
  const salesPerDate = dates.map(date => {
    return products
      .filter(product => product.date_added === date)
      .reduce((total, product) => total + product.quantity * product.avgPrice, 0);
  });

  const lineChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Sales Amount',
        data: salesPerDate,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        tension: 0.1, // Line smoothness
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `Sales: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-[#2d3748] p-6 rounded-lg w-[90%] max-h-[100%] overflow-y-auto flex-col">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#e7e6e6]">Sales Summary</h2>
                <button
                    onClick={onClose}
                    className="text-xl font-semibold text-red-500 hover:text-red-700"
                >
                    <img
                    src="src/assets/close.png" // Replace with the correct path to your image
                    alt="Close"
                    className="w-5 h-5" // Adjust size as necessary
                    />
                </button>
            </div>

            {/* Sales Table on the Left */}
            <div className="w-full flex justify-between items-start">
                {/* Sales Table */}
                <div className="w-2/3 mr-8">
                    {/* Table Wrapper with Scroll */}
                    <div className="max-h-[800px] overflow-y-auto"> {/* Adjust max-height as needed */}
                        <table className="min-w-full shadow rounded-lg border-collapse">
                            <thead className="sticky text-gray-800 top-0 bg-gray-200 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                <tr className="text-center">
                                    <th className="px-5 py-3 text-sm font-bold uppercase tracking-wider text-start">Product Name</th>
                                    <th className="px-5 py-3 text-sm font-bold uppercase tracking-wider text-start">Date</th>
                                    <th className="px-5 py-3 text-sm font-bold uppercase tracking-wider text-start">Quantity</th>
                                    <th className="px-5 py-3 text-sm font-bold uppercase tracking-wider text-start">Price</th>
                                    <th className="px-5 py-3 text-sm font-bold uppercase tracking-wider text-start">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="dark:text-[#e7e6e6]">
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                <tr key={index}>
                                    <td className="px-5 py-5 border-b border-gray-200 text-start">{product.name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-start">{product.date_added}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-start">{product.quantity}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-start">${product.avgPrice}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-start">${(product.quantity * product.avgPrice).toFixed(2)}</td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                <td colSpan="5" className="px-5 py-5 text-center">No Products Available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="flex flex-col w-[800px]">
                    {/* Bar Chart for Sales Data */}
                    <div className="mb-8 shadow-md p-3">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-[#e7e6e6] mb-4">Sales Overview</h3>
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>

                    {/* Line Chart for Sales Trend Over Time */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-[#e7e6e6] mb-4">Sales Trend Over Time</h3>
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// Prop Types for validation
SalesSummaryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      date_added: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      avgPrice: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SalesSummaryModal;
