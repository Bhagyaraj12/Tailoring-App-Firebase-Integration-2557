import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pinput/pinput.dart';
import 'package:tailoring_app/models/user_model.dart';
import 'package:tailoring_app/providers/auth_provider.dart';
import 'package:tailoring_app/screens/admin/admin_dashboard.dart';
import 'package:tailoring_app/screens/customer/customer_dashboard.dart';
import 'package:tailoring_app/screens/tailor/tailor_dashboard.dart';
import 'package:tailoring_app/theme/app_theme.dart';
import 'package:tailoring_app/widgets/app_button.dart';

class OTPVerificationScreen extends StatefulWidget {
  final String phoneNumber;

  const OTPVerificationScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<OTPVerificationScreen> createState() => _OTPVerificationScreenState();
}

class _OTPVerificationScreenState extends State<OTPVerificationScreen> {
  final _otpController = TextEditingController();
  bool _isVerifying = false;
  String? _errorMessage;

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _verifyOtp() async {
    if (_otpController.text.length < 6) {
      setState(() {
        _errorMessage = 'Please enter a valid OTP';
      });
      return;
    }

    setState(() {
      _isVerifying = true;
      _errorMessage = null;
    });

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.verifyOTP(_otpController.text);

    if (!mounted) return;

    if (success) {
      // Navigate based on user role
      switch (authProvider.userRole) {
        case UserRole.admin:
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const AdminDashboard()),
            (route) => false,
          );
          break;
        case UserRole.tailor:
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const TailorDashboard()),
            (route) => false,
          );
          break;
        case UserRole.customer:
        default:
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const CustomerDashboard()),
            (route) => false,
          );
          break;
      }
    } else {
      setState(() {
        _isVerifying = false;
        _errorMessage = authProvider.errorMessage ?? 'Failed to verify OTP';
      });
    }
  }

  Future<void> _resendOtp() async {
    setState(() {
      _errorMessage = null;
    });

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.sendOTP(widget.phoneNumber);

    if (authProvider.errorMessage != null) {
      setState(() {
        _errorMessage = authProvider.errorMessage;
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('OTP resent successfully')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final defaultPinTheme = PinTheme(
      width: 56,
      height: 60,
      textStyle: Theme.of(context).textTheme.titleLarge?.copyWith(color: AppTheme.textPrimaryColor),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.textLightColor),
      ),
    );

    final focusedPinTheme = defaultPinTheme.copyWith(
      decoration: defaultPinTheme.decoration?.copyWith(
        border: Border.all(color: AppTheme.primaryColor, width: 2),
      ),
    );

    final submittedPinTheme = defaultPinTheme.copyWith(
      decoration: defaultPinTheme.decoration?.copyWith(
        border: Border.all(color: AppTheme.primaryColor),
        color: AppTheme.primaryColor.withOpacity(0.1),
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Verify OTP'),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 24),
              
              Text(
                'Verification Code',
                style: Theme.of(context).textTheme.displaySmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              
              Text(
                'We have sent the verification code to\n${widget.phoneNumber}',
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              
              // OTP Input
              Pinput(
                controller: _otpController,
                length: 6,
                defaultPinTheme: defaultPinTheme,
                focusedPinTheme: focusedPinTheme,
                submittedPinTheme: submittedPinTheme,
                pinputAutovalidateMode: PinputAutovalidateMode.onSubmit,
                showCursor: true,
                onCompleted: (pin) {
                  // Auto-verify when all 6 digits are entered
                  _verifyOtp();
                },
              ),
              
              const SizedBox(height: 16),
              
              if (_errorMessage != null) ...[
                Text(
                  _errorMessage!,
                  style: TextStyle(color: AppTheme.errorColor),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
              ],
              
              // Verify button
              AppButton(
                text: 'Verify OTP',
                onPressed: _isVerifying ? null : _verifyOtp,
                isLoading: _isVerifying,
              ),
              
              const SizedBox(height: 24),
              
              // Resend OTP
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Didn't receive the code? ",
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  TextButton(
                    onPressed: _resendOtp,
                    child: Text(
                      'Resend',
                      style: TextStyle(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Demo code hint
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.infoColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.infoColor.withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    Text(
                      'Demo Mode',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: AppTheme.infoColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'For testing purposes, enter "123456" as the OTP',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppTheme.infoColor,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton(
                      onPressed: () {
                        _otpController.text = '123456';
                        _verifyOtp();
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.infoColor,
                        side: BorderSide(color: AppTheme.infoColor),
                      ),
                      child: const Text('Use Demo OTP'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}