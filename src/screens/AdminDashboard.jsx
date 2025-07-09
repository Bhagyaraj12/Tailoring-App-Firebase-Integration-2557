import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { 
  getPendingJobs, 
  getAvailableTailors, 
  assignJobToTailor, 
  getTailors,
  listenToJobs,
  createTailor 
} from '../services/firebaseService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { 
  FiUsers, 
  FiClipboard, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiTag, 
  FiPlus,
  FiAssign,
  FiEye,
  FiX
} = FiIcons;

function AdminDashboard() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('jobs');
  const [pendingJobs, setPendingJobs] = useState([]);
  const [availableTailors, setAvailableTailors] = useState([]);
  const [allTailors, setAllTailors] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [assignmentAmount, setAssignmentAmount] = useState('');
  const [selectedTailor, setSelectedTailor] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [newTailor, setNewTailor] = useState({
    name: '',
    phone: '',
    email: '',
    skillTags: [],
    address: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Real-time listener for pending jobs
    const unsubscribe = listenToJobs((jobs) => {
      setPendingJobs(jobs.filter(job => job.status === 'pending_assignment'));
    }, { status: 'pending_assignment' });

    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobs, tailors, allTailorsList] = await Promise.all([
        getPendingJobs(),
        getAvailableTailors(),
        getTailors()
      ]);
      
      setPendingJobs(jobs);
      setAvailableTailors(tailors);
      setAllTailors(allTailorsList);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleJobAssignment = async () => {
    if (!selectedTailor || !assignmentAmount) {
      toast.error('Please select a tailor and enter assignment amount');
      return;
    }

    try {
      setLoading(true);
      await assignJobToTailor(selectedJob.id, selectedTailor, parseFloat(assignmentAmount));
      toast.success('Job assigned successfully!');
      setShowJobModal(false);
      setSelectedJob(null);
      setSelectedTailor('');
      setAssignmentAmount('');
      fetchData();
    } catch (error) {
      toast.error('Failed to assign job');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTailor = async () => {
    if (!newTailor.name || !newTailor.phone) {
      toast.error('Name and phone are required');
      return;
    }

    try {
      setLoading(true);
      await createTailor(newTailor);
      toast.success('Tailor created successfully!');
      setShowTailorModal(false);
      setNewTailor({
        name: '',
        phone: '',
        email: '',
        skillTags: [],
        address: ''
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to create tailor');
    } finally {
      setLoading(false);
    }
  };

  const addSkillTag = (tag) => {
    if (tag && !newTailor.skillTags.includes(tag)) {
      setNewTailor({
        ...newTailor,
        skillTags: [...newTailor.skillTags, tag]
      });
    }
  };

  const removeSkillTag = (tag) => {
    setNewTailor({
      ...newTailor,
      skillTags: newTailor.skillTags.filter(t => t !== tag)
    });
  };

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

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage jobs and tailors</p>
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
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <SafeIcon icon={FiClipboard} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{pendingJobs.length}</p>
                <p className="text-sm text-gray-600">Pending Jobs</p>
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
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <SafeIcon icon={FiUsers} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{availableTailors.length}</p>
                <p className="text-sm text-gray-600">Available Tailors</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pending Jobs
          </button>
          <button
            onClick={() => setActiveTab('tailors')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tailors'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Tailors
          </button>
        </div>

        {/* Content */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {pendingJobs.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiClipboard} className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending jobs</p>
              </div>
            ) : (
              pendingJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {job.category?.name} - {job.design?.name}
                      </h3>
                      <p className="text-sm text-gray-600">Job ID: {job.jobId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">₹{job.totalPrice}</span>
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
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      <SafeIcon icon={FiAssign} className="inline mr-2" />
                      Assign Tailor
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        // Show job details modal
                      }}
                      className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      <SafeIcon icon={FiEye} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tailors' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">All Tailors</h3>
              <button
                onClick={() => setShowTailorModal(true)}
                className="bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="inline mr-2" />
                Add Tailor
              </button>
            </div>

            {allTailors.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiUsers} className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tailors registered</p>
              </div>
            ) : (
              allTailors.map((tailor, index) => (
                <motion.div
                  key={tailor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <SafeIcon icon={FiUser} className="text-gray-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{tailor.name}</h3>
                        <p className="text-sm text-gray-600">{tailor.phone}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(tailor.availabilityStatus)}`}>
                      {tailor.availabilityStatus?.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {tailor.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <SafeIcon icon={FiMail} className="mr-2" />
                        {tailor.email}
                      </div>
                    )}
                    {tailor.skillTags && tailor.skillTags.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <SafeIcon icon={FiTag} className="mr-2" />
                        <div className="flex flex-wrap gap-1">
                          {tailor.skillTags.map((skill, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Job Assignment Modal */}
        {showJobModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Assign Job to Tailor</h3>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={FiX} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Tailor
                  </label>
                  <select
                    value={selectedTailor}
                    onChange={(e) => setSelectedTailor(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Choose a tailor...</option>
                    {availableTailors.map((tailor) => (
                      <option key={tailor.id} value={tailor.id}>
                        {tailor.name} - {tailor.skillTags?.join(', ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={assignmentAmount}
                    onChange={(e) => setAssignmentAmount(e.target.value)}
                    placeholder="Enter assignment amount"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Job Details:</h4>
                  <p className="text-sm text-gray-600">
                    {selectedJob.category?.name} - {selectedJob.design?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Customer Amount: ₹{selectedJob.totalPrice}
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery: {selectedJob.deliveryDate ? format(selectedJob.deliveryDate.toDate(), 'PPP') : 'Not set'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJobAssignment}
                    disabled={loading || !selectedTailor || !assignmentAmount}
                    className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Assigning...' : 'Assign Job'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Tailor Modal */}
        {showTailorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Tailor</h3>
                <button
                  onClick={() => setShowTailorModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={FiX} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newTailor.name}
                    onChange={(e) => setNewTailor({ ...newTailor, name: e.target.value })}
                    placeholder="Enter tailor name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newTailor.phone}
                    onChange={(e) => setNewTailor({ ...newTailor, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newTailor.email}
                    onChange={(e) => setNewTailor({ ...newTailor, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newTailor.skillTags.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center">
                        {skill}
                        <button
                          onClick={() => removeSkillTag(skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <SafeIcon icon={FiX} className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {['Blouse', 'Shirt', 'Kurti', 'Lehenga', 'Embroidery', 'Handloom'].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkillTag(skill)}
                        disabled={newTailor.skillTags.includes(skill)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={newTailor.address}
                    onChange={(e) => setNewTailor({ ...newTailor, address: e.target.value })}
                    placeholder="Enter address"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTailorModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTailor}
                    disabled={loading || !newTailor.name || !newTailor.phone}
                    className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Tailor'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;