import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class BaseCheckbox extends StatelessWidget {
  const BaseCheckbox({super.key, required this.checked});

  final bool checked;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 24,
      width: 24,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(50),
        color: checked ? context.colorScheme.primary : null,
        border: Border.all(color: context.colorScheme.primary, width: 2),
      ),
      child: checked
          ? Icon(Icons.check, color: Colors.white, size: 16)
          : Container(),
    );
  }
}
