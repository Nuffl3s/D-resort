import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [isEmployee, setIsEmployee] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
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
      const response = await axios.post("http://localhost:8000/api/token/", {
        username: formData.username,
        password: formData.password,
      });

      // Save JWT tokens to local storage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Navigate to appropriate dashboard
      if (isEmployee) {
        navigate("/EmployeeDash");
      } else {
        navigate("/AdminDash");
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
        user_type: isEmployee ? 'Employee' : 'Admin',
    };

    try {
        const response = await fetch('http://localhost:8000/api/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const data = await response.json();
            alert('User registered successfully!');
        } else {
            const error = await response.json();
            console.error('Error:', error);
            alert('Failed to register user.');
        }
    } catch (err) {
        console.error('Network error:', err);
    }
};

  // Toggle between employee and admin login
  const handleToggleLoginType = () => {
    setIsEmployee((prev) => !prev);
  };

  // Toggle between login and registration forms
  const handleToggleRegister = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Left Side with Image */}
      <div className="w-9/12 h-full flex justify-center items-center">
        <img src="./src/assets/login.png" alt="Logo" className="max-w-full max-h-full" />
      </div>

      {/* Right Side with Form */}
      <div className="w-1/2 h-full flex justify-center items-center">
        <div className="w-[500px] bg-white p-8 rounded-[5px] shadow-lg">
          <h2 className="text-2xl font-extrabold text-[#1089D3] text-center mb-6">
            {isRegistering ? "REGISTER" : isEmployee ? "EMPLOYEE LOGIN" : "ADMIN LOGIN"}
          </h2>
          <form className="mt-6" onSubmit={isRegistering ? handleRegister : handleLogin}>
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#12B1D1] focus:outline-none"
                placeholder="Username"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#12B1D1] focus:outline-none"
                placeholder="Password"
                required
              />
            </div>

            {/* User Type (for registration only) */}
            {isRegistering && (
              <div className="mb-4">
                <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                  User Type
                </label>
                <select
                  id="user_type"
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#12B1D1] focus:outline-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white p-3 rounded-[10px] shadow-md hover:to-[#0f8bb1]"
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

          {/* Switch between Employee and Admin Login */}
          {!isRegistering && (
            <button
              onClick={handleToggleLoginType}
              className="w-full mt-4 bg-gray-200 text-gray-800 p-3 rounded-[10px] shadow-md hover:bg-gray-300"
            >
              Switch to {isEmployee ? "Admin" : "Employee"} Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
