import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Sidebar from '../components/EmployeeSidebar';
import api from '../api';

function ProductList() {
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


    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <div className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">PRODUCT LIST</h1>

                {/* Search and Add Product Buttons */}
                <div className='flex justify-between items-center mb-4'>
                    <div className="flex items-center space-x-4">
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
                    </div>
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
                                <th scope="col" className="thDesign">Acquisition cost</th>
                                <th scope="col" className="thDesign">Selling price</th>
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
                                        <td className="px-6 py-4">{product.avgPrice}</td> {/* Updated to 'acquisitionCost' */}
                                        <td className="px-6 py-4">{product.sellingPrice}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center">No products available</td>
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
            date_added: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            acquisitionCost: PropTypes.number.isRequired, // Changed from avgPrice to acquisitionCost
            sellingPrice: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default ProductList;
