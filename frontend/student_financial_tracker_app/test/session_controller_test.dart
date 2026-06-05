import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_financial_tracker_app/src/core/session/session_controller.dart';

void main() {
  test('SessionController increments when tokens are cleared', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    expect(container.read(sessionControllerProvider), 0);

    container
        .read(sessionControllerProvider.notifier)
        .notifyTokenCleared();

    expect(container.read(sessionControllerProvider), 1);
  });
}
