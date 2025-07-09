import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { getJobs, listenToJobs } from '../services/firebaseService';
import { format } from 'date-fns';

const { 
  FiArrowLeft, 
  FiClock, 
  FiUser, 
  FiCheck, 
  FiTruck, 
  FiPackage,
  FiPhone,
  FiRefreshCw
} = FiIcons;

function OrderTrackingScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [customerJobs, setCustomerJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.user?.uid) {
      // Real-time listener for customer jobs
      const unsubscribe = listenToJobs((jobs) => {
        setCustomerJobs(jobs);
        setLoading(false);
      }, { customerId: state.user.uid });

      return () => unsubscribe();
    }
  }, [state.user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_assignment': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_assignment': return FiClock;
      case 'assigned': return FiUser;
      case 'in_progress': return FiRefreshCw;
      case 'completed': return FiCheck;
      case 'delivered': return FiTruck;
      default: return FiPackage;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending_assignment': return 'Your order is waiting to be assigned to a tailor';
      case 'assigned': return 'Your order has been assigned to a tailor';
      case 'in_progress': return 'Your order is being worked on';
      case 'completed': return 'Your order has been completed and is ready for delivery';
      case 'delivered': return 'Your order has been delivered';
      default: return 'Order status unknown';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'pending_assignment': return 20;
      case 'assigned': return 40;
      case 'in_progress': return 70;
      case 'completed': return 90;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="screen-container flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-gray-800">Track Orders</h1>
            <p className="text-gray-600">Monitor your order progress</p>
          </div>
          <div className="w-10 h-10"></div>
        </motion.div>

        {/* Orders List */}
        {customerJobs.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiPackage} className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">When you place an order, you can track its progress here</p>
            <button
              onClick={() => navigate('/home')}
              className="btn-primary text-white px-6 py-3 rounded-lg font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {customerJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Job Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {job.category?.name} - {job.design?.name}
                      </h3>
                      <p className="text-sm text-gray-600">Job ID: {job.jobId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(job.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(job.status)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={getStatusIcon(job.status)} className="mr-2" />
                    <span>{getStatusMessage(job.status)}</span>
                  </div>
                </div>

                {/* Job Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium text-gray-800">
                        {job.createdAt ? format(job.createdAt.toDate(), 'PPP') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Date</p>
                      <p className="font-medium text-gray-800">
                        {job.deliveryDate ? format(job.deliveryDate.toDate(), 'PPP') : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-green-600">₹{job.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Add-ons</p>
                      <p className="font-medium text-gray-800">
                        {job.addOns ? job.addOns.length : 0} items
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Order Timeline</h4>
                    <div className="space-y-3">
                      {/* Order Placed */}
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Order Placed</p>
                          <p className="text-xs text-gray-600">
                            {job.createdAt ? format(job.createdAt.toDate(), 'PPp') : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Assigned */}
                      {job.assignedAt && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Assigned to Tailor</p>
                            <p className="text-xs text-gray-600">
                              {format(job.assignedAt.toDate(), 'PPp')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* In Progress */}
                      {job.startedAt && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-600 rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Work Started</p>
                            <p className="text-xs text-gray-600">
                              {format(job.startedAt.toDate(), 'PPp')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Completed */}
                      {job.completedAt && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Work Completed</p>
                            <p className="text-xs text-gray-600">
                              {format(job.completedAt.toDate(), 'PPp')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Delivered */}
                      {job.deliveredAt && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Order Delivered</p>
                            <p className="text-xs text-gray-600">
                              {format(job.deliveredAt.toDate(), 'PPp')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                    <button className="bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                      <SafeIcon icon={FiPhone} className="inline mr-2" />
                      Support
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTrackingScreen;