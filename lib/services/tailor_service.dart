import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:tailoring_app/models/tailor_model.dart';

class TailorService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Get all tailors
  Stream<List<TailorModel>> getAllTailors() {
    return _firestore
        .collection('tailors')
        .where('isActive', isEqualTo: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => TailorModel.fromFirestore(doc)).toList();
    });
  }

  // Get available tailors
  Stream<List<TailorModel>> getAvailableTailors() {
    return _firestore
        .collection('tailors')
        .where('availability', isEqualTo: 'available')
        .where('isActive', isEqualTo: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => TailorModel.fromFirestore(doc)).toList();
    });
  }

  // Get tailor by userId
  Future<TailorModel?> getTailorByUserId(String userId) async {
    try {
      final querySnapshot = await _firestore
          .collection('tailors')
          .where('userId', isEqualTo: userId)
          .get();
      
      if (querySnapshot.docs.isNotEmpty) {
        return TailorModel.fromFirestore(querySnapshot.docs.first);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting tailor: $e');
      return null;
    }
  }

  // Update tailor availability
  Future<void> updateTailorAvailability({
    required String tailorId,
    required TailorAvailability availability,
  }) async {
    try {
      await _firestore.collection('tailors').doc(tailorId).update({
        'availability': availability.toString().split('.').last,
      });
    } catch (e) {
      debugPrint('Error updating tailor availability: $e');
      rethrow;
    }
  }

  // Update tailor job counts
  Future<void> updateTailorJobCounts({
    required String tailorId,
    required int activeJobCount,
    required int completedJobCount,
  }) async {
    try {
      await _firestore.collection('tailors').doc(tailorId).update({
        'activeJobCount': activeJobCount,
        'completedJobCount': completedJobCount,
      });
    } catch (e) {
      debugPrint('Error updating tailor job counts: $e');
      rethrow;
    }
  }

  // Add new tailor
  Future<String> addTailor({
    required String userId,
    required String name,
    required String phoneNumber,
    String? email,
    required List<String> skillTags,
    String? address,
  }) async {
    try {
      final tailorData = {
        'userId': userId,
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
      };
      
      final docRef = await _firestore.collection('tailors').add(tailorData);
      return docRef.id;
    } catch (e) {
      debugPrint('Error adding tailor: $e');
      rethrow;
    }
  }
}