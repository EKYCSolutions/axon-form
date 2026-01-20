import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class AxonFormAddressDropdownInputStyle extends AxonFormDropdownInputStyle {
  const AxonFormAddressDropdownInputStyle({
    this.addressSelectedItemBuilder,
    this.addressItemBuilder,
  });

  final Widget Function(BuildContext context, String labelKh, String labelEn)?
  addressSelectedItemBuilder;

  final Widget Function(
    BuildContext context,
    String labelKh,
    String labelEn,
    bool isSelected,
  )?
  addressItemBuilder;

  // Helper to create a fallback based on the current context
  static AxonFormAddressDropdownInputStyle fallback(BuildContext context) {
    return AxonFormAddressDropdownInputStyle();
  }
}
