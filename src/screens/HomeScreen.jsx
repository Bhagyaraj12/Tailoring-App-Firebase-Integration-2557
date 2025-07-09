import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiBell, FiGrid, FiClock, FiHeart, FiPhone, FiChevronRight, FiPackage } = FiIcons;

const categories = [
  {
    id: 'blouse',
    name: 'Blouse',
    icon: FiIcons.FiUser,
    basePrice: 500,
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'shirt',
    name: 'Shirt',
    icon: FiIcons.FiUser,
    basePrice: 600,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'kurti',
    name: 'Kurti',
    icon: FiIcons.FiUser,
    basePrice: 800,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'lehenga',
    name: 'Lehenga',
    icon: FiIcons.FiUser,
    basePrice: 2000,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'kidswear',
    name: 'Kidswear',
    icon: FiIcons.FiUser,
    basePrice: 300,
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: 'saree',
    name: 'Saree Blouse',
    icon: FiIcons.FiUser,
    basePrice: 450,
    gradient: 'from-indigo-500 to-purple-500'
  },
];

function HomeScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const handleCategorySelect = (category) => {
    console.log('Category selected:', category);
    
    // Reset any previous selections
    dispatch({ type: 'RESET_ORDER' });
    
    // Set the selected category
    dispatch({ type: 'SET_CATEGORY', payload: category });
    
    // Set base pricing
    dispatch({ 
      type: 'SET_PRICING', 
      payload: { 
        basePrice: category.basePrice, 
        totalPrice: category.basePrice 
      } 
    });
    
    // Navigate to design selection
    navigate('/design-selection');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'track':
        navigate('/order-tracking');
        break;
      case 'saved':
        // Navigate to saved designs
        break;
      case 'support':
        // Navigate to support
        break;
      default:
        break;
    }
  };

  return (
    <div className="mobile-container">
      <div className="screen-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hello, {state.user?.name || 'Customer'}!
            </h1>
            <p className="text-gray-600">What would you like to stitch today?</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiBell} className="text-gray-600" />
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="text-primary-600" />
            </div>
          </div>
        </motion.div>

        {/* Categories Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center mb-6"
        >
          <SafeIcon icon={FiGrid} className="text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Stitching Categories</h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategorySelect(category)}
              className="category-card bg-white rounded-xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-4`}>
                <SafeIcon icon={category.icon} className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-primary-600 font-medium">Starting ₹{category.basePrice}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => handleQuickAction('track')}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <SafeIcon icon={FiPackage} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Track Order</span>
              </div>
              <SafeIcon icon={FiChevronRight} className="text-gray-400" />
            </button>
            <button
              onClick={() => handleQuickAction('saved')}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <SafeIcon icon={FiHeart} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Saved Designs</span>
              </div>
              <SafeIcon icon={FiChevronRight} className="text-gray-400" />
            </button>
            <button
              onClick={() => handleQuickAction('support')}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <SafeIcon icon={FiPhone} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Contact Support</span>
              </div>
              <SafeIcon icon={FiChevronRight} className="text-gray-400" />
            </button>
          </div>
        </motion.div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>User: {state.user?.name || 'Not logged in'}</p>
            <p>User Role: {state.userRole || 'None'}</p>
            <p>Selected Category: {state.selectedCategory?.name || 'None'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;