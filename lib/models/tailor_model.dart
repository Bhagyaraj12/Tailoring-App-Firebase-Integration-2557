import 'package:cloud_firestore/cloud_firestore.dart';

enum TailorAvailability { available, busy, unavailable }

class TailorModel {
  final String id;
  final String userId;
  final String name;
  final String phoneNumber;
  final String? email;
  final List<String> skillTags;
  final TailorAvailability availability;
  final String? address;
  final int activeJobCount;
  final int completedJobCount;
  final double rating;
  final int ratingCount;
  final bool isActive;

  TailorModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.phoneNumber,
    this.email,
    required this.skillTags,
    required this.availability,
    this.address,
    this.activeJobCount = 0,
    this.completedJobCount = 0,
    this.rating = 0.0,
    this.ratingCount = 0,
    this.isActive = true,
  });

  factory TailorModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    
    List<String> skills = [];
    if (data['skillTags'] != null) {
      for (var skill in data['skillTags']) {
        skills.add(skill.toString());
      }
    }

    return TailorModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      name: data['name'] ?? '',
      phoneNumber: data['phoneNumber'] ?? '',
      email: data['email'],
      skillTags: skills,
      availability: _mapStringToAvailability(data['availability'] ?? 'available'),
      address: data['address'],
      activeJobCount: data['activeJobCount'] ?? 0,
      completedJobCount: data['completedJobCount'] ?? 0,
      rating: (data['rating'] ?? 0.0).toDouble(),
      ratingCount: data['ratingCount'] ?? 0,
      isActive: data['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'name': name,
      'phoneNumber': phoneNumber,
      'email': email,
      'skillTags': skillTags,
      'availability': availability.toString().split('.').last,
      'address': address,
      'activeJobCount': activeJobCount,
      'completedJobCount': completedJobCount,
      'rating': rating,
      'ratingCount': ratingCount,
      'isActive': isActive,
    };
  }

  TailorModel copyWith({
    String? id,
    String? userId,
    String? name,
    String? phoneNumber,
    String? email,
    List<String>? skillTags,
    TailorAvailability? availability,
    String? address,
    int? activeJobCount,
    int? completedJobCount,
    double? rating,
    int? ratingCount,
    bool? isActive,
  }) {
    return TailorModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      email: email ?? this.email,
      skillTags: skillTags ?? this.skillTags,
      availability: availability ?? this.availability,
      address: address ?? this.address,
      activeJobCount: activeJobCount ?? this.activeJobCount,
      completedJobCount: completedJobCount ?? this.completedJobCount,
      rating: rating ?? this.rating,
      ratingCount: ratingCount ?? this.ratingCount,
      isActive: isActive ?? this.isActive,
    );
  }

  static TailorAvailability _mapStringToAvailability(String availabilityStr) {
    switch (availabilityStr) {
      case 'busy':
        return TailorAvailability.busy;
      case 'unavailable':
        return TailorAvailability.unavailable;
      case 'available':
      default:
        return TailorAvailability.available;
    }
  }
}