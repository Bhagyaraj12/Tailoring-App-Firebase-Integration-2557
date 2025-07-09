import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tailoring_app/models/job_model.dart';
import 'package:tailoring_app/providers/job_provider.dart';
import 'package:tailoring_app/screens/customer/design_selection_screen.dart';
import 'package:tailoring_app/theme/app_theme.dart';

class CategorySelectionScreen extends StatelessWidget {
  const CategorySelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = [
      {
        'id': 'blouse',
        'name': 'Blouse',
        'icon': Icons.person,
        'color': Colors.pink,
        'basePrice': 500.0,
      },
      {
        'id': 'shirt',
        'name': 'Shirt',
        'icon': Icons.person,
        'color': Colors.blue,
        'basePrice': 600.0,
      },
      {
        'id': 'kurti',
        'name': 'Kurti',
        'icon': Icons.person,
        'color': Colors.purple,
        'basePrice': 800.0,
      },
      {
        'id': 'lehenga',
        'name': 'Lehenga',
        'icon': Icons.person,
        'color': Colors.orange,
        'basePrice': 2000.0,
      },
      {
        'id': 'kidswear',
        'name': 'Kidswear',
        'icon': Icons.child_care,
        'color': Colors.green,
        'basePrice': 300.0,
      },
      {
        'id': 'saree',
        'name': 'Saree Blouse',
        'icon': Icons.person,
        'color': Colors.red,
        'basePrice': 450.0,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Category'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'What would you like to stitch?',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                'Choose a category to get started',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.9,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final category = categories[index];
                  return _buildCategoryCard(
                    context,
                    category['id'] as String,
                    category['name'] as String,
                    category['icon'] as IconData,
                    category['color'] as Color,
                    category['basePrice'] as double,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildCategoryCard(
    BuildContext context,
    String id,
    String name,
    IconData icon,
    Color color,
    double basePrice,
  ) {
    final jobProvider = Provider.of<JobProvider>(context, listen: false);
    
    return InkWell(
      onTap: () {
        jobProvider.setSelectedCategory(id, basePrice);
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DesignSelectionScreen(
              categoryId: id,
              categoryName: name,
            ),
          ),
        );
      },
      borderRadius: BorderRadius.circular(16),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: color,
                  size: 40,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                name,
                style: Theme.of(context).textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Starting at ₹${basePrice.toInt()}',
                style: TextStyle(
                  color: AppTheme.primaryColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}