import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  userRole: null, // 'customer', 'admin', 'tailor'
  selectedCategory: null,
  selectedDesign: null,
  selectedAddOns: [],
  basePrice: 0,
  totalPrice: 0,
  deliveryDate: null,
  selectedDeliveryDate: null,
  fastDeliveryCharge: 0,
  measurementMethod: null,
  measurementImage: null,
  measurements: {},
  pickupTime: null,
  jobId: null,
  tailors: [],
  jobs: [],
  assignedJobs: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
      
    case 'SET_USER_ROLE':
      return { ...state, userRole: action.payload };
      
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        selectedDesign: null, // Reset design when category changes
        selectedAddOns: [], // Reset add-ons when category changes
        basePrice: action.payload?.basePrice || state.basePrice,
        totalPrice: action.payload?.basePrice || state.basePrice
      };
      
    case 'SET_DESIGN':
      const designPrice = action.payload?.price || 0;
      const newTotalWithDesign = state.basePrice + designPrice;
      return {
        ...state,
        selectedDesign: action.payload,
        totalPrice: newTotalWithDesign
      };
      
    case 'SET_ADD_ONS':
      return { ...state, selectedAddOns: action.payload };
      
    case 'SET_PRICING':
      return {
        ...state,
        basePrice: action.payload.basePrice,
        totalPrice: action.payload.totalPrice
      };
      
    case 'SET_DELIVERY_DATE':
      return { ...state, deliveryDate: action.payload };
      
    case 'SET_SELECTED_DELIVERY_DATE':
      return { ...state, selectedDeliveryDate: action.payload };
      
    case 'SET_FAST_DELIVERY_CHARGE':
      return { ...state, fastDeliveryCharge: action.payload };
      
    case 'SET_MEASUREMENT_METHOD':
      return { ...state, measurementMethod: action.payload };
      
    case 'SET_MEASUREMENT_IMAGE':
      return { ...state, measurementImage: action.payload };
      
    case 'SET_MEASUREMENTS':
      return { ...state, measurements: action.payload };
      
    case 'SET_PICKUP_TIME':
      return { ...state, pickupTime: action.payload };
      
    case 'SET_JOB_ID':
      return { ...state, jobId: action.payload };
      
    case 'SET_TAILORS':
      return { ...state, tailors: action.payload };
      
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
      
    case 'SET_ASSIGNED_JOBS':
      return { ...state, assignedJobs: action.payload };
      
    case 'UPDATE_JOB_STATUS':
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.jobId ? 
            { ...job, status: action.payload.status } : 
            job
        ),
        assignedJobs: state.assignedJobs.map(job => 
          job.id === action.payload.jobId ? 
            { ...job, status: action.payload.status } : 
            job
        )
      };
      
    case 'RESET_ORDER':
      return {
        ...state,
        selectedCategory: null,
        selectedDesign: null,
        selectedAddOns: [],
        basePrice: 0,
        totalPrice: 0,
        deliveryDate: null,
        selectedDeliveryDate: null,
        fastDeliveryCharge: 0,
        measurementMethod: null,
        measurementImage: null,
        measurements: {},
        pickupTime: null,
        jobId: null
      };
      
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}