import { useState, useEffect } from "react";
import api from "../api";
import Swal from "sweetalert2";
import AdminSidebar from "../components/AdminSidebar";

function AccountCreation() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rePassword: "",
        userType: "Admin", // Default user type
    });
    const [accounts, setAccounts] = useState([]); // Always initialized as an empty array
    const [displayType, setDisplayType] = useState("Admin"); // Default view

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, rePassword, userType } = formData;

        if (password !== rePassword) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Passwords do not match!",
            confirmButtonColor: "#d33",
        });
        return;
        }

        try {
        await api.post("/reguser/", {
            username,
            password,
            user_type: userType,
        });
        Swal.fire({
            icon: "success",
            title: "Account Created",
            text: `The ${userType} account has been created successfully!`,
            confirmButtonColor: "#3085d6",
        });
        setFormData({
            username: "",
            password: "",
            rePassword: "",
            userType: "Employee",
        });
        fetchAccounts(); // Refresh the accounts list
        } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.detail || "Failed to create account.",
            confirmButtonColor: "#d33",
        });
        }
    };

    const fetchAccounts = async () => {
        try {
            const response = await api.get("/user-details/");
            console.log("Fetched Accounts Data:", response.data); // Debug the API response
            setAccounts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching accounts:", error);
            setAccounts([]);
        }
    };

    useEffect(() => {
        fetchAccounts(); // Fetch accounts on component mount
    }, []);

    const filteredAccounts = accounts.filter(
        (account) => account.user_type === displayType
    );

    return (
        <div className="flex bg-gray-100 min-h-screen">
        <AdminSidebar />
        <div className="flex-grow p-6 flex space-x-6">
            {/* Left Side: Form */}
            <div className="w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Create Account
            </h2>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                <div className="mb-4">
                <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                >
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter username"
                    required
                />
                </div>

                <div className="mb-4">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter password"
                    required
                />
                </div>

                <div className="mb-4">
                <label
                    htmlFor="rePassword"
                    className="block text-sm font-medium text-gray-700"
                >
                    Re-enter Password
                </label>
                <input
                    type="password"
                    id="rePassword"
                    name="rePassword"
                    value={formData.rePassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Re-enter password"
                    required
                />
                </div>

                <div className="mb-4">
                <label
                    htmlFor="userType"
                    className="block text-sm font-medium text-gray-700"
                >
                    Account Type
                </label>
                <select
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                </select>
                </div>

                <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md"
                >
                Create Account
                </button>
            </form>
            </div>

            {/* Right Side: Account List */}
            <div className="w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Accounts</h2>
            <div className="flex space-x-4 mb-4">
                {/* <button
                    onClick={() => {
                        setDisplayType("Employee");
                        setFormData((prev) => ({ ...prev, userType: "Employee" }));
                    }}
                    className={`px-4 py-2 font-medium text-white rounded ${
                        displayType === "Employee" ? "bg-blue-500" : "bg-gray-400"
                    }`}
                >
                    Employees
                </button> */}
                <button
                    onClick={() => {
                        setDisplayType("Admin");
                        setFormData((prev) => ({ ...prev, userType: "Admin" }));
                    }}
                    className={`px-4 py-2 font-medium text-white rounded ${
                        displayType === "Admin" ? "bg-blue-500" : "bg-gray-400"
                    }`}
                >
                    Admins
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
                <table className="min-w-full table-auto">
                <thead>
                    <tr>
                    <th className="px-4 py-2 text-left text-gray-800 font-medium">
                        Username
                    </th>
                    <th className="px-4 py-2 text-left text-gray-800 font-medium">
                        Account Type
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((account) => (
                            <tr key={account.id}>
                                <td className="px-4 py-2">{account.username}</td>
                                <td className="px-4 py-2">{account.user_type}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center py-4">
                                No accounts found for {displayType}.
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    );
}

export default AccountCreation;
