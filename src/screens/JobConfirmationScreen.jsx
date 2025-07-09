import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiCheckCircle, FiHome, FiEdit, FiClock, FiPhone } = FiIcons;

function JobConfirmationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();
  
  // Generate a random job ID if not provided via location state
  const jobId = location.state?.jobId || 'JOB' + Math.random().toString(36).substr(2, 9).toUpperCase();

  useEffect(() => {
    dispatch({ type: 'SET_JOB_ID', payload: jobId });
  }, [jobId, dispatch]);

  const handleNewOrder = () => {
    dispatch({ type: 'RESET_ORDER' });
    navigate('/home');
  };

  const handleUpdateMeasurements = () => {
    navigate('/measurement');
  };

  const handleReschedulePickup = () => {
    navigate('/measurement');
  };

  const finalPrice = state.totalPrice + (state.fastDeliveryCharge || 0);
  const deliveryDate = state.selectedDeliveryDate || state.deliveryDate;

  return (
    <div className="mobile-container">
      <div className="screen-container">
        {/* Success Animation */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCheckCircle} className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Your tailoring order has been successfully placed</p>
        </motion.div>

        {/* Job Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="summary-card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Job ID:</span>
              <span className="font-bold text-primary-600 text-lg">{jobId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Amount:</span>
              <span className="font-bold text-gray-800 text-lg">₹{finalPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Estimated Delivery:</span>
              <span className="font-semibold text-gray-800">
                {deliveryDate ? format(deliveryDate, 'PPP') : 'To be confirmed'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Status:</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Order Placed
              </span>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="summary-card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{state.selectedCategory?.name}</span>
              <span className="font-semibold text-gray-800">{state.selectedDesign?.name}</span>
            </div>
            {state.selectedAddOns && state.selectedAddOns.length > 0 && (
              <div>
                <span className="text-gray-700">Add-ons:</span>
                <div className="mt-1 space-y-1">
                  {state.selectedAddOns.map((addOn) => (
                    <div key={addOn.id} className="text-sm text-gray-600 ml-4">
                      • {addOn.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Measurement Method:</span>
              <span className="font-semibold text-gray-800">
                {state.measurementMethod === 'sample' ? 'Sample Image' : 'Manual Entry'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="summary-card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <p className="text-gray-700">We will contact you within 24 hours to confirm details</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <p className="text-gray-700">
                {state.measurementMethod === 'sample' && state.pickupTime
                  ? 'We will pickup your sample during the scheduled time'
                  : 'Our team will begin working on your order'}
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <p className="text-gray-700">You will receive regular updates on your order progress</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewOrder}
            className="w-full btn-primary text-white font-medium py-3 px-4 rounded-lg"
          >
            <div className="flex items-center justify-center">
              <SafeIcon icon={FiHome} className="mr-2" />
              Place New Order
            </div>
          </motion.button>
          <div className="grid grid-cols-2 gap-3">
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateMeasurements}
              className="btn-secondary text-white font-medium py-3 px-4 rounded-lg"
            >
              <div className="flex items-center justify-center">
                <SafeIcon icon={FiEdit} className="mr-2" />
                Update Measurements
              </div>
            </motion.button>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReschedulePickup}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-center">
                <SafeIcon icon={FiClock} className="mr-2" />
                Reschedule Pickup
              </div>
            </motion.button>
          </div>
        </div>

        {/* Contact Support */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <button className="text-primary-600 font-medium flex items-center justify-center mx-auto">
            <SafeIcon icon={FiPhone} className="mr-2" />
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default JobConfirmationScreen;