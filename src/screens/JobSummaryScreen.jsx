import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';
import { createJob } from '../services/firebaseService';
import toast from 'react-hot-toast';

const { FiArrowLeft, FiCalendar, FiImage, FiEdit, FiClock, FiMapPin } = FiIcons;

function JobSummaryScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety check: if no category or design is selected, redirect to home
  useEffect(() => {
    if (!state.selectedCategory || !state.selectedDesign) {
      navigate('/home');
    }
  }, [state.selectedCategory, state.selectedDesign, navigate]);

  const handleSubmitOrder = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      toast.loading('Submitting your order...', { id: 'order-submit' });
      
      const jobData = {
        customerId: state.user?.uid || 'guest-user',
        customerName: state.user?.name || 'Guest User',
        customerEmail: state.user?.email || '',
        jobId: 'JOB' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        category: state.selectedCategory,
        design: state.selectedDesign,
        addOns: state.selectedAddOns || [],
        basePrice: state.basePrice,
        totalPrice: state.totalPrice + state.fastDeliveryCharge,
        fastDeliveryCharge: state.fastDeliveryCharge || 0,
        deliveryDate: state.selectedDeliveryDate || state.deliveryDate,
        measurementMethod: state.measurementMethod,
        measurements: state.measurements || {},
        measurementImage: state.measurementImage || null,
        pickupTime: state.pickupTime || null,
        status: 'pending_assignment'
      };
      
      const jobId = await createJob(jobData);
      
      toast.dismiss('order-submit');
      toast.success('Order submitted successfully!');
      
      navigate('/job-confirmation', { state: { jobId } });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.dismiss('order-submit');
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalPrice = state.totalPrice + (state.fastDeliveryCharge || 0);
  const deliveryDate = state.selectedDeliveryDate || state.deliveryDate;

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
            <h1 className="text-xl font-bold text-gray-800">Job Summary</h1>
            <p className="text-gray-600">Review your order details</p>
          </div>
          <div className="w-10 h-10"></div>
        </motion.div>

        {/* Order Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="summary-card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Category:</span>
              <span className="font-semibold text-gray-800">{state.selectedCategory?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Design:</span>
              <span className="font-semibold text-gray-800">{state.selectedDesign?.name}</span>
            </div>
            {state.selectedAddOns && state.selectedAddOns.length > 0 && (
              <div>
                <span className="text-gray-700">Add-ons:</span>
                <div className="mt-2 space-y-1">
                  {state.selectedAddOns.map((addOn) => (
                    <div key={addOn.id} className="flex justify-between items-center ml-4">
                      <span className="text-sm text-gray-600">• {addOn.name}</span>
                      <span className="text-sm font-medium text-gray-800">₹{addOn.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pricing Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="summary-card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-800">₹{state.totalPrice}</span>
            </div>
            {state.fastDeliveryCharge > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fast Delivery Charge:</span>
                <span className="font-semibold text-gray-800">₹{state.fastDeliveryCharge}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="font-bold text-primary-600 text-xl">₹{finalPrice}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="summary-card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Information</h3>
          <div className="flex items-center">
            <SafeIcon icon={FiCalendar} className="text-primary-600 mr-3" />
            <div>
              <p className="font-semibold text-gray-800">
                {deliveryDate ? format(deliveryDate, 'PPP') : 'Not specified'}
              </p>
              <p className="text-sm text-gray-600">
                {state.selectedDeliveryDate ? 'Custom delivery date' : 'Estimated delivery'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Measurement Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="summary-card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Measurement Details</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <SafeIcon 
                icon={state.measurementMethod === 'sample' ? FiImage : FiEdit} 
                className="text-primary-600 mr-3" 
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {state.measurementMethod === 'sample' ? 'Sample Image' : 'Manual Measurements'}
                </p>
                <p className="text-sm text-gray-600">
                  {state.measurementMethod === 'sample' ? 'Reference image provided' : 'Custom measurements entered'}
                </p>
              </div>
            </div>
            {state.pickupTime && (
              <div className="flex items-center">
                <SafeIcon icon={FiClock} className="text-primary-600 mr-3" />
                <div>
                  <p className="font-semibold text-gray-800">Pickup Scheduled</p>
                  <p className="text-sm text-gray-600">{state.pickupTime}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full btn-primary text-white font-medium py-3 px-4 rounded-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Submitting Order...</span>
              </div>
            ) : (
              'Submit Order'
            )}
          </motion.button>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/measurement')}
            className="w-full btn-secondary text-white font-medium py-3 px-4 rounded-lg"
          >
            Update Measurements
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default JobSummaryScreen;