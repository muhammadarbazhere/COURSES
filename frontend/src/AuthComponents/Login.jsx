import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineWifiPassword } from "react-icons/md";
import logo from "../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../App/AuthSlice";
import { useDispatch } from "react-redux";

function Login() {
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ Added state for password toggle
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/route/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        dispatch(authActions.login(data.token));

        if (data.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }

        alert('Login successful. Please check your email for confirmation.');
        setInputs({ email: '', password: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message.includes("Email") || err.message.includes("password")
        ? err.message
        : "Server error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center h-dvh items-center bg-blue-100 pt-10 pb-20">
      <div className="rounded-lg p-8 bg-white font-[Chivo]" style={{ width: "500px" }}>
        <div className="items-center flex justify-center pb-8">
          <img src={logo} alt="Logo" className="w-24 h-24" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4 flex items-center">
            <FaEnvelope className="text-[#5F9BCE] mr-2" size={24} />
            <input
              type="email"
              id="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              className="form-input px-2 mt-1 h-10 w-full rounded-lg border-gray-300 border"
              placeholder="Email Address"
              required
            />
          </div>

          {/* Password Field with toggle */}
          <div className="mb-4 flex items-center relative">
            <MdOutlineWifiPassword className="text-[#5F9BCE] mr-2" size={26} />
            <input
              type={showPassword ? "text" : "password"} // 👁️ Toggle input type
              id="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              minLength={8}
              className="form-input px-2 mt-1 w-full h-10 rounded-lg border-gray-300 border"
              placeholder="Password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Forgot Password link */}
          <div className="text-right text-sm text-[#5F9BCE]">
            <Link to="/forgot" className="hover:underline">Forgot Password?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-blue border-2 border-[#5F9BCE] mt-4 px-4 py-2 rounded-md hover:text-white hover:bg-[#5F9BCE] focus:outline-none focus:bg-[#5F9BCE] w-full duration-700 ease-in-out"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {error && <p style={{ color: 'red' }} className="mt-2">{error}</p>}

        {/* Register Link */}
        <div className="text-center text-sm mt-2">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-red-600 hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
