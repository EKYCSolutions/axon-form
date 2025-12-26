import 'package:flutter/material.dart';
import '../config/form_theme.dart';

class DefaultProgress extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final FormTheme theme;

  const DefaultProgress({
    Key? key,
    required this.currentPage,
    required this.totalPages,
    required this.theme,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LinearProgressIndicator(
      value: (currentPage + 1) / totalPages,
      backgroundColor: theme.progressIndicatorTheme?.linearTrackColor ?? Colors.grey[300],
      valueColor: AlwaysStoppedAnimation<Color>(
        theme.progressIndicatorTheme?.color ?? Theme.of(context).primaryColor,
      ),
    );
  }
}
