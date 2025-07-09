import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:tailoring_app/firebase_options.dart';
import 'package:tailoring_app/providers/auth_provider.dart';
import 'package:tailoring_app/providers/job_provider.dart';
import 'package:tailoring_app/providers/tailor_provider.dart';
import 'package:tailoring_app/screens/splash_screen.dart';
import 'package:tailoring_app/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => JobProvider()),
        ChangeNotifierProvider(create: (_) => TailorProvider()),
      ],
      child: MaterialApp(
        title: 'Tailoring App',
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: false,
        home: const SplashScreen(),
      ),
    );
  }
}