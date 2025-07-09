import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:tailoring_app/models/user_model.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Get current user
  User? get currentUser => _auth.currentUser;

  // Get user stream
  Stream<User?> get userStream => _auth.authStateChanges();

  // Send OTP
  Future<void> sendOTP({
    required String phoneNumber,
    required Function(PhoneAuthCredential) verificationCompleted,
    required Function(FirebaseAuthException) verificationFailed,
    required Function(String, int?) codeSent,
    required Function(String) codeAutoRetrievalTimeout,
  }) async {
    await _auth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: verificationCompleted,
      verificationFailed: verificationFailed,
      codeSent: codeSent,
      codeAutoRetrievalTimeout: codeAutoRetrievalTimeout,
      timeout: const Duration(seconds: 120),
    );
  }

  // Verify OTP
  Future<UserCredential> verifyOTP({
    required String verificationId,
    required String smsCode,
  }) async {
    PhoneAuthCredential credential = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: smsCode,
    );
    return await _auth.signInWithCredential(credential);
  }

  // Sign out
  Future<void> signOut() async {
    await _auth.signOut();
  }

  // Create or update user in Firestore
  Future<UserModel> createOrUpdateUser({
    required String uid,
    required String phoneNumber,
    String? name,
    String? email,
    UserRole role = UserRole.customer,
  }) async {
    final userDoc = await _firestore.collection('users').doc(uid).get();
    
    if (userDoc.exists) {
      // Update last login
      await _firestore.collection('users').doc(uid).update({
        'lastLogin': Timestamp.now(),
        'name': name ?? userDoc.get('name'),
        'email': email ?? userDoc.get('email'),
      });
      
      // Return updated user model
      UserModel user = UserModel.fromFirestore(userDoc);
      return user.copyWith(
        lastLogin: DateTime.now(),
        name: name ?? user.name,
        email: email ?? user.email,
      );
    } else {
      // Create new user
      final newUser = UserModel(
        id: uid,
        phoneNumber: phoneNumber,
        name: name,
        email: email,
        role: role,
        createdAt: DateTime.now(),
        lastLogin: DateTime.now(),
      );
      
      await _firestore.collection('users').doc(uid).set(newUser.toMap());
      return newUser;
    }
  }

  // Get user from Firestore
  Future<UserModel?> getUserById(String uid) async {
    try {
      final userDoc = await _firestore.collection('users').doc(uid).get();
      if (userDoc.exists) {
        return UserModel.fromFirestore(userDoc);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting user: $e');
      return null;
    }
  }

  // Update user role
  Future<void> updateUserRole(String uid, UserRole role) async {
    await _firestore.collection('users').doc(uid).update({
      'role': role.toString().split('.').last,
    });
  }

  // Create tailor profile
  Future<void> createTailorProfile({
    required String uid,
    required String name,
    required String phoneNumber,
    String? email,
    required List<String> skillTags,
    String? address,
  }) async {
    // First, update user role to tailor
    await updateUserRole(uid, UserRole.tailor);
    
    // Then create tailor profile
    await _firestore.collection('tailors').add({
      'userId': uid,
      'name': name,
      'phoneNumber': phoneNumber,
      'email': email,
      'skillTags': skillTags,
      'availability': 'available',
      'address': address,
      'activeJobCount': 0,
      'completedJobCount': 0,
      'rating': 0.0,
      'ratingCount': 0,
      'isActive': true,
    });
  }
}