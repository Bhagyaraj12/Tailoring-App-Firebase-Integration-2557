import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiCheck } = FiIcons;

const designs = {
  blouse: [
    {
      id: 'boat-neck',
      name: 'Boat Neck',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      price: 0
    },
    {
      id: 'puff-sleeve',
      name: 'Puff Sleeve',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop',
      price: 100
    },
    {
      id: 'backless',
      name: 'Backless',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
      price: 150
    },
    {
      id: 'high-neck',
      name: 'High Neck',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop',
      price: 80
    },
  ],
  shirt: [
    {
      id: 'formal',
      name: 'Formal Shirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      price: 0
    },
    {
      id: 'casual',
      name: 'Casual Shirt',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
      price: 50
    },
    {
      id: 'party',
      name: 'Party Shirt',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
      price: 120
    },
  ],
  kurti: [
    {
      id: 'straight',
      name: 'Straight Cut',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop',
      price: 0
    },
    {
      id: 'anarkali',
      name: 'Anarkali',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      price: 200
    },
    {
      id: 'a-line',
      name: 'A-Line',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop',
      price: 150
    },
  ],
  lehenga: [
    {
      id: 'traditional',
      name: 'Traditional',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop',
      price: 0
    },
    {
      id: 'indo-western',
      name: 'Indo-Western',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      price: 500
    },
    {
      id: 'party-wear',
      name: 'Party Wear',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop',
      price: 800
    },
  ],
  kidswear: [
    {
      id: 'frock',
      name: 'Frock',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
      price: 0
    },
    {
      id: 'shirt-pant',
      name: 'Shirt & Pant',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop',
      price: 100
    },
    {
      id: 'ethnic',
      name: 'Ethnic Wear',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      price: 150
    },
  ],
  saree: [
    {
      id: 'basic',
      name: 'Basic Blouse',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
      price: 0
    },
    {
      id: 'designer',
      name: 'Designer Blouse',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
      price: 200
    },
    {
      id: 'heavy-work',
      name: 'Heavy Work',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop',
      price: 300
    },
  ],
};

function DesignSelectionScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedDesign, setSelectedDesign] = useState(null);

  const categoryDesigns = designs[state.selectedCategory?.id] || [];

  // Initialize selectedDesign from context on component mount
  useEffect(() => {
    if (state.selectedDesign) {
      setSelectedDesign(state.selectedDesign);
    }
  }, [state.selectedDesign]);

  // Debug logging
  useEffect(() => {
    console.log('Design Selection Debug:', {
      selectedCategory: state.selectedCategory,
      categoryDesigns: categoryDesigns,
      selectedDesign: selectedDesign,
      stateDesign: state.selectedDesign
    });
  }, [state.selectedCategory, categoryDesigns, selectedDesign, state.selectedDesign]);

  const handleDesignSelect = (design) => {
    console.log('Design selected:', design);
    setSelectedDesign(design);
    dispatch({ type: 'SET_DESIGN', payload: design });
    
    const newTotalPrice = state.basePrice + design.price;
    dispatch({ 
      type: 'SET_PRICING', 
      payload: { 
        basePrice: state.basePrice, 
        totalPrice: newTotalPrice 
      } 
    });
  };

  const handleContinue = () => {
    if (selectedDesign) {
      console.log('Continuing with design:', selectedDesign);
      navigate('/add-on-work');
    } else {
      console.log('No design selected');
    }
  };

  // Show loading if no category is selected
  if (!state.selectedCategory) {
    return (
      <div className="mobile-container">
        <div className="screen-container flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading designs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no designs available for category
  if (categoryDesigns.length === 0) {
    return (
      <div className="mobile-container">
        <div className="screen-container">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">No Designs Available</h2>
              <p className="text-gray-600 mb-4">
                No designs found for {state.selectedCategory?.name}
              </p>
              <button
                onClick={() => navigate('/home')}
                className="btn-primary text-white px-6 py-3 rounded-lg font-medium"
              >
                Go Back to Categories
              </button>
            </div>
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
            <h1 className="text-xl font-bold text-gray-800">Select Design</h1>
            <p className="text-gray-600">{state.selectedCategory?.name}</p>
          </div>
          <div className="w-10 h-10"></div>
        </motion.div>

        {/* Designs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categoryDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDesignSelect(design)}
              className={`design-card bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
                selectedDesign?.id === design.id ? 'selected ring-2 ring-primary-500' : 'hover:shadow-xl'
              }`}
            >
              <div className="relative">
                <img
                  src={design.image}
                  alt={design.name}
                  className="w-full h-40 object-cover"
                />
                {selectedDesign?.id === design.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiCheck} className="text-white text-sm" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{design.name}</h3>
                <p className="text-primary-600 font-medium">
                  {design.price === 0 ? 'Base Price' : `+₹${design.price}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price Summary */}
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-4 shadow-lg mb-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Selected Design:</span>
              <span className="font-semibold text-gray-800">{selectedDesign.name}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700">Current Total:</span>
              <span className="font-bold text-primary-600 text-lg">
                ₹{state.basePrice + selectedDesign.price}
              </span>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: selectedDesign ? 1.02 : 1 }}
          whileTap={{ scale: selectedDesign ? 0.98 : 1 }}
          onClick={handleContinue}
          disabled={!selectedDesign}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-300 ${
            selectedDesign
              ? 'btn-primary text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedDesign ? 'Continue to Add-ons' : 'Select a Design to Continue'}
        </motion.button>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Category: {state.selectedCategory?.name} ({state.selectedCategory?.id})</p>
            <p>Available Designs: {categoryDesigns.length}</p>
            <p>Selected Design: {selectedDesign?.name || 'None'}</p>
            <p>Base Price: ₹{state.basePrice}</p>
            <p>Total Price: ₹{state.totalPrice}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DesignSelectionScreen;