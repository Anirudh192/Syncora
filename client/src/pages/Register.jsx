import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore.js'; // Uncomment once Zustand store is ready

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth); // Zustand
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    const API_BASE_URL = 'http://localhost:3000/api';
    const res = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
    console.log(res.data);
      setAuth(res.data); // Zustand: store user info
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      console.log(err)
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
        <h2 className="text-2xl font-bold text-center">Register</h2>

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
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
