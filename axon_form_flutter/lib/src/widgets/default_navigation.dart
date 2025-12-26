import 'package:flutter/material.dart';
import '../config/form_theme.dart';

class DefaultNavigation extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final VoidCallback? onNext;
  final VoidCallback? onPrevious;
  final VoidCallback? onSubmit;
  final FormTheme theme;

  const DefaultNavigation({
    Key? key,
    required this.currentPage,
    required this.totalPages,
    this.onNext,
    this.onPrevious,
    this.onSubmit,
    required this.theme,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        if (currentPage > 0)
          OutlinedButton(
            onPressed: onPrevious,
            style: theme.secondaryButtonStyle,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.arrow_back, size: 16),
                SizedBox(width: 4),
                Text('Previous'),
              ],
            ),
          )
        else
          SizedBox.shrink(),
        if (currentPage < totalPages - 1)
          ElevatedButton(
            onPressed: onNext,
            style: theme.primaryButtonStyle,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Next'),
                SizedBox(width: 4),
                Icon(Icons.arrow_forward, size: 16),
              ],
            ),
          )
        else
          ElevatedButton(
            onPressed: onSubmit,
            style: theme.primaryButtonStyle,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Submit'),
                SizedBox(width: 4),
                Icon(Icons.check, size: 16),
              ],
            ),
          ),
      ],
    );
  }
}
