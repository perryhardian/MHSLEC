import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/features/auth/auth_controller.dart';

void main() {
  test('AuthState stores authentication status', () {
    const loggedOut = AuthState(isAuthenticated: false);
    const loggedIn = AuthState(isAuthenticated: true);

    expect(loggedOut.isAuthenticated, isFalse);
    expect(loggedIn.isAuthenticated, isTrue);
  });
}
