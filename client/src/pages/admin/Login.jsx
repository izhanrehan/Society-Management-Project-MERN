import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/api'; 

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
            
            // ✅ LocalStorage setups
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userName', response.data.name);

            setMessage('Login successful! Redirecting to panel...');
            setIsError(false);

            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1500);

        } catch (err) {
            setIsError(true);
            const errorMsg = err.response?.data?.error || 'Login failed. Unauthorized Access.';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans antialiased">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
                
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800">
                    Admin Portal
                </h2>
                <p className="text-center text-sm text-gray-600 mb-8">
                    Strictly for authorized society administrators.
                </p>

                {message && (
                    <div className={`mb-6 p-3 rounded-lg text-center text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1 tracking-wide uppercase">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="admin@society.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        {/* ✅ Inline style ko block class se change kardia hai */}
                        <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-1 tracking-wide uppercase">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-lg w-full text-sm disabled:opacity-50 transition-all shadow-md mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Verifying Credentials...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link to="/" className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors">
                        &larr; Back to Landing Page
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;