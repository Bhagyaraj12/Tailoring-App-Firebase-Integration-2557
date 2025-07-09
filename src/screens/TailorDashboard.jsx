import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { getAssignedJobs, updateJobStatus, listenToJobs } from '../services/firebaseService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { 
  FiClipboard, 
  FiClock, 
  FiCheckCircle, 
  FiPlay, 
  FiCheck, 
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiTag
} = FiIcons;

function TailorDashboard() {
  const { state } = useApp();
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  useEffect(() => {
    if (state.user?.uid) {
      fetchAssignedJobs();
      
      // Real-time listener for assigned jobs
      const unsubscribe = listenToJobs((jobs) => {
        setAssignedJobs(jobs);
      }, { tailorId: state.user.uid });

      return () => unsubscribe();
    }
  }, [state.user]);

  const fetchAssignedJobs = async () => {
    try {
      setLoading(true);
      const jobs = await getAssignedJobs(state.user.uid);
      setAssignedJobs(jobs);
    } catch (error) {
      toast.error('Failed to fetch assigned jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      setLoading(true);
      const additionalData = {};
      
      if (newStatus === 'in_progress') {
        additionalData.startedAt = new Date();
      } else if (newStatus === 'completed') {
        additionalData.completedAt = new Date();
      }

      await updateJobStatus(jobId, newStatus, additionalData);
      toast.success(`Job status updated to ${newStatus.replace('_', ' ')}`);
      fetchAssignedJobs();
    } catch (error) {
      toast.error('Failed to update job status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'assigned': return FiClock;
      case 'in_progress': return FiPlay;
      case 'completed': return FiCheckCircle;
      case 'delivered': return FiCheck;
      default: return FiClipboard;
    }
  };

  const canUpdateStatus = (currentStatus) => {
    return currentStatus === 'assigned' || currentStatus === 'in_progress';
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'assigned': return 'in_progress';
      case 'in_progress': return 'completed';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus) => {
    switch (currentStatus) {
      case 'assigned': return 'Start Work';
      case 'in_progress': return 'Mark Complete';
      default: return null;
    }
  };

  const jobStats = {
    assigned: assignedJobs.filter(job => job.status === 'assigned').length,
    inProgress: assignedJobs.filter(job => job.status === 'in_progress').length,
    completed: assignedJobs.filter(job => job.status === 'completed').length,
    totalEarnings: assignedJobs.reduce((sum, job) => sum + (job.assignmentAmount || 0), 0)
  };

  return (
    <div className="mobile-container">
      <div className="screen-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tailor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {state.user?.name || 'Tailor'}!</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <SafeIcon icon={FiClock} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{jobStats.assigned}</p>
                <p className="text-sm text-gray-600">New Jobs</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <SafeIcon icon={FiPlay} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{jobStats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <SafeIcon icon={FiCheckCircle} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{jobStats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <SafeIcon icon={FiDollarSign} className="text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">₹{jobStats.totalEarnings}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Jobs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Assigned Jobs</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : assignedJobs.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={FiClipboard} className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No jobs assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {job.category?.name} - {job.design?.name}
                      </h4>
                      <p className="text-sm text-gray-600">Job ID: {job.jobId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      <SafeIcon icon={getStatusIcon(job.status)} className="inline mr-1" />
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your Payment:</span>
                      <span className="font-medium text-green-600">₹{job.assignmentAmount || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Date:</span>
                      <span className="font-medium">
                        {job.deliveryDate ? format(job.deliveryDate.toDate(), 'PPP') : 'Not set'}
                      </span>
                    </div>
                    {job.addOns && job.addOns.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Add-ons:</span>
                        <span className="font-medium">{job.addOns.length} items</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowJobModal(true);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </button>
                    
                    {canUpdateStatus(job.status) && (
                      <button
                        onClick={() => handleStatusUpdate(job.id, getNextStatus(job.status))}
                        disabled={loading}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        {getNextStatusLabel(job.status)}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Job Details Modal */}
        {showJobModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Job Details</h3>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={FiIcons.FiX} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job ID:</span>
                      <span className="font-medium">{selectedJob.jobId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{selectedJob.category?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Design:</span>
                      <span className="font-medium">{selectedJob.design?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Payment:</span>
                      <span className="font-medium text-green-600">₹{selectedJob.assignmentAmount || 0}</span>
                    </div>
                  </div>
                </div>

                {selectedJob.addOns && selectedJob.addOns.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Add-ons</h4>
                    <div className="space-y-1">
                      {selectedJob.addOns.map((addon, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{addon.name}</span>
                          <span className="font-medium">₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Delivery & Measurements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Date:</span>
                      <span className="font-medium">
                        {selectedJob.deliveryDate ? format(selectedJob.deliveryDate.toDate(), 'PPP') : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Measurement Method:</span>
                      <span className="font-medium">
                        {selectedJob.measurementMethod === 'sample' ? 'Sample Image' : 'Manual Entry'}
                      </span>
                    </div>
                    {selectedJob.pickupTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Time:</span>
                        <span className="font-medium">{selectedJob.pickupTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedJob.measurements && Object.keys(selectedJob.measurements).length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Measurements</h4>
                    <div className="space-y-1">
                      {Object.entries(selectedJob.measurements).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="font-medium">{value} inches</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  {canUpdateStatus(selectedJob.status) && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedJob.id, getNextStatus(selectedJob.status));
                        setShowJobModal(false);
                      }}
                      disabled={loading}
                      className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {getNextStatusLabel(selectedJob.status)}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TailorDashboard;