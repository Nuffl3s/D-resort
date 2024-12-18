import { useState, useEffect } from "react";
import api from "../api";
import Swal from "sweetalert2";
import AdminSidebar from "../components/AdminSidebar";

function AccountCreation() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rePassword: "",
  });

  const [accounts, setAccounts] = useState([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, rePassword } = formData;

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
        user_type: "Admin", // Set user type as Admin
      });
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "The Admin account has been created successfully!",
        confirmButtonColor: "#3085d6",
      });
      setFormData({
        username: "",
        password: "",
        rePassword: "",
      });
      fetchAccounts();
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
      const response = await api.get("/admin-accounts/"); // Updated endpoint
      console.log("Fetched admin accounts:", response.data); // Debugging line
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching admin accounts:", error);
      setAccounts([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-grow p-8">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-300 space-y-10">
          {/* Account Creation Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800">Create Admin Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="mt-2 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="mt-2 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                  className="mt-2 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Re-enter password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#70b8d3] hover:bg-[#09B0EF] text-white font-bold py-3 rounded-lg transition-all"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Accounts List Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800">Admin Accounts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-sm text-gray-700">
                    <th className="px-6 py-3 text-left font-medium text-gray-800">Username</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-800">Account Type</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <tr
                        key={account.id}
                        className="hover:bg-gray-50 transition-all border-t"
                      >
                        <td className="px-6 py-3">{account.username}</td>
                        <td className="px-6 py-3">{account.user_type}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">
                        No accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountCreation;
