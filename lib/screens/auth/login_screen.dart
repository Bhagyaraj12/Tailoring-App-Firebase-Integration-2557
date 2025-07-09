import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tailoring_app/providers/auth_provider.dart';
import 'package:tailoring_app/screens/auth/otp_verification_screen.dart';
import 'package:tailoring_app/theme/app_theme.dart';
import 'package:tailoring_app/widgets/app_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    // Format phone number with country code if needed
    String phoneNumber = _phoneController.text.trim();
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+91$phoneNumber'; // Default to India country code
    }
    
    await authProvider.sendOTP(phoneNumber);
    
    setState(() {
      _isLoading = false;
    });
    
    if (authProvider.errorMessage == null) {
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => OTPVerificationScreen(
            phoneNumber: phoneNumber,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Icon(
                    Icons.content_cut,
                    size: 60,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(height: 24),
                
                // Welcome text
                Text(
                  'Welcome to Tailor Connect',
                  style: Theme.of(context).textTheme.displaySmall,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                
                Text(
                  'Enter your phone number to continue',
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),
                
                // Phone number form
                Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Phone Number',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      
                      TextFormField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                          hintText: 'Enter your phone number',
                          prefixIcon: const Icon(Icons.phone),
                          prefixText: '+91 ',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your phone number';
                          }
                          if (value.length < 10) {
                            return 'Please enter a valid phone number';
                          }
                          return null;
                        },
                      ),
                      
                      if (authProvider.errorMessage != null) ...[
                        const SizedBox(height: 16),
                        Text(
                          authProvider.errorMessage!,
                          style: TextStyle(color: AppTheme.errorColor),
                        ),
                      ],
                      
                      const SizedBox(height: 32),
                      
                      AppButton(
                        text: 'Send OTP',
                        onPressed: _isLoading ? null : _sendOtp,
                        isLoading: _isLoading,
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Demo login options
                const Divider(),
                const SizedBox(height: 16),
                
                Text(
                  'Demo Login Options',
                  style: Theme.of(context).textTheme.titleMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildDemoButton('Customer', Icons.person, context),
                    _buildDemoButton('Tailor', Icons.cut, context),
                    _buildDemoButton('Admin', Icons.admin_panel_settings, context),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildDemoButton(String role, IconData icon, BuildContext context) {
    return InkWell(
      onTap: () {
        _phoneController.text = '9876543210';
        _sendOtp();
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          color: AppTheme.cardColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.primaryColor.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppTheme.primaryColor),
            const SizedBox(height: 8),
            Text(
              role,
              style: TextStyle(color: AppTheme.primaryColor),
            ),
          ],
        ),
      ),
    );
  }
}