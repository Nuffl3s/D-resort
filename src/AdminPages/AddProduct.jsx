import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/AdminSidebar';
import api from '../api';
import Swal from 'sweetalert2';

function AddProduct() {
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({});
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [avgPrice, setAvgPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [initialInventory, setInitialInventory] = useState([]);
    const [salesHistory] = useState([]);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);


    const productsPerPage = 7;
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target) && 
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeleteProduct = (id) => {
        const filteredProducts = products.filter(product => product.id !== id);
        setProducts(filteredProducts.map((product, index) => ({
            ...product,
            id: index + 1
        })));
    };

    const handleEditClick = (product) => {
        setEditProductId(product.id);
        setEditedProduct({ ...product });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prevState => {
            const updatedProduct = { ...prevState, [name]: value };
            if (name === 'quantity' || name === 'avgPrice') {
                const quantity = parseFloat(updatedProduct.quantity) || 0;
                const avgPrice = parseFloat(updatedProduct.avgPrice) || 0;
                updatedProduct.amount = (quantity * avgPrice).toFixed(2);
            }
            return updatedProduct;
        });
    };
    

    const handleSaveClick = () => {
        setProducts(products.map(product =>
            product.id === editProductId ? editedProduct : product
        ));
        setEditProductId(null);
    };

    const addProduct = (newProduct) => {
        setProducts((prevProducts) => [
            ...prevProducts,
            { ...newProduct, id: prevProducts.length + 1 }
        ]);
    };

    const handleQuantityChange = (e) => {
        const qty = e.target.value;
        setQuantity(qty);
        setTotalAmount(qty * avgPrice);
    };
    
    const handleAvgPriceChange = (e) => {
        const price = e.target.value;
        setAvgPrice(price);
        setTotalAmount(quantity * price);
    };
    
    const handleSellingPriceChange = (e) => {
        const price = e.target.value;
        setSellingPrice(price);
        setTotalProfit((price - avgPrice) * quantity); // This ensures that totalProfit is recalculated
    };
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Ensure all fields are valid numbers
        if (!productName || isNaN(quantity) || isNaN(avgPrice) || isNaN(sellingPrice) || quantity <= 0 || avgPrice <= 0 || sellingPrice <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please ensure all fields are correctly filled with positive numeric values.',
            });
            return;  // Prevent submission if fields are invalid
        }
    
        // Calculate total profit
        const totalProfit = (sellingPrice - avgPrice) * quantity;
    
        // If total profit is negative, show an error
        if (totalProfit < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Profit',
                text: 'The selling price must be higher than the acquisition cost for profit.',
            });
            return;  // Prevent submission if profit is negative
        }
    
        // Create the new product object
        const newProduct = {
            name: productName,
            quantity: parseFloat(quantity),
            avgPrice: parseFloat(avgPrice),
            sellingPrice: parseFloat(sellingPrice),
            totalProfit: totalProfit.toFixed(2),  // Save profit with 2 decimal places
        };
    
        // Add the product to the list
        addProduct(newProduct);
    
        // Reset input fields
        setProductName('');
        setQuantity(0);
        setAvgPrice(0);
        setSellingPrice(0);
        setTotalAmount(0);
        setTotalProfit(0);
    };
    
    
    const handleClearProducts = () => {
        setProducts([]);
    };

    const handleUpload = async () => {
        const productsToUpload = products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            avgPrice: product.avgPrice,
            sellingPrice: product.sellingPrice,
        }));
    
        console.log("Products to upload:", productsToUpload);  // Log this to check the format
        try {
            const response = await api.post('http://localhost:8000/api/uploadproducts/', {
                products: productsToUpload, inventory,
            });
    
            if (response.status === 200) {
                console.log('Products uploaded successfully');
                Swal.fire({
                    icon: 'success',
                    title: 'Uploaded!',
                    text: 'Products have been uploaded successfully.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    setProducts([]);  // Reset product list after successful upload
                });
            }
        } catch (error) {
            console.error('Error uploading products', error.response?.data || error);
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed!',
                text: error.response?.data?.error || 'There was an error uploading the products.',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleProductNameChange = async (e) => {
        const value = e.target.value;
        setProductName(value);
        if (value.length >= 2) {
            try {
                const response = await api.get(`http://localhost:8000/api/product-autocomplete/?query=${value}`);
                setSuggestions(response.data);
                setShowSuggestions(response.data.length > 0);
            } catch (error) {
                console.error('Error fetching product suggestions:', error);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setProductName(suggestion.name);
        setShowSuggestions(false);
    };

    return (
        <div className="flex bg-gray-100 dark:bg-[#111827]">
            <Sidebar />
            <div id="dashboard" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">PRODUCT</h1>
                <div className=" rounded-md w-full mt-6 overflow-x-hidden flex justify-between">
                    <div className="flex-col">
                        <div className="lg:ml-30 space-x-8">
                            <div className="w-[700px] rounded-md border p-5 bg-white shadow dark:bg-[#374151] dark:border-[#374151]">
                                <form className="grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            placeholder="Product Name"
                                            className="mt-1 p-2 w-full border border-black rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                                            value={productName}
                                            onChange={handleProductNameChange}
                                            ref={inputRef}
                                            autoComplete="off"
                                        />
                                        {/* Suggestions Dropdown */}
                                        {showSuggestions && (
                                            <div 
                                                className="absolute top-[163px] left-[355px] z-20 w-[758px] border-gray-400 border bg-white divide-y divide-gray-100 rounded-lg shadow-md"
                                                ref={dropdownRef}
                                            >
                                                <ul className="p-3 space-y-1 text-sm text-gray-700">
                                                    {suggestions.map((suggestion, index) => (
                                                        <li key={index}>
                                                            <div
                                                                className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                                                                onClick={() => handleSuggestionClick(suggestion)}
                                                            >
                                                                <span className="w-full ms-2 text-sm font-medium text-gray-900">
                                                                    {suggestion.name}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between space-x-2">
                                        <div className="w-full flex-col space-y-2">
                                            <p className="text-gray-500 dark:text-[#e7e6e6]">Quantity</p>
                                            <input
                                                type="number"
                                                placeholder="Quantity"
                                                className="mt-1 p-2 w-full border border-black rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                            />
                                        </div>

                                        <div className="w-full flex-col space-y-2">
                                            <p className="text-gray-500 dark:text-[#e7e6e6]">Acquisition Cost</p>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Acquisition Cost"
                                                className="mt-1 p-2 w-full border border-black rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                                                value={avgPrice}
                                                onChange={handleAvgPriceChange}
                                            />
                                        </div>

                                        <div className="w-full flex-col space-y-2">
                                            <p className="text-gray-500 dark:text-[#e7e6e6]">Selling Price</p>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Selling Price"
                                                className="mt-1 p-2 w-full border border-black rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                                                value={sellingPrice}
                                                onChange={handleSellingPriceChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <p className="text-gray-500 dark:text-[#e7e6e6]">Total Profit</p>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Total Profit"
                                            className="mt-1 p-2 w-full border border-black rounded-md bg-white dark:bg-[#374151] dark:border-gray-400 dark:text-[#e7e6e6] placeholder:text-gray-300"
                                            value={totalProfit}
                                            readOnly
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-[#70b8d3] hover:bg-[#09B0EF] shadow text-white font-semibold py-2 px-4 rounded"
                                    >
                                        Add product
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="bg-white shadow-md p-4 rounded-sm mt-5 min-h-[500px] dark:bg-[#374151] dark:border-[#374151]">
                            <div className="flex items-center gap-x-2 mb-2 justify-between">
                                <div className="flex items-center gap-x-2">
                                    <img src="src/assets/grid.png" alt="" className="w-4 h-4 dark:invert"/>
                                    <h2 className="text-xl font-semibold uppercase dark:text-[#e7e6e6]">Product list</h2>
                                </div>

                                <div>
                                    <button className="bg-[#70b8d3] hover:bg-[#09B0EF] text-white p-1 px-2 rounded text-sm">View all</button>
                                </div>
                                
                            </div>
                            <table className="w-full text-left mt-5">
                                <thead className="dark:bg-[#1f2937] bg-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">#</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">Product Name</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">Qty</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">Acquisition Cost</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">Selling Price</th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-[#e7e6e6]">Total Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesHistory.slice(-5).map((sale, index) => {
                                        const product = inventory.find(item => item.name === sale.name);
                                        const quantitySold = 
                                            initialInventory.find(item => item.id === product?.id)?.quantity - product?.quantity || 0;

                                        return (
                                            <tr key={sale.id}>
                                                <td className="border px-4 py-2">{index + 1}</td>
                                                <td className="border px-4 py-2">{sale.name}</td>
                                                <td className="border px-4 py-2">{quantitySold}</td>
                                                <td className="border px-4 py-2">${product?.cost?.toFixed(2)}</td>
                                                <td className="border px-4 py-2">${product?.price?.toFixed(2)}</td>
                                                <td className="border px-4 py-2">
                                                    ${(quantitySold * (product?.price - product?.cost)).toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-md p-6 min-h-[800px] w-full ml-5 border shadow dark:bg-[#374151] dark:border-[#374151]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-900">
                                <span className="text-[13px] font-semibold text-gray-600 uppercase dark:text-[#e7e6e6]">No. of entries</span>
                                <div className="relative inline-block">
                                    <div className="appearance-none border border-gray-300 bg-white py-1 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6]">
                                        <span value="1">{products.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-around space-x-2">
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
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:border-gray-400 dark:bg-[#374151] dark:text-[#e7e6e6] dark:placeholder-white"
                                        placeholder="Search by name"
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={handleUpload} className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] shadow px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                                        <i><img src="./src/assets/upload.png" className="fill-current w-4 h-4" style={{ filter: 'invert(100%)' }} /></i>Upload
                                    </button>
                                    <button onClick={handleClearProducts} className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] shadow px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
                                        <i><img src="./src/assets/clear.png" className="fill-current w-4 h-4" style={{ filter: 'invert(100%)' }} /></i>Clear
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="-mx-4 sm:-mx-8 px-8  py-2 overflow-x-auto">
                            <div className="inline-block min-w-full rounded-md shadow overflow-hidden">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100 text-gray-600 dark:bg-[#1f2937] dark:text-[#e7e6e6]">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product Name</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Qty</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Acq. Cost</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Selling Price</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Total Profit</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map((product) => {
                                            const totalProfit = (product.sellingPrice - product.avgPrice) * product.quantity; // Calculate Total Profit
                                            return (
                                                <tr key={product.id}>
                                                    <td className="px-5 py-5 border-b border-r border-gray-400 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">{product.id}</td>
                                                    <td className="px-5 py-5 border-b border-r border-gray-400 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">
                                                        {editProductId === product.id ? (
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={editedProduct.name}
                                                                onChange={handleEditChange}
                                                                className="w-full p-2 border border-gray-300 "
                                                            />
                                                        ) : (
                                                            product.name
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-r border-gray-400 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">
                                                        {editProductId === product.id ? (
                                                            <input
                                                                type="number"
                                                                name="quantity"
                                                                value={editedProduct.quantity}
                                                                onChange={handleEditChange}
                                                                className="w-full p-2 border border-gray-300 "
                                                            />
                                                        ) : (
                                                            product.quantity
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-r border-gray-400 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">
                                                        {editProductId === product.id ? (
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                name="avgPrice"
                                                                value={editedProduct.avgPrice}
                                                                onChange={handleEditChange}
                                                                className="w-full p-2 border border-gray-300 "
                                                            />
                                                        ) : (
                                                            product.avgPrice
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-r border-gray-400 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">
                                                        {editProductId === product.id ? (
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                name="sellingPrice"
                                                                value={editedProduct.sellingPrice}
                                                                onChange={handleEditChange}
                                                                className="w-full p-2 border border-gray-300 "
                                                            />
                                                        ) : (
                                                            product.sellingPrice
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-r border-gray-400 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">
                                                        {editProductId === product.id ? (
                                                            <input
                                                                type="number"
                                                                name="totalProfit"
                                                                value={totalProfit.toFixed(2)} // Display total profit
                                                                readOnly
                                                                className="w-full p-2 border border-gray-300 rounded"
                                                            />
                                                        ) : (
                                                            totalProfit.toFixed(2) // Display calculated profit
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm dark:bg-[#66696e] dark:text-[#e7e6e6]">
                                                        <div className="space-x-1 flex">
                                                            {editProductId === product.id ? (
                                                                <button
                                                                    className="bg-[#70b8d3] hover:bg-[#3d9fdb] px-4 py-2 rounded-md text-white font-medium"
                                                                    onClick={handleSaveClick}
                                                                >
                                                                    Save
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="bg-[#70b8d3] hover:bg-[#3d9fdb] px-4 py-2 rounded-md text-white font-medium"
                                                                    onClick={() => handleEditClick(product)}
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                            <button
                                                                className="bg-[#FF6767] hover:bg-[#f35656] px-4 py-2 rounded-md text-white font-medium"
                                                                onClick={() => handleDeleteProduct(product.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                
                                {/* pagination */}
                                <div className="px-5 py-5 bg-white flex flex-col xs:flex-row items-end justify-between dark:bg-[#66696e]">
                                    <div className="inline-flex mt-2 xs:mt-0">
                                        <button
                                            className="text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#09B0EF] shadow font-semibold py-2 px-4 rounded-l"
                                            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                                            disabled={currentPage === 1}
                                        >
                                            Prev
                                        </button>
                                        
                                        {/* Page numbers */}
                                        {pageNumbers.map(number => (
                                            <button
                                                key={number}
                                                onClick={() => setCurrentPage(number)}
                                                className={`text-sm px-3 py-2 ${currentPage === number ? ' bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-700'} rounded`}
                                            >
                                                {number}
                                            </button>
                                        ))}
                                        
                                        <button
                                            className="text-sm text-indigo-50 transition duration-150 bg-[#70b8d3] hover:bg-[#09B0EF] shadow font-semibold py-2 px-4 rounded-r"
                                            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </div>

                                    {/* Showing current page and total pages */}
                                    <div className="mt-2 xs:mt-0 text-gray-600 dark:text-[#e7e6e6]">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;