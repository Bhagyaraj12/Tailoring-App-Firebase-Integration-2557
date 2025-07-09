import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiCheck } = FiIcons;

const addOns = [
  {
    id: 'computer-embroidery',
    name: 'Computer Embroidery',
    price: 200,
    description: 'Machine embroidery with intricate patterns'
  },
  {
    id: 'handloom-work',
    name: 'Handloom Work',
    price: 300,
    description: 'Traditional handwoven details'
  },
  {
    id: 'lacework',
    name: 'Lacework',
    price: 150,
    description: 'Delicate lace embellishments'
  },
  {
    id: 'mirror-work',
    name: 'Mirror Work',
    price: 250,
    description: 'Traditional mirror embellishments'
  },
  {
    id: 'thread-work',
    name: 'Thread Work',
    price: 180,
    description: 'Decorative thread embroidery'
  },
  {
    id: 'stone-work',
    name: 'Stone Work',
    price: 400,
    description: 'Precious stone embellishments'
  },
];

function AddOnWorkScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedAddOns, setSelectedAddOns] = useState(state.selectedAddOns || []);

  // Initialize from context if available
  useEffect(() => {
    if (state.selectedAddOns && state.selectedAddOns.length > 0) {
      setSelectedAddOns(state.selectedAddOns);
    }
  }, [state.selectedAddOns]);

  const handleAddOnToggle = (addOn) => {
    const isSelected = selectedAddOns.find(item => item.id === addOn.id);
    let newSelectedAddOns;
    
    if (isSelected) {
      newSelectedAddOns = selectedAddOns.filter(item => item.id !== addOn.id);
    } else {
      newSelectedAddOns = [...selectedAddOns, addOn];
    }
    
    setSelectedAddOns(newSelectedAddOns);
    dispatch({ type: 'SET_ADD_ONS', payload: newSelectedAddOns });
    
    // Calculate new total price
    const addOnTotal = newSelectedAddOns.reduce((sum, item) => sum + item.price, 0);
    const baseTotal = state.basePrice + (state.selectedDesign?.price || 0);
    const newTotalPrice = baseTotal + addOnTotal;
    
    dispatch({ 
      type: 'SET_PRICING', 
      payload: { 
        basePrice: state.basePrice, 
        totalPrice: newTotalPrice 
      }
    });
  };

  const handleContinue = () => {
    // Ensure state is properly updated before navigation
    dispatch({ type: 'SET_ADD_ONS', payload: selectedAddOns });
    
    // Calculate final price including add-ons
    const addOnTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
    const baseTotal = state.basePrice + (state.selectedDesign?.price || 0);
    const newTotalPrice = baseTotal + addOnTotal;
    
    dispatch({ 
      type: 'SET_PRICING', 
      payload: { 
        basePrice: state.basePrice, 
        totalPrice: newTotalPrice 
      }
    });
    
    navigate('/pricing');
  };

  // Safety check: if no category or design is selected, redirect to home
  useEffect(() => {
    if (!state.selectedCategory || !state.selectedDesign) {
      navigate('/home');
    }
  }, [state.selectedCategory, state.selectedDesign, navigate]);

  const addOnTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mobile-container">
      <div className="screen-container">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <SafeIcon icon={FiArrowLeft} className="text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">Add-On Work</h1>
            <p className="text-gray-600">Select additional services</p>
          </div>
          <div className="w-10 h-10"></div>
        </motion.div>

        {/* Add-ons List */}
        <div className="space-y-4 mb-6">
          {addOns.map((addOn, index) => {
            const isSelected = selectedAddOns.find(item => item.id === addOn.id);
            return (
              <motion.div
                key={addOn.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAddOnToggle(addOn)}
                className={`bg-white rounded-xl p-4 shadow-lg cursor-pointer transition-all ${
                  isSelected ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                        isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <SafeIcon icon={FiCheck} className="text-white text-sm" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{addOn.name}</h3>
                      <p className="text-sm text-gray-600">{addOn.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">+₹{addOn.price}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl p-4 shadow-lg mb-6"
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Base Price:</span>
              <span className="font-semibold text-gray-800">₹{state.basePrice + (state.selectedDesign?.price || 0)}</span>
            </div>
            {selectedAddOns.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Add-ons ({selectedAddOns.length}):</span>
                <span className="font-semibold text-gray-800">₹{addOnTotal}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="font-bold text-primary-600 text-xl">₹{(state.basePrice + (state.selectedDesign?.price || 0)) + addOnTotal}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full btn-primary text-white font-medium py-3 px-4 rounded-lg"
        >
          Continue to Pricing
        </motion.button>
      </div>
    </div>
  );
}

export default AddOnWorkScreen;