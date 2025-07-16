import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore.js"; 

export default function Login() {
const API_BASE_URL = "http://localhost:3000/api/auth";
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, formData, {withCredentials: true}); 

      setAuth(res.data); 
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <input
          name="name"
          type="text"
          placeholder="Name"
          className="w-full border px-4 py-2 rounded-lg"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded-lg"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded-lg"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to={"/register"}>
            <span className="text-blue-600 hover:underline">Register</span>{" "}
          </Link>
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center cursor-pointer justify-center gap-2 w-full max-w-xs bg-white border border-gray-300 text-sm text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
