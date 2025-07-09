import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole { customer, admin, tailor }

class UserModel {
  final String id;
  final String phoneNumber;
  final String? name;
  final String? email;
  final String? profileImage;
  final UserRole role;
  final DateTime createdAt;
  final DateTime? lastLogin;
  final bool isActive;

  UserModel({
    required this.id,
    required this.phoneNumber,
    this.name,
    this.email,
    this.profileImage,
    required this.role,
    required this.createdAt,
    this.lastLogin,
    this.isActive = true,
  });

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      id: doc.id,
      phoneNumber: data['phoneNumber'] ?? '',
      name: data['name'],
      email: data['email'],
      profileImage: data['profileImage'],
      role: _mapStringToUserRole(data['role'] ?? 'customer'),
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      lastLogin: data['lastLogin'] != null
          ? (data['lastLogin'] as Timestamp).toDate()
          : null,
      isActive: data['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'phoneNumber': phoneNumber,
      'name': name,
      'email': email,
      'profileImage': profileImage,
      'role': role.toString().split('.').last,
      'createdAt': Timestamp.fromDate(createdAt),
      'lastLogin': lastLogin != null ? Timestamp.fromDate(lastLogin!) : null,
      'isActive': isActive,
    };
  }

  UserModel copyWith({
    String? id,
    String? phoneNumber,
    String? name,
    String? email,
    String? profileImage,
    UserRole? role,
    DateTime? createdAt,
    DateTime? lastLogin,
    bool? isActive,
  }) {
    return UserModel(
      id: id ?? this.id,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      name: name ?? this.name,
      email: email ?? this.email,
      profileImage: profileImage ?? this.profileImage,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
      isActive: isActive ?? this.isActive,
    );
  }

  static UserRole _mapStringToUserRole(String roleStr) {
    switch (roleStr) {
      case 'admin':
        return UserRole.admin;
      case 'tailor':
        return UserRole.tailor;
      case 'customer':
      default:
        return UserRole.customer;
    }
  }
}