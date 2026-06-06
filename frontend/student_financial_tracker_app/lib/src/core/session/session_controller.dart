import 'package:flutter_riverpod/flutter_riverpod.dart';

final sessionControllerProvider = NotifierProvider<SessionController, int>(
  SessionController.new,
);

class SessionController extends Notifier<int> {
  @override
  int build() => 0;

  void notifyTokenCleared() {
    state++;
  }
}
