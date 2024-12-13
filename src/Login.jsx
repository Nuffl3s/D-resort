import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./api"; // Import the API instance
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    user_type: "Employee", // Default to Employee for registration
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Send login request
      const response = await axios.post("http://localhost:8000/api/logtoken/", {
        username: formData.username,
        password: formData.password,
      });

      // Save JWT tokens to localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

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

  // Handle registration
  const handleRegister = async (event) => {
    event.preventDefault();

    const requestBody = {
      username: formData.username,
      password: formData.password,
      user_type: formData.user_type,
    };

    try {
      // Register user using the API instance
      const response = await api.post("/reguser/", requestBody);

      if (response.status === 201) {
        alert("User registered successfully!");
      } else {
        alert("Failed to register user.");
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Failed to register user.");
    }
  };

  // Toggle between login and registration forms
  const handleToggleRegister = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <div className="w-screen h-screen flex bg-cover bg-center justify-center relative bg-gray-50">
      <div className="w-2/3 h-full flex justify-center items-center relative z-10">
        {/* Container holding login and signup */}
        <div className="flex w-full max-w-4xl rounded-[10px] overflow-hidden shadow-lg bg-white">
          {/* Left side: Login Form */}
          <div className="w-1/2 p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#1a1a1a]">
              {isRegistering ? "REGISTER" : "LOGIN"}
            </h2>

            {/* Login Form */}
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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
              {!isRegistering && (
                <div className="mb-4 text-right">
                  <a
                    href="/forgot-password" // Update with actual route for forgot password
                    className="text-sm text-gray-800 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* User Type (for registration only) */}
              {isRegistering && (
                <div className="mb-4">
                  <label
                    htmlFor="user_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    User Type
                  </label>
                  <select
                    id="user_type"
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#374151] focus:outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#374151] hover:bg-gray-600 text-white p-3 rounded-[10px] shadow-md font-medium"
              >
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>

            {/* Switch between Login and Register */}
            <button
              onClick={handleToggleRegister}
              className="w-full mt-4 bg-gray-200 text-gray-800 p-3 rounded-[10px] shadow-md hover:bg-gray-300"
            >
              {isRegistering ? "Switch to Login" : "Switch to Register"}
            </button>
          </div>

          {/* Right side: Signup prompt */}
          <div className="w-1/2 bg-[#374151] text-white p-8 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
            <p className="text-lg mb-6">
              Enter your personal details and start your journey with us
            </p>
            <button
              onClick={handleToggleRegister}
              className="bg-white text-gray-800 text-lg px-6 py-3 rounded-full hover:bg-gray-100 transition-all font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
