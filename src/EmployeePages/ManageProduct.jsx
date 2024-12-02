import { useState } from 'react';
import Sidebar from '../components/EmployeeSidebar';

function ManageProduct() {
    const initialInventory = [
        { id: 1, name: 'Product A', quantity: 100, price: 50, cost: 30 },
        { id: 2, name: 'Product B', quantity: 200, price: 30, cost: 20 },
        { id: 3, name: 'Product C', quantity: 150, price: 20, cost: 10 },
    ];

    const [inventory, setInventory] = useState(initialInventory);
    const [salesInput, setSalesInput] = useState({});
    const [totalProfit, setTotalProfit] = useState(0);
    const [restockInput, setRestockInput] = useState({});
    const [salesHistory, setSalesHistory] = useState([]); // Tracks all sales
    const [recentProducts, setRecentProducts] = useState(initialInventory.slice(0, 3)); // Recently added products

    // Handle input change for sale quantity
    const handleInputChange = (id, value) => {
        setSalesInput(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Function to process sales
    const handleSale = (id) => {
        const quantitySold = parseInt(salesInput[id] || 0, 10);

        if (!quantitySold || quantitySold <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        const soldItem = inventory.find(item => item.id === id);

        if (quantitySold > soldItem.quantity) {
            alert('Cannot sell more than available stock.');
            return;
        }

        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity - quantitySold }
                    : item
            )
        );

        const profit = (soldItem.price - soldItem.cost) * quantitySold;
        setTotalProfit(prevProfit => prevProfit + profit);

        setSalesInput(prevState => ({
            ...prevState,
            [id]: '',
        }));

        // Add to sales history
        setSalesHistory(prevSales => [
            ...prevSales,
            {
                id: prevSales.length + 1,
                name: soldItem.name,
                date: new Date().toLocaleString(),
                totalSale: soldItem.price * quantitySold,
            },
        ]);
    };

    // Handle restocking
    const handleRestock = (id) => {
        const restockQuantity = parseInt(restockInput[id] || 0, 10);

        if (!restockQuantity || restockQuantity <= 0) {
            alert('Please enter a valid restock quantity.');
            return;
        }

        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + restockQuantity }
                    : item
            )
        );

        setRestockInput(prevState => ({
            ...prevState,
            [id]: '',
        }));
    };

    // Reset inventory to initial state
    const handleResetInventory = () => {
        setInventory(initialInventory);
        setTotalProfit(0);
        setSalesInput({});
        setSalesHistory([]);
    };

    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <div className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">MANAGE PRODUCT</h1>

                <div className="flex-col mt-10">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6] dark:placeholder-white"
                            placeholder="Search by name"
                        />
                    </div>

                    {/* Inventory Table */}
                    <div className="rounded-lg">
                        <table className="table-auto border-collapse border border-gray-300 w-full text-left mt-2">
                            <thead>
                                <tr>
                                    <th className="thDesign ">Product Name</th>
                                    <th className="thDesign">Beginning Inventory</th>
                                    <th className="thDesign">Selling Price</th>
                                    <th className="thDesign">Acquisition Cost</th>
                                    <th className="thDesign">Ending Balance</th>
                                    <th className="thDesign">Quantity to Sell</th>
                                    <th className="thDesign">Profit</th>
                                    <th className="thDesign">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {inventory.map(item => (
                                    <tr
                                        key={item.id}
                                        className={item.quantity === 0 ? 'bg-white' : item.quantity < 10 ? 'bg-red-100' : ''}
                                    >
                                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{initialInventory.find(i => i.id === item.id).quantity}</td>
                                        <td className="border border-gray-300 px-4 py-2">${item.price}</td>
                                        <td className="border border-gray-300 px-4 py-2">${item.cost}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.quantity === 0 ? (
                                                <span className="text-gray-500 italic">Out of Stock</span>
                                            ) : (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="border border-gray-400 p-1 w-20"
                                                    value={salesInput[item.id] || ''}
                                                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                />
                                            )}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            ${(item.price - item.cost) * (parseInt(salesInput[item.id] || 0, 10) || 0)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                                            {item.quantity === 0 ? (
                                                <button
                                                    onClick={() => handleRestock(item.id)}
                                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700"
                                                >
                                                    Restock
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleSale(item.id)}
                                                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                                                    >
                                                        Sell
                                                    </button>
                                                    <button
                                                        onClick={() => handleRestock(item.id)}
                                                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700"
                                                    >
                                                        Restock
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Reset and Total Profit */}
                        <div className="mt-4 flex items-center">
                            <h2 className="text-2xl font-semibold mr-4">Total Profit: ${totalProfit.toFixed(2)}</h2>
                            <button
                                onClick={handleResetInventory}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Tempo Reset Inventory
                            </button>
                        </div>
                    </div>

                    {/* Summary Tables */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {/* Highest Selling Products */}
                        <div className="bg-white shadow p-4 rounded-sm">
                            <div className="flex items-center gap-x-2 mb-2">
                                <img src="src/assets/grid.png" alt="" className="w-4 h-4"/>
                                <h2 className="text-xl font-semibold uppercase">Highest Selling Products</h2>
                            </div>
                            <table className="w-full border border-gray-300 text-left">
                                <thead>
                                    <tr>
                                        <th className="thDesign">Title</th>
                                        <th className="thDesign">Total Sold</th>
                                        <th className="thDesign">Total Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(item => (
                                        <tr key={item.id}>
                                            <td className="border px-4 py-2">{item.name}</td>
                                            <td className="border px-4 py-2">
                                                {initialInventory.find(i => i.id === item.id).quantity - item.quantity}
                                            </td>
                                            <td className="border px-4 py-2">{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Latest Sales */}
                        <div className="bg-white shadow p-4 rounded-sm">
                            <div className="flex items-center gap-x-2 mb-2">
                                <img src="src/assets/grid.png" alt="" className="w-4 h-4"/>
                                <h2 className="text-xl font-semibold uppercase">Latest Sales</h2>
                            </div>
                            <table className="w-full border border-gray-300 text-left">
                                <thead>
                                    <tr>
                                        <th className="thDesign">#</th>
                                        <th className="thDesign">Product Name</th>
                                        <th className="thDesign">Date</th>
                                        <th className="thDesign">Total Sale</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesHistory.slice(-5).map(sale => (
                                        <tr key={sale.id}>
                                            <td className="border px-4 py-2">{sale.id}</td>
                                            <td className="border px-4 py-2">{sale.name}</td>
                                            <td className="border px-4 py-2">{sale.date}</td>
                                            <td className="border px-4 py-2">${sale.totalSale}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Recently Added Products */}
                        <div className="bg-white shadow p-4 rounded-sm">
                            <div className="flex items-center gap-x-2 mb-2">
                                <img src="src/assets/grid.png" alt="" className="w-4 h-4"/>
                                <h2 className="text-xl font-semibold uppercase">Recently Added Products</h2>
                            </div>
                            <table className="w-full border border-gray-300 text-left">
                                <thead>
                                    <tr>
                                        <th className="thDesign">Product Name</th>
                                        <th className="thDesign">Acquisition Cost</th>
                                        <th className="thDesign">Price</th>
                                        <th className="thDesign">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProducts.map(product => (
                                        <tr key={product.id}>
                                            <td className="border px-4 py-2">{product.name}</td>
                                            <td className="border px-4 py-2">${product.cost}</td>
                                            <td className="border px-4 py-2">${product.price}</td>
                                            <td className="border px-4 py-2">{product.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageProduct;
