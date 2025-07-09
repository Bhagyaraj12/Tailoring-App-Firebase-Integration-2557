import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiPhone, FiLock, FiArrowRight, FiMail, FiUser, FiUserCheck } = FiIcons;

function AuthScreen() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [userType, setUserType] = useState('customer'); // 'customer', 'admin', 'tailor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mock login success function - doesn't validate anything
  const simulateSuccessfulAuth = (role, displayName) => {
    setLoading(true);
    
    // Generate mock user data
    const mockUserId = 'user-' + Math.random().toString(36).substr(2, 9);
    const email = formData.email || `${role}@example.com`;
    const name = displayName || formData.name || email.split('@')[0];
    
    // Simulate network delay
    setTimeout(() => {
      // Create mock user data
      const userData = {
        uid: mockUserId,
        email: email,
        name: name,
        role: role
      };
      
      // Update context
      dispatch({ type: 'SET_USER', payload: userData });
      dispatch({ type: 'SET_USER_ROLE', payload: role });
      
      // Show success message
      toast.success(`Welcome, ${name}!`);
      
      // Navigate based on role
      switch (role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'tailor':
          navigate('/tailor-dashboard');
          break;
        default:
          navigate('/home');
      }
      
      setLoading(false);
    }, 800); // Simulate network delay
  };

  const handleLogin = () => {
    // Always succeed, no validation
    simulateSuccessfulAuth('customer', formData.name);
  };

  const handleRegister = () => {
    // Always succeed, no validation
    simulateSuccessfulAuth(userType, formData.name);
  };

  const handleGuestLogin = () => {
    // Generate a random guest name
    const guestName = `Guest${Math.floor(Math.random() * 10000)}`;
    simulateSuccessfulAuth('customer', guestName);
  };

  const handleQuickLogin = (role) => {
    // Auto-generate name based on role
    const name = role.charAt(0).toUpperCase() + role.slice(1);
    simulateSuccessfulAuth(role, name);
  };

  return (
    <div className="mobile-container">
      <div className="screen-container flex flex-col justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiIcons.FiScissors} className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Custom Tailoring</h1>
          <p className="text-gray-600">Professional stitching services</p>
        </motion.div>

        {/* Quick Login Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Quick Login Options</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Customer
            </button>
            <button
              onClick={() => handleQuickLogin('tailor')}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Tailor
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Admin
            </button>
          </div>
          <button
            onClick={handleGuestLogin}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <SafeIcon icon={FiUserCheck} className="mr-2" />
            Continue as Guest
          </button>
        </motion.div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMode === 'login'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMode === 'register'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* User Type Selection (only for registration) */}
        {authMode === 'register' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register as:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'customer', label: 'Customer' },
                { value: 'tailor', label: 'Tailor' },
                { value: 'admin', label: 'Admin' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setUserType(type.value)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    userType === type.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Name field (only for registration) */}
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Phone field (only for registration) */}
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <SafeIcon icon={FiPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password or leave blank"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={authMode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full btn-primary text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {authMode === 'login' ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                <SafeIcon icon={FiArrowRight} className="ml-2" />
              </div>
            )}
          </motion.button>
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {authMode === 'login' ? 
              "Don't have an account? No worries, we'll create one for you." :
              "Just need a username to create an account. All fields are optional."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;