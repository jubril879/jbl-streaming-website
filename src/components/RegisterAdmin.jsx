import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../lib/api';

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);

  const adminCredentials = {
    name: 'Admin',
    email: 'admin@cinemahub.com',
    password: 'admin123',
    adminCode: 'ADMIN123',
  };

  const registerAdmin = async () => {
    setIsLoading(true);
    setMessage('Registering admin...');
    try {
      // 1. Always register in localStorage for fallback
      const adminUser = {
        name: 'Admin',
        email: 'admin@cinemahub.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!users.some((u) => u.email === adminUser.email)) {
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
      }

      // 2. Try to register on the real backend
      try {
        const response = await authAPI.register(
          adminCredentials.name,
          adminCredentials.email,
          adminCredentials.password
        );
        
        if (response.token) {
          setMessageType('success');
          setMessage('✅ Admin registered on backend and locally! You can now log in.');
        } else {
          setMessageType('success');
          setMessage(`ℹ️ Local registration success. Backend note: ${response.message || 'Already exists or error'}`);
        }
      } catch (apiError) {
        console.error('Backend registration failed:', apiError);
        setMessageType('success');
        setMessage('✅ Registered locally. (Backend currently unavailable - ensure database is connected for full features)');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`❌ Error registering admin: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdmin = () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const adminExists = users.some((u) => u.email === 'admin@cinemahub.com');

      if (adminExists) {
        const admin = users.find((u) => u.email === 'admin@cinemahub.com');
        setMessageType('success');
        setMessage(`✅ Admin account found: ${JSON.stringify(admin, null, 2)}`);
      } else {
        setMessageType('error');
        setMessage('❌ Admin account not found.');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`❌ Error checking admin: ${error.message}`);
    }
  };

  const clearStorage = () => {
    if (window.confirm('Are you sure you want to clear all localStorage data? This will remove all users and data.')) {
      localStorage.clear();
      setMessageType('success');
      setMessage('🗑️ All data cleared. You can now register the admin account again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Register Admin Account</h1>
        <p className="text-gray-600 mb-6">
          This tool will register the admin account in your browser's localStorage so you can log in to the admin panel.
        </p>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Admin Credentials:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Email:</strong> {adminCredentials.email}
            </li>
            <li>
              <strong>Password:</strong> {adminCredentials.password}
            </li>
            <li>
              <strong>Admin Code:</strong> {adminCredentials.adminCode}
            </li>
          </ul>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={registerAdmin}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register Admin Account'}
          </button>
          <button
            onClick={checkAdmin}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Check if Admin Exists
          </button>
          <button
            onClick={clearStorage}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Clear All Data (Reset)
          </button>
          <button
            onClick={() => navigate('/admin-login')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Go to Admin Login
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded mb-8 whitespace-pre-wrap font-mono text-sm ${
              messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Manual Registration (Alternative):</h3>
          <p className="text-gray-600 mb-4">
            If the button doesn't work, open your browser's Developer Tools (F12), go to the Console tab, and paste this code:
          </p>
          <pre className="bg-gray-100 p-4 rounded border border-gray-300 overflow-x-auto text-sm">
            {manualRegistrationCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
