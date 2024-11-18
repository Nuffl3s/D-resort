import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const [isEmployee, setIsEmployee] = useState(false);

  const handleToggleLogin = (event) => {
    event.preventDefault();
    setIsEmployee((prev) => !prev);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (isEmployee) {
      navigate('/EmployeeDash');
    } else {
      navigate('/AdminDash');
    }
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="w-9/12 h-full flex justify-center items-center">
        <img src="./src/assets/login.png" alt="Logo" className="max-w-full max-h-full" />
      </div>

      <div className="w-1/2 h-full flex justify-center items-center">
        <div className="w-[500px] h-[500px] bg-white p-8 rounded-[5px] shadow-lg">
          <h2 className="text-2xl font-extrabold text-[#1089D3] text-center mb-6">
            {isEmployee ? 'EMPLOYEE LOGIN' : 'ADMIN LOGIN'}
          </h2>
          <form className="mt-6">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#12B1D1] focus:outline-none"
                placeholder="Username"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full bg-white border-2 border-transparent p-3 rounded-[10px] shadow-md placeholder-gray-400 focus:border-[#12B1D1] focus:outline-none"
                placeholder="Password"
              />
              <div className="mt-2 text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-[#1089D3] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#1089D3] to-[#12B1D1] text-white p-3 rounded-[10px] shadow-md hover:to-[#0f8bb1]"
            >
              Login
            </button>
          </form>
          <button
            onClick={handleToggleLogin}
            className="w-full mt-4 bg-gray-200 text-gray-800 p-3 rounded-[10px] shadow-md hover:bg-gray-300"
          >
            Switch to {isEmployee ? 'Admin' : 'Employee'} Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
