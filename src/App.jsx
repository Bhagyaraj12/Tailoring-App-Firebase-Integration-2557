import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Screens - using dynamic imports to avoid potential issues
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import AdminDashboard from './screens/AdminDashboard';
import TailorDashboard from './screens/TailorDashboard';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import DesignSelectionScreen from './screens/DesignSelectionScreen';
import AddOnWorkScreen from './screens/AddOnWorkScreen';
import PricingScreen from './screens/PricingScreen';
import MeasurementScreen from './screens/MeasurementScreen';
import JobSummaryScreen from './screens/JobSummaryScreen';
import JobConfirmationScreen from './screens/JobConfirmationScreen';

import './App.css';

function AppContent() {
  const { state } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading toast
    const loadingToast = toast.loading('Loading application...');
    
    // Simulate loading delay for app initialization
    const timer = setTimeout(() => {
      setLoading(false);
      toast.dismiss(loadingToast);
    }, 1000);

    return () => {
      clearTimeout(timer);
      toast.dismiss(loadingToast);
    };
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          <p>Loading...</p>
        </div>
      );
    }
    
    if (!state.user) {
      return <Navigate to="/auth" replace />;
    }
    
    return children;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          
          {/* Customer Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/order-tracking" 
            element={
              <ProtectedRoute>
                <OrderTrackingScreen />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/design-selection" 
            element={
              <ProtectedRoute>
                <DesignSelectionScreen />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-on-work" 
            element={
              <ProtectedRoute>
                <AddOnWorkScreen />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pricing" 
            element={
              <ProtectedRoute>
                <PricingScreen />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/measurement" 
            element={
              <ProtectedRoute>
                <MeasurementScreen />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/job-summary" 
            element={
              <ProtectedRoute>
                <JobSummaryScreen />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/job-confirmation" 
            element={
              <ProtectedRoute>
                <JobConfirmationScreen />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Tailor Routes */}
          <Route 
            path="/tailor-dashboard" 
            element={
              <ProtectedRoute>
                <TailorDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={
              state.user ? (
                state.userRole === 'admin' ? <Navigate to="/admin-dashboard" replace /> :
                state.userRole === 'tailor' ? <Navigate to="/tailor-dashboard" replace /> :
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
        </Routes>
        
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;