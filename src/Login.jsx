import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./api"; // Import the API instance

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false); // State to toggle between login and change password form

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("http://localhost:8000/api/logtoken/", {
        username: formData.username,
        password: formData.password,
      });

      console.log("Login Response:", response.data); // Debug response

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      api.defaults.headers["Authorization"] = `Bearer ${response.data.access}`;

      const userDetails = await api.get("/user-details/");
      console.log("User Details:", userDetails.data); // Debug user details

      const userType = userDetails.data.user_type;

      localStorage.setItem("API_USERNAME", formData.username);
      localStorage.setItem("API_PASSWORD", formData.password);

      console.log("Updated Credentials:", {
        API_USERNAME: formData.username,
        API_PASSWORD: formData.password,
        userType,
      });

      if (userType === "Admin") {
        navigate("/AdminDash");
      } else if (userType === "Employee") {
        navigate("/EmployeeDash");
      } else {
        console.error("Unknown user type:", userType);
        alert("Unknown user type!");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid username or password.");
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Replace with the appropriate endpoint for password change
      const response = await api.post("http://localhost:8000/api/change-password/", {
        username: formData.username,
        newPassword: formData.newPassword,
      });

      console.log("Password Change Response:", response.data);
      alert("Password changed successfully!");

      // Optionally, redirect to login or show a success message
      setIsChangingPassword(false); // Switch back to login view
    } catch (error) {
      console.error("Password change failed:", error.response?.data || error.message);
      alert("Error changing password.");
    }
  };

  return (
    <div className="w-screen h-screen flex bg-cover bg-center justify-center relative bg-gray-50">
      <div className="w-2/3 h-full flex justify-center items-center relative z-10">
        <div className="flex w-full max-w-4xl rounded-[10px] overflow-hidden shadow-lg bg-white">
          <div className="w-1/2 p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#1a1a1a]">
              {isChangingPassword ? "Change Password" : "Login"}
            </h2>
           
            <form onSubmit={isChangingPassword ? handleChangePassword : handleLogin}>
              {isChangingPassword && (
                <div
                  className="absolute top-[280px] cursor-pointer"
                  onClick={() => setIsChangingPassword(false)}
                >
                  <img src="src/assets/back.png" alt="Back" className="w-6 h-6" />
                </div>
              )}
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
                      className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#374151] focus:outline-none"
                      placeholder="Username"
                      required
                  />
              </div>

              {isChangingPassword ? (
                <>
                  <div className="mb-4">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#374151] focus:outline-none"
                          placeholder="New Password"
                          required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#374151] focus:outline-none"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                </>
              ) : (
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
                    className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#374151] focus:outline-none"
                    placeholder="Password"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end mb-4">
                {!isChangingPassword && (
                  <a
                    href="#"
                    className="text-sm text-[#374151] hover:text-gray-600 hover:underline"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Forgot password?
                  </a>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#374151] hover:bg-gray-600 text-white p-3 rounded-[10px] shadow-md font-medium"
              >
                {isChangingPassword ? "Change Password" : "Login"}
              </button>
            </form>
          </div>

          <div className="w-1/2 bg-[#374151] text-white p-8 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-4">
              {isChangingPassword ? "Forgot your password? Change it here" : "Hello!"}
            </h2>
            <p className="text-lg mb-6">
              {isChangingPassword
                ? "Enter your username and new password to reset your password."
                : "Enter your login details to continue."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
