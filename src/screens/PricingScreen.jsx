import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, format } from 'date-fns';

const { FiArrowLeft, FiCalendar, FiClock, FiTruck } = FiIcons;

function PricingScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState(state.selectedDeliveryDate || null);
  const [estimatedDelivery, setEstimatedDelivery] = useState(state.deliveryDate || null);
  const [fastDeliveryCharge, setFastDeliveryCharge] = useState(state.fastDeliveryCharge || 0);

  // Safety check: if no category or design is selected, redirect to home
  useEffect(() => {
    if (!state.selectedCategory || !state.selectedDesign) {
      navigate('/home');
    }
  }, [state.selectedCategory, state.selectedDesign, navigate]);

  useEffect(() => {
    // Calculate estimated delivery date based on selected add-ons
    const baseDeliveryDays = 7;
    const addOnDays = state.selectedAddOns.length * 2;
    const totalDays = baseDeliveryDays + addOnDays;
    const estimatedDate = addDays(new Date(), totalDays);
    
    setEstimatedDelivery(estimatedDate);
    dispatch({ type: 'SET_DELIVERY_DATE', payload: estimatedDate });

    // If a date was already selected, recalculate fast delivery charge
    if (selectedDate) {
      handleDateChange(selectedDate);
    }
  }, [state.selectedAddOns, dispatch]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    dispatch({ type: 'SET_SELECTED_DELIVERY_DATE', payload: date });

    // Calculate fast delivery charge if selected date is earlier than estimated
    if (date && estimatedDelivery && date < estimatedDelivery) {
      const daysDifference = Math.ceil((estimatedDelivery - date) / (1000 * 60 * 60 * 24));
      const charge = daysDifference * 100; // ₹100 per day for fast delivery
      setFastDeliveryCharge(charge);
      dispatch({ type: 'SET_FAST_DELIVERY_CHARGE', payload: charge });
    } else {
      setFastDeliveryCharge(0);
      dispatch({ type: 'SET_FAST_DELIVERY_CHARGE', payload: 0 });
    }
  };

  const handleContinue = () => {
    // Ensure all pricing information is updated before navigation
    const finalPrice = state.totalPrice + fastDeliveryCharge;
    dispatch({ 
      type: 'SET_PRICING', 
      payload: { 
        basePrice: state.basePrice, 
        totalPrice: finalPrice 
      }
    });
    
    navigate('/measurement');
  };

  const finalPrice = state.totalPrice + fastDeliveryCharge;

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
            <h1 className="text-xl font-bold text-gray-800">Pricing & Delivery</h1>
            <p className="text-gray-600">Choose your delivery date</p>
          </div>
          <div className="w-10 h-10"></div>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-lg mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{state.selectedCategory?.name}</span>
              <span className="font-semibold text-gray-800">₹{state.basePrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{state.selectedDesign?.name}</span>
              <span className="font-semibold text-gray-800">₹{state.selectedDesign?.price || 0}</span>
            </div>
            {state.selectedAddOns && state.selectedAddOns.map((addOn) => (
              <div key={addOn.id} className="flex justify-between items-center">
                <span className="text-gray-700">{addOn.name}</span>
                <span className="font-semibold text-gray-800">₹{addOn.price}</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Subtotal:</span>
                <span className="font-bold text-gray-800">₹{state.totalPrice}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery Options */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-lg mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Options</h3>
          
          {/* Estimated Delivery */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center">
              <SafeIcon icon={FiTruck} className="text-gray-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-800">Standard Delivery</p>
                <p className="text-sm text-gray-600">
                  {estimatedDelivery ? format(estimatedDelivery, 'PPP') : 'Calculating...'}
                </p>
              </div>
            </div>
            <span className="text-green-600 font-semibold">Free</span>
          </div>

          {/* Custom Date Picker */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Choose Custom Delivery Date (Optional)
            </label>
            <div className="relative">
              <DatePicker 
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
                maxDate={addDays(new Date(), 60)}
                dateFormat="PPP"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholderText="Select delivery date"
              />
              <SafeIcon 
                icon={FiCalendar} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
            </div>
          </div>

          {/* Fast Delivery Charge */}
          {fastDeliveryCharge > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SafeIcon icon={FiClock} className="text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-semibold">Fast Delivery Charge</span>
                </div>
                <span className="text-yellow-800 font-bold">₹{fastDeliveryCharge}</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                For delivery before the estimated date
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Final Price */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-lg mb-6"
        >
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Final Total:</span>
            <span className="font-bold text-primary-600 text-2xl">₹{finalPrice}</span>
          </div>
          {fastDeliveryCharge > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Includes fast delivery charge of ₹{fastDeliveryCharge}
            </p>
          )}
        </motion.div>

        {/* Continue Button */}
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full btn-primary text-white font-medium py-3 px-4 rounded-lg"
        >
          Continue to Measurements
        </motion.button>
      </div>
    </div>
  );
}

export default PricingScreen;