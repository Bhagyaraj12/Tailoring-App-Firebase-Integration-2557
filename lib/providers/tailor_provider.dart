import 'package:flutter/material.dart';
import 'package:tailoring_app/models/tailor_model.dart';
import 'package:tailoring_app/services/tailor_service.dart';

class TailorProvider with ChangeNotifier {
  final TailorService _tailorService = TailorService();
  
  // State variables
  List<TailorModel> _allTailors = [];
  List<TailorModel> _availableTailors = [];
  TailorModel? _currentTailor;
  
  bool _isLoading = false;
  String? _errorMessage;
  
  // Getters
  List<TailorModel> get allTailors => _allTailors;
  List<TailorModel> get availableTailors => _availableTailors;
  TailorModel? get currentTailor => _currentTailor;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  
  // Load all tailors
  Future<void> loadAllTailors() async {
    _setLoading(true);
    
    try {
      _tailorService.getAllTailors().listen((tailors) {
        _allTailors = tailors;
        notifyListeners();
      });
    } catch (e) {
      _setError('Failed to load tailors');
    } finally {
      _setLoading(false);
    }
  }
  
  // Load available tailors
  Future<void> loadAvailableTailors() async {
    _setLoading(true);
    
    try {
      _tailorService.getAvailableTailors().listen((tailors) {
        _availableTailors = tailors;
        notifyListeners();
      });
    } catch (e) {
      _setError('Failed to load available tailors');
    } finally {
      _setLoading(false);
    }
  }
  
  // Get tailor by user ID
  Future<void> getTailorByUserId(String userId) async {
    _setLoading(true);
    
    try {
      final tailor = await _tailorService.getTailorByUserId(userId);
      _currentTailor = tailor;
      notifyListeners();
    } catch (e) {
      _setError('Failed to get tailor profile');
    } finally {
      _setLoading(false);
    }
  }
  
  // Update tailor availability
  Future<bool> updateTailorAvailability({
    required String tailorId,
    required TailorAvailability availability,
  }) async {
    _setLoading(true);
    
    try {
      await _tailorService.updateTailorAvailability(
        tailorId: tailorId,
        availability: availability,
      );
      
      if (_currentTailor?.id == tailorId) {
        _currentTailor = _currentTailor?.copyWith(availability: availability);
        notifyListeners();
      }
      
      return true;
    } catch (e) {
      _setError('Failed to update availability');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // Add new tailor
  Future<String?> addTailor({
    required String userId,
    required String name,
    required String phoneNumber,
    String? email,
    required List<String> skillTags,
    String? address,
  }) async {
    _setLoading(true);
    
    try {
      final tailorId = await _tailorService.addTailor(
        userId: userId,
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        skillTags: skillTags,
        address: address,
      );
      
      return tailorId;
    } catch (e) {
      _setError('Failed to add tailor');
      return null;
    } finally {
      _setLoading(false);
    }
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