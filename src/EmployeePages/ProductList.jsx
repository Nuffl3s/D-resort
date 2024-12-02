import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Sidebar from '../components/EmployeeSidebar';
// import axios from 'axios';
import api from '../api';
import { useNavigate } from "react-router-dom";

function ProductList() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);  

    const fetchProducts = async () => {
        try {
            const response = await api.get('http://localhost:8000/api/products/');
            setProducts(response.data); // Products from backend
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`http://localhost:8000/api/products/${id}/`);
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleAddProduct = () => {
        navigate("/AddProduct"); // Redirect to Add Product page
    };

    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <div className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">PRODUCT LIST</h1>

                {/* Search and Add Product Buttons */}
                <div className='flex justify-between items-center mb-4'>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none ">
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
                    </div>
                    <button onClick={handleAddProduct} className='rounded-md shadow-md bg-[#70b8d3] hover:bg-[#09B0EF] text-white font-medium p-2 px-4'>Add Product</button>
                </div>
              
                {/* Table of Products */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-black bg-white">
                        <thead className="text-xs text-black uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="thDesign">ID</th>
                                <th scope="col" className="thDesign">Product name</th>
                                <th scope="col" className="thDesign">Date of Product added</th>
                                <th scope="col" className="thDesign">Quantity</th>
                                <th scope="col" className="thDesign">AVG PRICE</th>
                                <th scope="col" className="thDesign">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{product.id}</td>
                                        <td className="px-6 py-4 font-medium text-black whitespace-nowrap">{product.name}</td>
                                        <td className="px-6 py-4">{product.date_added}</td>
                                        <td className="px-6 py-4">{product.quantity}</td>
                                        <td className="px-6 py-4">{product.avgPrice}</td>
                                        <td className="space-x-2">

                                            <button
                                                className="bg-[#1089D3] hover:bg-[#3d9fdb] p-2 rounded-full"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                <img
                                                    src="./src/assets/edit.png"
                                                    className="fill-current w-4 h-4"
                                                    style={{ filter: 'invert(100%)' }}
                                                    alt="Delete"
                                                />
                                            </button>

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
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center">No products available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Define PropTypes for the component
ProductList.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            dateAdded: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            avgPrice: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default ProductList;
