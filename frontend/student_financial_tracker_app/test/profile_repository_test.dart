import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/profile/profile_repository.dart';

const _baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

void main() {
  test('fetches and updates user profile from the backend', () async {
    final dio = Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        headers: {'Content-Type': 'application/json'},
      ),
    );
    final unique = DateTime.now().millisecondsSinceEpoch;

    final authResponse = await dio.post<Map<String, dynamic>>(
      '/auth/register',
      data: {
        'name': 'Profile Tester',
        'email': 'profile-$unique@example.com',
        'password': 'password123',
      },
    );
    final tokens = authResponse.data!['tokens'] as Map<String, dynamic>;
    dio.options.headers['Authorization'] = 'Bearer ${tokens['accessToken']}';

    final repository = ProfileRepository(dio);
    await repository.updateProfile(
      name: 'Profile Tester Updated',
      university: 'Universitas Test',
      phoneNumber: '08123456789',
      monthlyAllowance: 1500000,
    );

    final profile = await repository.getProfile();

    expect(profile['name'], 'Profile Tester Updated');
    expect(profile['university'], 'Universitas Test');
    expect(profile['phoneNumber'], '08123456789');
    expect(profile['monthlyAllowance'], 1500000);

    await repository.timeSkip(days: 3);

    final profileAfterTimeSkip = await repository.getProfile();

    expect(profileAfterTimeSkip['timeSkipDays'], 3);
  });
}
