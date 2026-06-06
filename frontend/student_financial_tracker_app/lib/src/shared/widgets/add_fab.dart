import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class AddFab extends StatelessWidget {
  const AddFab({required this.onPressed, required this.tooltip, super.key});

  final VoidCallback onPressed;
  final String tooltip;

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: onPressed,
      tooltip: tooltip,
      backgroundColor: AppColors.ink,
      foregroundColor: Colors.white,
      elevation: 8,
      shape: const CircleBorder(),
      child: const Icon(Icons.add, size: 30),
    );
  }
}
