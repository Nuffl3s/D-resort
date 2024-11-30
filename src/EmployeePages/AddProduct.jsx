import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/EmployeeSidebar';
// import axios from 'axios';
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

    const productsPerPage = 7;
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Event handler to detect clicks outside the input or suggestions dropdown
        const handleClickOutside = (event) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target) && 
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target)
            ) {
                setShowSuggestions(false); // Hide suggestions if click is outside
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Calculate indices for slicing the product array
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get the current set of filtered products for the current page
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

    // Handles the search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update the search query state with user input
    };

    const handleDeleteProduct = (id) => {
        const filteredProducts = products.filter(product => product.id !== id);
        setProducts(filteredProducts.map((product, index) => ({
            ...product,
            id: index + 1 // Re-sequence IDs after deletion
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

    // Define the missing addProduct function
    const addProduct = (newProduct) => {
        setProducts((prevProducts) => [
            ...prevProducts,
            { ...newProduct, id: prevProducts.length + 1 } // Assign sequential ID
        ]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProduct = {
            name: productName,
            quantity: parseFloat(quantity),
            avgPrice: parseFloat(avgPrice),
            amount: (quantity * avgPrice).toFixed(2),
        };

        // Add the new product to the shared state
        addProduct(newProduct);

        // Reset form inputs
        setProductName('');
        setQuantity(0);
        setAvgPrice(0);
        setTotalAmount(0);
    };

    const handleClearProducts = () => {
        setProducts([]); 
    };

    const handleUpload = async () => {
        const productsToUpload = products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            avgPrice: product.avgPrice
        }));
    
        try {
            const response = await api.post('http://localhost:8000/api/uploadproducts/', {
                products: productsToUpload
            });
    
            if (response.status === 200) {
                console.log('Products uploaded successfully');
                
                // Show SweetAlert success message
                Swal.fire({
                    icon: 'success',
                    title: 'Uploaded!',
                    text: 'Products have been uploaded successfully.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setProducts([]);  
                });
            }
        } catch (error) {
            console.error('Error uploading products', error);
    
            // Show SweetAlert error message
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed!',
                text: 'There was an error uploading the products. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };
    
    // Handle product name change and trigger autocomplete
    const handleProductNameChange = async (e) => {
        const value = e.target.value;
        setProductName(value);
        if (value.length >= 2) {
            try {
                const response = await api.get(`http://localhost:8000/api/product-autocomplete/?query=${value}`);
                console.log(response.data); // Check the structure of the data received
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
        setProductName(suggestion.name);  // Set the clicked suggestion as the product name
        setShowSuggestions(false);  // Hide the suggestions dropdown
    };


    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <div id="dashboard" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">PRODUCT</h1>
                <div className=" rounded-md w-full mt-8 overflow-x-hidden flex justify-between">
                    <div className="lg:ml-30 space-x-8">
                        <div className="w-[700px] rounded-md border p-5 bg-white shadow">
                            <form className="grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={productName}
                                        onChange={handleProductNameChange}
                                        ref={inputRef}
                                        autoComplete="off"
                                    />

                                    {showSuggestions && (
                                        <div 
                                            className="absolute top-[163px] left-[355px] z-20 w-[758px] border-gray-400 border bg-white divide-y divide-gray-100 rounded-lg shadow-md"
                                            ref={dropdownRef} // Reference to the dropdown
                                        >
                                            <ul className="p-3 space-y-1 text-sm text-gray-700">
                                                {suggestions.map((suggestion, index) => (
                                                    <li key={index}>
                                                        <div
                                                            className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                        >
                                                            <span className="w-full ms-2 text-sm font-medium text-gray-900">
                                                                {suggestion.name}  {/* Ensure this matches the API response structure */}
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
                                        <p className="text-gray-500">Quantity</p>
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                        />
                                    </div>

                                    <div className="w-full flex-col space-y-2">
                                        <p className="text-gray-500">AVG Price</p>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Average Price"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={avgPrice}
                                            onChange={handleAvgPriceChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <p className="text-gray-500">Total Amount</p>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Total Amount"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={totalAmount}
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
                    
                    <div className="bg-white rounded-md p-6 min-h-[800px] w-full ml-5 border shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs xs:text-sm text-gray-900">
                                <span className="text-[13px] font-semibold text-gray-600 uppercase">No. of entries</span>
                                <div className="relative inline-block">
                                    <div className="appearance-none border border-gray-300 bg-white py-1 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                        <span value="1">{products.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-around space-x-2">
                                <div className="flex bg-white items-center p-2 rounded-md border">
                                    <img src="./src/assets/search.png" className="fill-current w-5 h-5"/>
                                    <input
                                        className="bg-white outline-none ml-1 block"
                                        type="text"
                                        placeholder="search..."
                                        value={searchQuery}
                                        onChange={handleSearchChange} 
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
                            <div className="inline-block min-w-full shadow overflow-hidden">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="thDesign">NO.</th>
                                            <th className="thDesign">Product Name</th>
                                            <th className="thDesign">Quantity</th>
                                            <th className="thDesign">Average Price</th>
                                            <th className="thDesign">Amount</th>
                                            <th className="thDesign">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-5 py-5 border-b border-r  border-gray-200 bg-white text-sm">{product.id}</td>
                                                <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
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
                                                <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
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
                                                <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
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
                                                <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
                                                    {editProductId === product.id ? (
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            name="amount"
                                                            value={editedProduct.amount}
                                                            readOnly
                                                            className="w-full p-2 border border-gray-300 rounded"
                                                        />
                                                    ) : (
                                                        product.amount
                                                    )}
                                                </td>
                                                <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
                                                    <div className="space-x-2">
                                                        {editProductId === product.id ? (
                                                            <button
                                                                className="px-3 py-2 text-base font-medium rounded-md shadow-md text-white bg-[#1089D3] hover:bg-[#3d9fdb]"
                                                                onClick={handleSaveClick}
                                                            >
                                                                Save
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="bg-[#1089D3] hover:bg-[#3d9fdb] p-2 rounded-full"
                                                                onClick={() => handleEditClick(product)}
                                                            >
                                                                <img
                                                                    src="./src/assets/edit.png"
                                                                    className="fill-current w-4 h-4"
                                                                    style={{ filter: 'invert(100%)' }}
                                                                    alt="Edit"
                                                                />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="bg-[#FF6767] hover:bg-[#f35656] p-2 rounded-full"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                        >
                                                            <img
                                                                src="./src/assets/delete.png"
                                                                className="fill-current w-4 h-4"
                                                                style={{ filter: 'invert(100%)' }}
                                                                alt="Delete"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {/* pagination */}
                                <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-end justify-between">
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
                                                className={`text-sm px-3 py-2 mx-1 ${currentPage === number ? 'bg-[#70b8d3] text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#09B0EF] rounded`}
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
                                    <div className="mt-2 xs:mt-0 text-gray-600">
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