import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./api"; // Import the API instance
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa"; // Import arrow icon from react-icons

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [superAdminPassword, setSuperAdminPassword] = useState(""); // For super admin password input
  const [isSuperAdminPasswordRequired, setIsSuperAdminPasswordRequired] = useState(false); // Toggle between login and create admin
  const [isSuperAdminValid, setIsSuperAdminValid] = useState(false); // Flag to check if super admin password is correct

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle super admin password input change
  const handleSuperAdminPasswordChange = (e) => {
    setSuperAdminPassword(e.target.value);
  };

  // Handle login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Send login request
      const response = await api.post("http://localhost:8000/api/logtoken/", {
        username: formData.username,
        password: formData.password,
      });

      // Save JWT tokens to localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Set authorization header for all API calls
      api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;

      // Retrieve user details
      const userDetails = await api.get("/user-details/");
      const userType = userDetails.data.user_type;

      // Save user role to localStorage
      localStorage.setItem("user_role", userType);

      // Navigate based on user role
      if (userType === "Admin") {
        navigate("/AdminDash");
      } else if (userType === "Employee") {
        navigate("/EmployeeDash");
      } else {
        alert("Unknown user type!");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid username or password.");
    }
  };

  // Handle "Create Another Admin" button click
  const handleCreateAdmin = async () => {
    // Set the state to show super admin password input field
    setIsSuperAdminPasswordRequired(true);
  };

  // Go back to the login screen
  const handleGoBack = () => {
    setIsSuperAdminPasswordRequired(false); // Set the state back to login screen
  };

  // Handle super admin password validation and transition
  const handleSuperAdminPasswordSubmit = (event) => {
    event.preventDefault();
    if (superAdminPassword === "supersecretpassword") { // Replace this with actual validation logic
      setIsSuperAdminValid(true); // Set super admin valid flag
    } else {
      alert("Invalid Super Admin Password");
    }
  };

  return (
    <div className="w-screen h-screen flex bg-cover bg-center justify-center relative bg-gray-50">
        <div className="w-2/3 h-full flex justify-center items-center relative z-10">
            {/* Container holding login */}
            <div className="flex w-full max-w-4xl rounded-[10px] overflow-hidden shadow-lg bg-white">
              {/* Left side: Login Form or Admin Creation Form */}
              <div className="w-1/2 p-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-[#1a1a1a]">
                  {isSuperAdminValid ? "Create New Admin" : "LOGIN"}
                </h2>

                {/* If super admin password is required, show the password input */}
                {isSuperAdminPasswordRequired ? (
                  <div>
                    {/* Back button */}
                    <div
                      onClick={handleGoBack}
                      className="absolute top-4 left-4 cursor-pointer p-2 text-white"
                    >
                      <FaArrowLeft size={24} />
                    </div>

                    <form onSubmit={handleSuperAdminPasswordSubmit}>
                      <div className="mb-4">
                        <img src="src/assets/back.png" alt="" className="w-5 h-5 absolute top-[380px] cursor-pointer" onClick={handleGoBack} />
                        <label
                          htmlFor="super-admin-password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Super Admin Password
                        </label>
                        <input
                          type="password"
                          id="super-admin-password"
                          name="super-admin-password"
                          value={superAdminPassword}
                          onChange={handleSuperAdminPasswordChange}
                          className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#374151] focus:outline-none"
                          placeholder="Super Admin Password"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#374151] hover:bg-gray-600 text-white p-3 rounded-[10px] shadow-md font-medium"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                ) : (
                  // Login Form or Create Admin Form
                  <form onSubmit={handleLogin}>
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
                        className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#374151] focus:outline-none"
                        placeholder="Username"
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
                        className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#374151] focus:outline-none"
                        placeholder="Password"
                        required
                      />
                    </div>

                    {/* Forgot Password link below password input */}
                    <div className="mb-4 text-right">
                      <a
                        href="/forgot-password" // Update with actual route for forgot password
                        className="text-sm text-gray-800 hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#374151] hover:bg-gray-600 text-white p-3 rounded-[10px] shadow-md font-medium"
                    >
                      Login
                    </button>
                  </form>
                )}
              </div>

              {/* Right side: Design Prompt */}
              <div className="w-1/2 bg-[#374151] text-white p-8 flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold mb-4">Hello!</h2>
                <p className="text-lg mb-6">
                  Enter your login details to continue.
                </p>
                {/* New button to create another admin */}
                {!isSuperAdminPasswordRequired && !isSuperAdminValid && (
                  <button
                    onClick={handleCreateAdmin}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-[10px] shadow-md font-medium"
                  >
                    Create Another Admin
                  </button>
                )}
              </div>
            </div>
        </div>
    </div>
  );
}

export default Login;
