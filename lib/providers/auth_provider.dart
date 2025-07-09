import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:tailoring_app/models/user_model.dart';
import 'package:tailoring_app/services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  
  UserModel? _user;
  String? _verificationId;
  bool _isLoading = false;
  String? _errorMessage;

  // Getters
  UserModel? get user => _user;
  String? get verificationId => _verificationId;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _user != null;
  UserRole get userRole => _user?.role ?? UserRole.customer;

  // Constructor
  AuthProvider() {
    _checkCurrentUser();
  }

  // Check if user is already logged in
  Future<void> _checkCurrentUser() async {
    _setLoading(true);
    
    try {
      final currentUser = _authService.currentUser;
      if (currentUser != null) {
        final userModel = await _authService.getUserById(currentUser.uid);
        if (userModel != null) {
          _user = userModel;
          notifyListeners();
        }
      }
    } catch (e) {
      _setError('Failed to get user data');
    } finally {
      _setLoading(false);
    }
  }

  // Send OTP
  Future<void> sendOTP(String phoneNumber) async {
    _setLoading(true);
    _clearError();
    
    try {
      await _authService.sendOTP(
        phoneNumber: phoneNumber,
        verificationCompleted: (PhoneAuthCredential credential) async {
          // Auto-verification on Android
          await _signInWithCredential(credential);
        },
        verificationFailed: (FirebaseAuthException e) {
          _setError(e.message ?? 'Verification failed');
        },
        codeSent: (String verificationId, int? resendToken) {
          _verificationId = verificationId;
          _setLoading(false);
        },
        codeAutoRetrievalTimeout: (String verificationId) {
          _verificationId = verificationId;
        },
      );
    } catch (e) {
      _setError('Failed to send OTP');
      _setLoading(false);
    }
  }

  // Verify OTP
  Future<bool> verifyOTP(String otp) async {
    _setLoading(true);
    _clearError();
    
    try {
      if (_verificationId == null) {
        _setError('Verification ID is null');
        return false;
      }
      
      final credential = await _authService.verifyOTP(
        verificationId: _verificationId!,
        smsCode: otp,
      );
      
      await _processUserAfterAuth(credential.user!);
      return true;
    } catch (e) {
      _setError('Invalid OTP');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Process user after authentication
  Future<void> _processUserAfterAuth(User firebaseUser) async {
    try {
      final userModel = await _authService.createOrUpdateUser(
        uid: firebaseUser.uid,
        phoneNumber: firebaseUser.phoneNumber ?? '',
      );
      
      _user = userModel;
      _verificationId = null;
      notifyListeners();
    } catch (e) {
      _setError('Failed to process user data');
    }
  }

  // Sign in with credential (for auto-verification)
  Future<void> _signInWithCredential(PhoneAuthCredential credential) async {
    try {
      final userCredential = await FirebaseAuth.instance.signInWithCredential(credential);
      await _processUserAfterAuth(userCredential.user!);
    } catch (e) {
      _setError('Failed to sign in');
    }
  }

  // Sign out
  Future<void> signOut() async {
    _setLoading(true);
    
    try {
      await _authService.signOut();
      _user = null;
      notifyListeners();
    } catch (e) {
      _setError('Failed to sign out');
    } finally {
      _setLoading(false);
    }
  }

  // Update user profile
  Future<void> updateUserProfile({String? name, String? email}) async {
    _setLoading(true);
    
    try {
      if (_user == null) {
        _setError('User not authenticated');
        return;
      }
      
      final updatedUser = await _authService.createOrUpdateUser(
        uid: _user!.id,
        phoneNumber: _user!.phoneNumber,
        name: name,
        email: email,
        role: _user!.role,
      );
      
      _user = updatedUser;
      notifyListeners();
    } catch (e) {
      _setError('Failed to update profile');
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

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}