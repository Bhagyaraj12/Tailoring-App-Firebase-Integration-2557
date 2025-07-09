import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tailoring_app/providers/job_provider.dart';
import 'package:tailoring_app/screens/customer/addon_selection_screen.dart';
import 'package:tailoring_app/theme/app_theme.dart';

class DesignSelectionScreen extends StatelessWidget {
  final String categoryId;
  final String categoryName;

  const DesignSelectionScreen({
    super.key,
    required this.categoryId,
    required this.categoryName,
  });

  @override
  Widget build(BuildContext context) {
    // Design data map based on category
    final designsMap = {
      'blouse': [
        {
          'id': 'boat-neck',
          'name': 'Boat Neck',
          'image': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
          'price': 0.0,
        },
        {
          'id': 'puff-sleeve',
          'name': 'Puff Sleeve',
          'image': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop',
          'price': 100.0,
        },
        {
          'id': 'backless',
          'name': 'Backless',
          'image': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
          'price': 150.0,
        },
        {
          'id': 'high-neck',
          'name': 'High Neck',
          'image': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop',
          'price': 80.0,
        },
      ],
      'shirt': [
        {
          'id': 'formal',
          'name': 'Formal Shirt',
          'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
          'price': 0.0,
        },
        {
          'id': 'casual',
          'name': 'Casual Shirt',
          'image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
          'price': 50.0,
        },
        {
          'id': 'party',
          'name': 'Party Shirt',
          'image': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
          'price': 120.0,
        },
      ],
      'kurti': [
        {
          'id': 'straight',
          'name': 'Straight Cut',
          'image': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop',
          'price': 0.0,
        },
        {
          'id': 'anarkali',
          'name': 'Anarkali',
          'image': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
          'price': 200.0,
        },
        {
          'id': 'a-line',
          'name': 'A-Line',
          'image': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop',
          'price': 150.0,
        },
      ],
      'lehenga': [
        {
          'id': 'traditional',
          'name': 'Traditional',
          'image': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop',
          'price': 0.0,
        },
        {
          'id': 'indo-western',
          'name': 'Indo-Western',
          'image': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
          'price': 500.0,
        },
        {
          'id': 'party-wear',
          'name': 'Party Wear',
          'image': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop',
          'price': 800.0,
        },
      ],
      'kidswear': [
        {
          'id': 'frock',
          'name': 'Frock',
          'image': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
          'price': 0.0,
        },
        {
          'id': 'shirt-pant',
          'name': 'Shirt & Pant',
          'image': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop',
          'price': 100.0,
        },
        {
          'id': 'ethnic',
          'name': 'Ethnic Wear',
          'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
          'price': 150.0,
        },
      ],
      'saree': [
        {
          'id': 'basic',
          'name': 'Basic Blouse',
          'image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop',
          'price': 0.0,
        },
        {
          'id': 'designer',
          'name': 'Designer Blouse',
          'image': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
          'price': 200.0,
        },
        {
          'id': 'heavy-work',
          'name': 'Heavy Work',
          'image': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=300&h=300&fit=crop',
          'price': 300.0,
        },
      ],
    };

    // Get designs for selected category
    final designs = designsMap[categoryId] ?? [];
    final jobProvider = Provider.of<JobProvider>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Select $categoryName Design'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Choose a design',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Select your preferred $categoryName design',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 24),
                    
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.8,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemCount: designs.length,
                      itemBuilder: (context, index) {
                        final design = designs[index];
                        final isSelected = jobProvider.selectedDesign == design['id'];
                        
                        return _buildDesignCard(
                          context,
                          design['id'] as String,
                          design['name'] as String,
                          design['image'] as String,
                          design['price'] as double,
                          isSelected,
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
            
            // Bottom bar with continue button
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (jobProvider.selectedDesign != null) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Base Price:',
                          style: Theme.of(context).textTheme.bodyLarge,
                        ),
                        Text(
                          '₹${jobProvider.totalPrice.toStringAsFixed(0)}',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: AppTheme.primaryColor,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                  ],
                  
                  ElevatedButton(
                    onPressed: jobProvider.selectedDesign == null
                        ? null
                        : () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const AddonSelectionScreen(),
                              ),
                            );
                          },
                    child: const Text('Continue to Add-ons'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildDesignCard(
    BuildContext context,
    String id,
    String name,
    String imageUrl,
    double price,
    bool isSelected,
  ) {
    final jobProvider = Provider.of<JobProvider>(context, listen: false);
    
    return InkWell(
      onTap: () {
        jobProvider.setSelectedDesign(id, price);
      },
      borderRadius: BorderRadius.circular(16),
      child: Card(
        elevation: isSelected ? 4 : 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: isSelected
              ? BorderSide(color: AppTheme.primaryColor, width: 2)
              : BorderSide.none,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Design image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
              child: Stack(
                children: [
                  Image.network(
                    imageUrl,
                    height: 120,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                  if (isSelected)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.check,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            
            // Design details
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: Theme.of(context).textTheme.titleMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    price == 0 ? 'Base Price' : '+₹${price.toInt()}',
                    style: TextStyle(
                      color: AppTheme.primaryColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}