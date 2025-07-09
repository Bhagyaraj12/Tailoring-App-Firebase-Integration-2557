import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tailoring_app/providers/auth_provider.dart';
import 'package:tailoring_app/screens/auth/login_screen.dart';
import 'package:tailoring_app/screens/admin/admin_dashboard.dart';
import 'package:tailoring_app/screens/customer/customer_dashboard.dart';
import 'package:tailoring_app/screens/tailor/tailor_dashboard.dart';
import 'package:tailoring_app/models/user_model.dart';
import 'package:tailoring_app/theme/app_theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToNextScreen();
  }

  Future<void> _navigateToNextScreen() async {
    await Future.delayed(const Duration(seconds: 2));
    
    if (!mounted) return;
    
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (authProvider.isAuthenticated) {
      // Navigate based on user role
      switch (authProvider.userRole) {
        case UserRole.admin:
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const AdminDashboard()),
          );
          break;
        case UserRole.tailor:
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const TailorDashboard()),
          );
          break;
        case UserRole.customer:
        default:
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const CustomerDashboard()),
          );
          break;
      }
    } else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo
            Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Icon(
                Icons.content_cut,
                size: 80,
                color: AppTheme.primaryColor,
              ),
            ),
            const SizedBox(height: 24),
            
            // App name
            Text(
              'Tailor Connect',
              style: Theme.of(context).textTheme.displayMedium?.copyWith(
                color: AppTheme.primaryColor,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            
            // Tagline
            Text(
              'Professional Tailoring Services',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: AppTheme.textSecondaryColor,
              ),
            ),
            const SizedBox(height: 48),
            
            // Loading indicator
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
            ),
          ],
        ),
      ),
    );
  }
}