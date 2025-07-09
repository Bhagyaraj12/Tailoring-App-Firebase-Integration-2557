import 'package:flutter/material.dart';
import 'package:tailoring_app/models/job_model.dart';
import 'package:tailoring_app/services/job_service.dart';
import 'dart:io';

class JobProvider with ChangeNotifier {
  final JobService _jobService = JobService();
  
  // State variables
  List<JobModel> _customerJobs = [];
  List<JobModel> _tailorJobs = [];
  List<JobModel> _pendingJobs = [];
  List<JobModel> _allJobs = [];
  JobModel? _selectedJob;
  
  bool _isLoading = false;
  String? _errorMessage;
  
  // Order creation state
  String? _selectedCategory;
  String? _selectedDesign;
  List<AddOn> _selectedAddOns = [];
  double _basePrice = 0;
  double _totalPrice = 0;
  DateTime? _deliveryDate;
  bool _isFastDelivery = false;
  double _fastDeliveryCharge = 0;
  String _measurementMethod = 'manual';
  Map<String, double> _measurements = {};
  File? _sampleImage;
  String? _pickupTime;
  
  // Getters
  List<JobModel> get customerJobs => _customerJobs;
  List<JobModel> get tailorJobs => _tailorJobs;
  List<JobModel> get pendingJobs => _pendingJobs;
  List<JobModel> get allJobs => _allJobs;
  JobModel? get selectedJob => _selectedJob;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  
  String? get selectedCategory => _selectedCategory;
  String? get selectedDesign => _selectedDesign;
  List<AddOn> get selectedAddOns => _selectedAddOns;
  double get basePrice => _basePrice;
  double get totalPrice => _totalPrice;
  DateTime? get deliveryDate => _deliveryDate;
  bool get isFastDelivery => _isFastDelivery;
  double get fastDeliveryCharge => _fastDeliveryCharge;
  String get measurementMethod => _measurementMethod;
  Map<String, double> get measurements => _measurements;
  File? get sampleImage => _sampleImage;
  String? get pickupTime => _pickupTime;
  
  // Load customer jobs
  Future<void> loadCustomerJobs(String customerId) async {
    _setLoading(true);
    
    try {
      _jobService.getJobsByCustomerId(customerId).listen((jobs) {
        _customerJobs = jobs;
        notifyListeners();
      });
    } catch (e) {
      _setError('Failed to load jobs');
    } finally {
      _setLoading(false);
    }
  }
  
  // Load tailor jobs
  Future<void> loadTailorJobs(String tailorId) async {
    _setLoading(true);
    
    try {
      _jobService.getJobsByTailorId(tailorId).listen((jobs) {
        _tailorJobs = jobs;
        notifyListeners();
      });
    } catch (e) {
      _setError('Failed to load tailor jobs');
    } finally {
      _setLoading(false);
    }
  }
  
  // Load pending jobs (for admin)
  Future<void> loadPendingJobs() async {
    _setLoading(true);
    
    try {
      _jobService.getPendingJobs().listen((jobs) {
        _pendingJobs = jobs;
        notifyListeners();
      });
    } catch (e) {
      _setError('Failed to load pending jobs');
    } finally {
      _setLoading(false);
    }
  }
  
  // Load all jobs (for admin)
  Future<void> loadAllJobs() async {
    _setLoading(true);
    
    try {
      _jobService.getAllJobs().listen((jobs) {
        _allJobs = jobs;
        notifyListeners();
      });
    } catch (e) {
      _setError('Failed to load all jobs');
    } finally {
      _setLoading(false);
    }
  }
  
  // Get job by id
  Future<void> getJobById(String jobId) async {
    _setLoading(true);
    
    try {
      final job = await _jobService.getJobById(jobId);
      _selectedJob = job;
      notifyListeners();
    } catch (e) {
      _setError('Failed to get job details');
    } finally {
      _setLoading(false);
    }
  }
  
