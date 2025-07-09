// Mock Collections
const TAILORS_COLLECTION = 'tailors';
const JOBS_COLLECTION = 'jobs';
const USERS_COLLECTION = 'users';

// Mock database
const mockDb = {
  users: [],
  tailors: [
    { 
      id: 'mock-tailor-1', 
      name: 'John Smith', 
      phone: '1234567890', 
      skillTags: ['Shirt', 'Kurti'],
      availabilityStatus: 'available',
      isActive: true 
    },
    { 
      id: 'mock-tailor-2', 
      name: 'Sarah Johnson', 
      phone: '9876543210', 
      skillTags: ['Blouse', 'Lehenga'],
      availabilityStatus: 'available',
      isActive: true 
    }
  ],
  jobs: [
    {
      id: 'mock-job-1',
      jobId: 'JOB12345',
      category: { name: 'Shirt', id: 'shirt' },
      design: { name: 'Formal Shirt', id: 'formal' },
      status: 'pending_assignment',
      totalPrice: 750,
      createdAt: { toDate: () => new Date() },
      deliveryDate: { toDate: () => new Date(Date.now() + 7*24*60*60*1000) },
      customerId: 'user123',
      addOns: []
    },
    {
      id: 'mock-job-2',
      jobId: 'JOB67890',
      category: { name: 'Blouse', id: 'blouse' },
      design: { name: 'Boat Neck', id: 'boat-neck' },
      status: 'pending_assignment',
      totalPrice: 950,
      createdAt: { toDate: () => new Date() },
      deliveryDate: { toDate: () => new Date(Date.now() + 10*24*60*60*1000) }
    }
  ]
};

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// User Management
export const createUser = async (userData) => {
  await delay(500);
  const id = generateId();
  const user = {
    id,
    ...userData,
    createdAt: { toDate: () => new Date() },
    updatedAt: { toDate: () => new Date() }
  };
  mockDb.users.push(user);
  return id;
};

export const getUserRole = async (userId) => {
  await delay(300);
  const user = mockDb.users.find(u => u.uid === userId);
  return user?.role || 'customer';
};

// Tailor Management
export const createTailor = async (tailorData) => {
  await delay(500);
  const id = generateId();
  const tailor = {
    id,
    ...tailorData,
    createdAt: { toDate: () => new Date() },
    isActive: true,
    availabilityStatus: 'available'
  };
  mockDb.tailors.push(tailor);
  return id;
};

export const getTailors = async () => {
  await delay(500);
  return [...mockDb.tailors];
};

export const getAvailableTailors = async () => {
  await delay(500);
  return mockDb.tailors.filter(t => t.availabilityStatus === 'available' && t.isActive);
};

export const updateTailorAvailability = async (tailorId, status) => {
  await delay(300);
  const tailor = mockDb.tailors.find(t => t.id === tailorId);
  if (tailor) {
    tailor.availabilityStatus = status;
    tailor.updatedAt = { toDate: () => new Date() };
  }
};

// Job Management
export const createJob = async (jobData) => {
  await delay(500);
  const id = generateId();
  const jobId = jobData.jobId || `JOB${generateId().toUpperCase()}`;
  const job = {
    id,
    jobId,
    ...jobData,
    status: 'pending_assignment',
    createdAt: { toDate: () => new Date() },
    updatedAt: { toDate: () => new Date() }
  };
  mockDb.jobs.push(job);
  return jobId;
};

export const getJobs = async (filters = {}) => {
  await delay(500);
  let filteredJobs = [...mockDb.jobs];
  
  if (filters.status) {
    filteredJobs = filteredJobs.filter(job => job.status === filters.status);
  }
  
  if (filters.customerId) {
    filteredJobs = filteredJobs.filter(job => job.customerId === filters.customerId);
  }
  
  if (filters.tailorId) {
    filteredJobs = filteredJobs.filter(job => job.tailorId === filters.tailorId);
  }
  
  return filteredJobs;
};

export const getPendingJobs = async () => {
  await delay(500);
  return mockDb.jobs.filter(job => job.status === 'pending_assignment');
};

export const getAssignedJobs = async (tailorId) => {
  await delay(500);
  return mockDb.jobs.filter(job => 
    job.tailorId === tailorId && 
    ['assigned', 'in_progress', 'completed'].includes(job.status)
  );
};

export const assignJobToTailor = async (jobId, tailorId, assignmentAmount) => {
  await delay(500);
  const job = mockDb.jobs.find(j => j.id === jobId);
  if (job) {
    job.tailorId = tailorId;
    job.assignmentAmount = assignmentAmount;
    job.status = 'assigned';
    job.assignedAt = { toDate: () => new Date() };
    job.updatedAt = { toDate: () => new Date() };
  }
};

export const updateJobStatus = async (jobId, status, additionalData = {}) => {
  await delay(500);
  const job = mockDb.jobs.find(j => j.id === jobId);
  if (job) {
    job.status = status;
    job.updatedAt = { toDate: () => new Date() };
    
    Object.keys(additionalData).forEach(key => {
      if (key === 'startedAt' || key === 'completedAt') {
        job[key] = { toDate: () => new Date() };
      } else {
        job[key] = additionalData[key];
      }
    });
  }
};

// Real-time listeners (simulated)
export const listenToJobs = (callback, filters = {}) => {
  const getFilteredJobs = () => {
    let filteredJobs = [...mockDb.jobs];
    
    if (filters.status) {
      filteredJobs = filteredJobs.filter(job => job.status === filters.status);
    }
    
    if (filters.customerId) {
      filteredJobs = filteredJobs.filter(job => job.customerId === filters.customerId);
    }
    
    if (filters.tailorId) {
      filteredJobs = filteredJobs.filter(job => job.tailorId === filters.tailorId);
    }
    
    return filteredJobs;
  };
  
  const timeoutId = setTimeout(() => {
    callback(getFilteredJobs());
  }, 500);
  
  const intervalId = setInterval(() => {
    callback(getFilteredJobs());
  }, 10000);
  
  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
};

export const listenToTailors = (callback) => {
  const timeoutId = setTimeout(() => {
    callback([...mockDb.tailors]);
  }, 500);
  
  const intervalId = setInterval(() => {
    callback([...mockDb.tailors]);
  }, 10000);
  
  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
};