import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:tailoring_app/models/job_model.dart';
import 'dart:io';

class JobService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;

  // Create a new job
  Future<String> createJob({
    required String customerId,
    required String customerName,
    required String category,
    required String design,
    required List<AddOn> addOns,
    required double basePrice,
    required double totalPrice,
    required DateTime estimatedDeliveryDate,
    required String measurementMethod,
    Map<String, double>? measurements,
    File? sampleImage,
    String? pickupTime,
    bool isFastDelivery = false,
    double? fastDeliveryCharge,
    String? notes,
  }) async {
    try {
      // Upload sample image if provided
      String? sampleImageUrl;
      if (sampleImage != null) {
        sampleImageUrl = await _uploadSampleImage(sampleImage, customerId);
      }

      // Create job document
      final jobData = {
        'customerId': customerId,
        'customerName': customerName,
        'category': category,
        'design': design,
        'addOns': addOns.map((addon) => addon.toMap()).toList(),
        'basePrice': basePrice,
        'totalPrice': totalPrice,
        'status': 'pending_assignment',
        'createdAt': Timestamp.now(),
        'estimatedDeliveryDate': Timestamp.fromDate(estimatedDeliveryDate),
        'measurementMethod': measurementMethod,
        'measurements': measurements,
        'sampleImageUrl': sampleImageUrl,
        'pickupTime': pickupTime,
        'isFastDelivery': isFastDelivery,
        'fastDeliveryCharge': fastDeliveryCharge,
        'notes': notes,
      };

      final docRef = await _firestore.collection('jobs').add(jobData);
      return docRef.id;
    } catch (e) {
      debugPrint('Error creating job: $e');
      rethrow;
    }
  }

  // Upload sample image to Firebase Storage
  Future<String> _uploadSampleImage(File imageFile, String customerId) async {
    try {
      final fileName = '${DateTime.now().millisecondsSinceEpoch}_${customerId}.jpg';
      final storageRef = _storage.ref().child('sample_images/$fileName');
      
      await storageRef.putFile(imageFile);
      final downloadUrl = await storageRef.getDownloadURL();
      
      return downloadUrl;
    } catch (e) {
      debugPrint('Error uploading image: $e');
      rethrow;
    }
  }

  // Get job by id
  Future<JobModel?> getJobById(String jobId) async {
    try {
      final jobDoc = await _firestore.collection('jobs').doc(jobId).get();
      if (jobDoc.exists) {
        return JobModel.fromFirestore(jobDoc);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting job: $e');
      return null;
    }
  }

  // Get jobs by customer id
  Stream<List<JobModel>> getJobsByCustomerId(String customerId) {
    return _firestore
        .collection('jobs')
        .where('customerId', isEqualTo: customerId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => JobModel.fromFirestore(doc)).toList();
    });
  }

  // Get jobs by tailor id
  Stream<List<JobModel>> getJobsByTailorId(String tailorId) {
    return _firestore
        .collection('jobs')
        .where('tailorId', isEqualTo: tailorId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => JobModel.fromFirestore(doc)).toList();
    });
  }

  // Get pending jobs (for admin)
  Stream<List<JobModel>> getPendingJobs() {
    return _firestore
        .collection('jobs')
        .where('status', isEqualTo: 'pending_assignment')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => JobModel.fromFirestore(doc)).toList();
    });
  }

  // Get all jobs (for admin)
  Stream<List<JobModel>> getAllJobs() {
    return _firestore
        .collection('jobs')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => JobModel.fromFirestore(doc)).toList();
    });
  }

  // Assign job to tailor
  Future<void> assignJobToTailor({
    required String jobId,
    required String tailorId,
    required String tailorName,
    required double assignmentAmount,
  }) async {
    try {
      await _firestore.collection('jobs').doc(jobId).update({
        'tailorId': tailorId,
        'tailorName': tailorName,
        'assignmentAmount': assignmentAmount,
        'status': 'assigned',
        'assignedAt': Timestamp.now(),
      });
    } catch (e) {
      debugPrint('Error assigning job: $e');
      rethrow;
    }
  }

  // Update job status
  Future<void> updateJobStatus({
    required String jobId,
    required String status,
  }) async {
    try {
      final updates = {'status': status};
      
      // Add timestamp based on status
      if (status == 'in_progress') {
        updates['startedAt'] = Timestamp.now();
      } else if (status == 'completed') {
        updates['completedAt'] = Timestamp.now();
      } else if (status == 'delivered') {
        updates['actualDeliveryDate'] = Timestamp.now();
      }
      
      await _firestore.collection('jobs').doc(jobId).update(updates);
    } catch (e) {
      debugPrint('Error updating job status: $e');
      rethrow;
    }
  }

  // Cancel job
  Future<void> cancelJob(String jobId) async {
    try {
      await _firestore.collection('jobs').doc(jobId).update({
        'status': 'cancelled',
      });
    } catch (e) {
      debugPrint('Error cancelling job: $e');
      rethrow;
    }
  }
}