  // Create a new job
  Future<String?> createJob({
    required String customerId,
    required String customerName,
    String? notes,
  }) async {
    _setLoading(true);
    
    try {
      if (_selectedCategory == null || _selectedDesign == null) {
        _setError('Category and design must be selected');
        return null;
      }
      
      if (_measurementMethod == 'manual' && _measurements.isEmpty) {
        _setError('Measurements are required');
        return null;
      }
      
      if (_measurementMethod == 'sample' && _sampleImage == null) {
        _setError('Sample image is required');
        return null;
      }
      
      final jobId = await _jobService.createJob(
        customerId: customerId,
        customerName: customerName,
        category: _selectedCategory!,
        design: _selectedDesign!,
        addOns: _selectedAddOns,
        basePrice: _basePrice,
        totalPrice: _totalPrice,
        estimatedDeliveryDate: _deliveryDate ?? DateTime.now().add(const Duration(days: 7)),
        measurementMethod: _measurementMethod,
        measurements: _measurementMethod == 'manual' ? _measurements : null,
        sampleImage: _sampleImage,
        pickupTime: _pickupTime,
        isFastDelivery: _isFastDelivery,
        fastDeliveryCharge: _fastDeliveryCharge,
        notes: notes,
      );
      
      // Reset order state
      _resetOrderState();
      return jobId;
    } catch (e) {
      _setError('Failed to create job');
      return null;
    } finally {
      _setLoading(false);
    }
  }
  
  // Assign job to tailor
  Future<bool> assignJobToTailor({
    required String jobId,
    required String tailorId,
    required String tailorName,
    required double assignmentAmount,
  }) async {
    _setLoading(true);
    
    try {
      await _jobService.assignJobToTailor(
        jobId: jobId,
        tailorId: tailorId,
        tailorName: tailorName,
        assignmentAmount: assignmentAmount,
      );
      return true;
    } catch (e) {
      _setError('Failed to assign job');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Update job status
  Future<bool> updateJobStatus({
    required String jobId,
    required String status,
  }) async {
    _setLoading(true);
    
    try {
      await _jobService.updateJobStatus(
        jobId: jobId,
        status: status,
      );
      return true;
    } catch (e) {
      _setError('Failed to update job status');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Cancel job
  Future<bool> cancelJob(String jobId) async {
    _setLoading(true);
    
    try {
      await _jobService.cancelJob(jobId);
      return true;
    } catch (e) {
      _setError('Failed to cancel job');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Order creation methods
  void setSelectedCategory(String category, double price) {
    _selectedCategory = category;
    _basePrice = price;
    _totalPrice = price;
    _selectedDesign = null;
    _selectedAddOns = [];
    notifyListeners();
  }
  
  void setSelectedDesign(String design, double additionalPrice) {
    _selectedDesign = design;
    _updateTotalPrice();
    notifyListeners();
  }
  
  void toggleAddOn(AddOn addOn) {
    final index = _selectedAddOns.indexWhere((a) => a.id == addOn.id);
    if (index >= 0) {
      _selectedAddOns.removeAt(index);
    } else {
      _selectedAddOns.add(addOn);
    }
    _updateTotalPrice();
    notifyListeners();
  }
  
  void setDeliveryDate(DateTime date) {
    _deliveryDate = date;
    notifyListeners();
  }
  
  void setFastDelivery(bool isFast, double charge) {
    _isFastDelivery = isFast;
    _fastDeliveryCharge = isFast ? charge : 0;
    _updateTotalPrice();
    notifyListeners();
  }
  
  void setMeasurementMethod(String method) {
    _measurementMethod = method;
    notifyListeners();
  }
  
  void setMeasurement(String key, double value) {
    _measurements[key] = value;
    notifyListeners();
  }
  
  void setSampleImage(File image) {
    _sampleImage = image;
    notifyListeners();
  }
  
  void setPickupTime(String time) {
    _pickupTime = time;
    notifyListeners();
  }
  
  void _updateTotalPrice() {
    double addOnsPrice = 0;
    for (var addOn in _selectedAddOns) {
      addOnsPrice += addOn.price;
    }
    
    _totalPrice = _basePrice + addOnsPrice + _fastDeliveryCharge;
    notifyListeners();
  }
  
  void _resetOrderState() {
    _selectedCategory = null;
    _selectedDesign = null;
    _selectedAddOns = [];
    _basePrice = 0;
    _totalPrice = 0;
    _deliveryDate = null;
    _isFastDelivery = false;
    _fastDeliveryCharge = 0;
    _measurementMethod = 'manual';
    _measurements = {};
    _sampleImage = null;
    _pickupTime = null;
    notifyListeners();
  }
  
  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }
  
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}