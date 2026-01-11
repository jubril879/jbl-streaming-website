import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../lib/api';
export default function AdminLoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loginData, setLoginData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authAPI.login(formData.email, formData.password);
      if (data.user) {
        if (data.user.role !== 'admin') {
          setError('Access denied: Admin privileges required');
          setIsLoading(false);
          return;
        }
        // Directly navigate to admin page after successful login
        if (onLogin) {
          onLogin(data);
        }
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('API Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials or backend connection.');
    } finally {
      setIsLoading(false);
    }
  };



  const goToRegisterAdmin = () => {
    navigate('/register-admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
         
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-full">
                <Shield className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400 text-sm">Access the CinemaHub admin dashboard</p>
          </div>

    
          <form onSubmit={handleSubmit} className="space-y-5">
           
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@cinemahub.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition"
                />
              </div>
            </div>

            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

          
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-3 text-red-200 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            )}

          
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

         
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Don't have admin access?</span>
            </div>
          </div>

         
          {/* <button
            type="button"
            onClick={goToRegisterAdmin}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition duration-200"
          >
            Register Admin Account
          </button> */}

       
          {/* <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <p className="text-gray-300 text-xs font-semibold mb-2">📝 Demo Credentials:</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>
                <strong>Email:</strong> admin@cinemahub.com
              </li>
              <li>
                <strong>Password:</strong> admin123
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  )
}

