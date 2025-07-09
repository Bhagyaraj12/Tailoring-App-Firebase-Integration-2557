import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiArrowLeft, FiCamera, FiImage, FiUpload, FiClock } = FiIcons;

const measurementFields = {
  blouse: [
    { id: 'bust', label: 'Bust', placeholder: 'Enter bust size (inches)', required: true },
    { id: 'shoulder', label: 'Shoulder', placeholder: 'Enter shoulder width (inches)', required: true },
    { id: 'sleeve', label: 'Sleeve Length', placeholder: 'Enter sleeve length (inches)', required: true },
    { id: 'waist', label: 'Waist', placeholder: 'Enter waist size (inches)', required: true },
    { id: 'length', label: 'Blouse Length', placeholder: 'Enter blouse length (inches)', required: true },
  ],
  shirt: [
    { id: 'chest', label: 'Chest', placeholder: 'Enter chest size (inches)', required: true },
    { id: 'shoulder', label: 'Shoulder', placeholder: 'Enter shoulder width (inches)', required: true },
    { id: 'sleeve', label: 'Sleeve Length', placeholder: 'Enter sleeve length (inches)', required: true },
    { id: 'length', label: 'Shirt Length', placeholder: 'Enter shirt length (inches)', required: true },
    { id: 'collar', label: 'Collar', placeholder: 'Enter collar size (inches)', required: true },
  ],
  kurti: [
    { id: 'bust', label: 'Bust', placeholder: 'Enter bust size (inches)', required: true },
    { id: 'waist', label: 'Waist', placeholder: 'Enter waist size (inches)', required: true },
    { id: 'hip', label: 'Hip', placeholder: 'Enter hip size (inches)', required: true },
    { id: 'length', label: 'Kurti Length', placeholder: 'Enter kurti length (inches)', required: true },
    { id: 'sleeve', label: 'Sleeve Length', placeholder: 'Enter sleeve length (inches)', required: true },
  ],
  lehenga: [
    { id: 'bust', label: 'Bust', placeholder: 'Enter bust size (inches)', required: true },
    { id: 'waist', label: 'Waist', placeholder: 'Enter waist size (inches)', required: true },
    { id: 'hip', label: 'Hip', placeholder: 'Enter hip size (inches)', required: true },
    { id: 'length', label: 'Lehenga Length', placeholder: 'Enter lehenga length (inches)', required: true },
    { id: 'blouse_bust', label: 'Blouse Bust', placeholder: 'Enter blouse bust size (inches)', required: true },
  ],
  kidswear: [
    { id: 'chest', label: 'Chest', placeholder: 'Enter chest size (inches)', required: true },
    { id: 'waist', label: 'Waist', placeholder: 'Enter waist size (inches)', required: true },
    { id: 'length', label: 'Length', placeholder: 'Enter garment length (inches)', required: true },
    { id: 'shoulder', label: 'Shoulder', placeholder: 'Enter shoulder width (inches)', required: true },
  ],
  saree: [
    { id: 'bust', label: 'Bust', placeholder: 'Enter bust size (inches)', required: true },
    { id: 'shoulder', label: 'Shoulder', placeholder: 'Enter shoulder width (inches)', required: true },
    { id: 'sleeve', label: 'Sleeve Length', placeholder: 'Enter sleeve length (inches)', required: true },
    { id: 'waist', label: 'Waist', placeholder: 'Enter waist size (inches)', required: true },
    { id: 'length', label: 'Blouse Length', placeholder: 'Enter blouse length (inches)', required: true },
  ],
};

const timeSlots = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM',
];

function MeasurementScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [measurementMethod, setMeasurementMethod] = useState(state.measurementMethod || null);
  const [measurements, setMeasurements] = useState(state.measurements || {});
  const [selectedImage, setSelectedImage] = useState(state.measurementImage || null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(state.pickupTime || null);

  // Safety check: if no category or design is selected, redirect to home
  useEffect(() => {
    if (!state.selectedCategory || !state.selectedDesign) {
      navigate('/home');
    }
  }, [state.selectedCategory, state.selectedDesign, navigate]);

  const fields = measurementFields[state.selectedCategory?.id] || [];

  const handleMethodSelect = (method) => {
    setMeasurementMethod(method);
    dispatch({ type: 'SET_MEASUREMENT_METHOD', payload: method });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        dispatch({ type: 'SET_MEASUREMENT_IMAGE', payload: e.target.result });
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMeasurementChange = (fieldId, value) => {
    const newMeasurements = { ...measurements, [fieldId]: value };
    setMeasurements(newMeasurements);
    dispatch({ type: 'SET_MEASUREMENTS', payload: newMeasurements });
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    dispatch({ type: 'SET_PICKUP_TIME', payload: timeSlot });
  };

  const handleContinue = () => {
    if (!measurementMethod) {
      toast.error('Please select a measurement method');
      return;
    }

    if (measurementMethod === 'sample' && !selectedImage) {
      toast.error('Please upload a sample image');
      return;
    }

    if (measurementMethod === 'manual') {
      const requiredFields = fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => !measurements[field.id]);
      if (missingFields.length > 0) {
        toast.error('Please fill all required measurements');
        return;
      }
    }

    navigate('/job-summary');
  };

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
            <h1 className="text-xl font-bold text-gray-800">Measurements</h1>
            <p className="text-gray-600">How would you like to provide measurements?</p>
          </div>
          <div className="w-10 h-10"></div>
        </motion.div>

        {/* Measurement Method Selection */}
        {!measurementMethod && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Do you have a sample {state.selectedCategory?.name.toLowerCase()} for measurement?
            </h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMethodSelect('sample')}
              className="w-full bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <SafeIcon icon={FiCamera} className="text-green-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Yes, I have a sample</h4>
                  <p className="text-sm text-gray-600">Upload photo of your sample garment</p>
                </div>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMethodSelect('manual')}
              className="w-full bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-left"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <SafeIcon icon={FiIcons.FiEdit} className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">No, I'll provide measurements</h4>
                  <p className="text-sm text-gray-600">Enter measurements manually</p>
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Sample Image Upload */}
        {measurementMethod === 'sample' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="upload-area p-8 text-center">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="image-upload" 
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {selectedImage ? (
                  <div>
                    <img 
                      src={selectedImage} 
                      alt="Sample" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4" 
                    />
                    <p className="text-primary-600 font-medium">Image uploaded successfully!</p>
                    <p className="text-sm text-gray-600 mt-2">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <SafeIcon icon={FiUpload} className="text-4xl text-primary-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-800 mb-2">Upload Sample Image</p>
                    <p className="text-sm text-gray-600">
                      Take a photo or select from gallery
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* Pickup Time Selection */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Schedule Pickup Time (Optional)</h4>
              <div className="space-y-2">
                {timeSlots.map((slot, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleTimeSlotSelect(slot)}
                    className={`w-full p-3 rounded-lg border text-left ${
                      selectedTimeSlot === slot 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <SafeIcon icon={FiClock} className="mr-3" />
                      {slot}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Manual Measurements */}
        {measurementMethod === 'manual' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="measurement-form p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Enter Measurements for {state.selectedCategory?.name}
            </h3>
            {fields.map((field, index) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={measurements[field.id] || ''} 
                  onChange={(e) => handleMeasurementChange(field.id, e.target.value)} 
                  placeholder={field.placeholder} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Continue Button */}
        {measurementMethod && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full btn-primary text-white font-medium py-3 px-4 rounded-lg mt-6"
          >
            Continue to Summary
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default MeasurementScreen;