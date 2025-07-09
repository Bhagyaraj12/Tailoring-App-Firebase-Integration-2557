import 'package:cloud_firestore/cloud_firestore.dart';

class JobModel {
  final String id;
  final String customerId;
  final String customerName;
  final String? tailorId;
  final String? tailorName;
  final String category;
  final String design;
  final List<AddOn> addOns;
  final double basePrice;
  final double totalPrice;
  final double? assignmentAmount;
  final String status;
  final DateTime createdAt;
  final DateTime estimatedDeliveryDate;
  final DateTime? actualDeliveryDate;
  final DateTime? assignedAt;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final String measurementMethod;
  final Map<String, double>? measurements;
  final String? sampleImageUrl;
  final String? pickupTime;
  final bool isFastDelivery;
  final double? fastDeliveryCharge;
  final String? notes;

  JobModel({
    required this.id,
    required this.customerId,
    required this.customerName,
    this.tailorId,
    this.tailorName,
    required this.category,
    required this.design,
    required this.addOns,
    required this.basePrice,
    required this.totalPrice,
    this.assignmentAmount,
    required this.status,
    required this.createdAt,
    required this.estimatedDeliveryDate,
    this.actualDeliveryDate,
    this.assignedAt,
    this.startedAt,
    this.completedAt,
    required this.measurementMethod,
    this.measurements,
    this.sampleImageUrl,
    this.pickupTime,
    this.isFastDelivery = false,
    this.fastDeliveryCharge,
    this.notes,
  });

  factory JobModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    
    // Convert add-ons from map to list of AddOn objects
    List<AddOn> addOns = [];
    if (data['addOns'] != null) {
      for (var addOnMap in data['addOns']) {
        addOns.add(AddOn.fromMap(addOnMap));
      }
    }

    // Convert measurements from map
    Map<String, double>? measurements;
    if (data['measurements'] != null) {
      measurements = Map<String, double>.from(data['measurements']);
    }

    return JobModel(
      id: doc.id,
      customerId: data['customerId'] ?? '',
      customerName: data['customerName'] ?? '',
      tailorId: data['tailorId'],
      tailorName: data['tailorName'],
      category: data['category'] ?? '',
      design: data['design'] ?? '',
      addOns: addOns,
      basePrice: (data['basePrice'] ?? 0).toDouble(),
      totalPrice: (data['totalPrice'] ?? 0).toDouble(),
      assignmentAmount: data['assignmentAmount']?.toDouble(),
      status: data['status'] ?? 'pending_assignment',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      estimatedDeliveryDate: (data['estimatedDeliveryDate'] as Timestamp).toDate(),
      actualDeliveryDate: data['actualDeliveryDate'] != null
          ? (data['actualDeliveryDate'] as Timestamp).toDate()
          : null,
      assignedAt: data['assignedAt'] != null
          ? (data['assignedAt'] as Timestamp).toDate()
          : null,
      startedAt: data['startedAt'] != null
          ? (data['startedAt'] as Timestamp).toDate()
          : null,
      completedAt: data['completedAt'] != null
          ? (data['completedAt'] as Timestamp).toDate()
          : null,
      measurementMethod: data['measurementMethod'] ?? 'manual',
      measurements: measurements,
      sampleImageUrl: data['sampleImageUrl'],
      pickupTime: data['pickupTime'],
      isFastDelivery: data['isFastDelivery'] ?? false,
      fastDeliveryCharge: data['fastDeliveryCharge']?.toDouble(),
      notes: data['notes'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'customerId': customerId,
      'customerName': customerName,
      'tailorId': tailorId,
      'tailorName': tailorName,
      'category': category,
      'design': design,
      'addOns': addOns.map((addon) => addon.toMap()).toList(),
      'basePrice': basePrice,
      'totalPrice': totalPrice,
      'assignmentAmount': assignmentAmount,
      'status': status,
      'createdAt': Timestamp.fromDate(createdAt),
      'estimatedDeliveryDate': Timestamp.fromDate(estimatedDeliveryDate),
      'actualDeliveryDate': actualDeliveryDate != null
          ? Timestamp.fromDate(actualDeliveryDate!)
          : null,
      'assignedAt': assignedAt != null ? Timestamp.fromDate(assignedAt!) : null,
      'startedAt': startedAt != null ? Timestamp.fromDate(startedAt!) : null,
      'completedAt': completedAt != null ? Timestamp.fromDate(completedAt!) : null,
      'measurementMethod': measurementMethod,
      'measurements': measurements,
      'sampleImageUrl': sampleImageUrl,
      'pickupTime': pickupTime,
      'isFastDelivery': isFastDelivery,
      'fastDeliveryCharge': fastDeliveryCharge,
      'notes': notes,
    };
  }

  JobModel copyWith({
    String? id,
    String? customerId,
    String? customerName,
    String? tailorId,
    String? tailorName,
    String? category,
    String? design,
    List<AddOn>? addOns,
    double? basePrice,
    double? totalPrice,
    double? assignmentAmount,
    String? status,
    DateTime? createdAt,
    DateTime? estimatedDeliveryDate,
    DateTime? actualDeliveryDate,
    DateTime? assignedAt,
    DateTime? startedAt,
    DateTime? completedAt,
    String? measurementMethod,
    Map<String, double>? measurements,
    String? sampleImageUrl,
    String? pickupTime,
    bool? isFastDelivery,
    double? fastDeliveryCharge,
    String? notes,
  }) {
    return JobModel(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      tailorId: tailorId ?? this.tailorId,
      tailorName: tailorName ?? this.tailorName,
      category: category ?? this.category,
      design: design ?? this.design,
      addOns: addOns ?? this.addOns,
      basePrice: basePrice ?? this.basePrice,
      totalPrice: totalPrice ?? this.totalPrice,
      assignmentAmount: assignmentAmount ?? this.assignmentAmount,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      estimatedDeliveryDate: estimatedDeliveryDate ?? this.estimatedDeliveryDate,
      actualDeliveryDate: actualDeliveryDate ?? this.actualDeliveryDate,
      assignedAt: assignedAt ?? this.assignedAt,
      startedAt: startedAt ?? this.startedAt,
      completedAt: completedAt ?? this.completedAt,
      measurementMethod: measurementMethod ?? this.measurementMethod,
      measurements: measurements ?? this.measurements,
      sampleImageUrl: sampleImageUrl ?? this.sampleImageUrl,
      pickupTime: pickupTime ?? this.pickupTime,
      isFastDelivery: isFastDelivery ?? this.isFastDelivery,
      fastDeliveryCharge: fastDeliveryCharge ?? this.fastDeliveryCharge,
      notes: notes ?? this.notes,
    );
  }
}

class AddOn {
  final String id;
  final String name;
  final double price;
  final String? description;

  AddOn({
    required this.id,
    required this.name,
    required this.price,
    this.description,
  });

  factory AddOn.fromMap(Map<String, dynamic> map) {
    return AddOn(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      price: (map['price'] ?? 0).toDouble(),
      description: map['description'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'description': description,
    };
  }
}