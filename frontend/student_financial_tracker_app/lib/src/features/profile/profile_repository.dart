import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/session/session_controller.dart';

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return ProfileRepository(ref.watch(dioProvider));
});

final profileProvider = FutureProvider<Map<String, dynamic>>((ref) {
  ref.watch(sessionControllerProvider);
  return ref.watch(profileRepositoryProvider).getProfile();
});

class ProfileRepository {
  ProfileRepository(this._dio);

  final Dio _dio;

  Future<Map<String, dynamic>> getProfile() async {
    try {
      final response = await _dio.get('/users/me');
      return response.data as Map<String, dynamic>;
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> updateProfile({
    required String name,
    String? phoneNumber,
    String? university,
    num? monthlyAllowance,
    num? expectedDailySpend,
    int? timeSkipDays,
  }) async {
    try {
      final data = <String, dynamic>{
        'name': name,
      };

      if (phoneNumber != null) {
        data['phoneNumber'] = phoneNumber;
      }
      if (university != null) {
        data['university'] = university;
      }
      if (monthlyAllowance != null) {
        data['monthlyAllowance'] = monthlyAllowance;
      }
      if (expectedDailySpend != null) {
        data['expectedDailySpend'] = expectedDailySpend;
      }
      if (timeSkipDays != null) {
        data['timeSkipDays'] = timeSkipDays;
      }

      await _dio.patch('/users/me', data: data);
    } catch (error) {
      throw mapDioError(error);
    }
  }

  Future<void> timeSkip({required int days}) async {
    try {
      await _dio.post('/users/me/timeskip', data: {'days': days});
    } catch (error) {
      throw mapDioError(error);
    }
  }
}
