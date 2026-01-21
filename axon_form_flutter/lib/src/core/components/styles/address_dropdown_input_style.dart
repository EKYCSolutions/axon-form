import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class AxonFormAddressDropdownInputStyle extends AxonFormDropdownInputStyle {
  const AxonFormAddressDropdownInputStyle({
    this.addressSelectedItemBuilder,
    this.addressItemBuilder,
    super.titleStyle,
    super.activeColor,
    // Builders are handled locally by addressSelectedItemBuilder/addressItemBuilder
    super.elevation = 8,
    super.style,
    super.underline,
    super.icon,
    super.iconDisabledColor,
    super.iconEnabledColor,
    super.iconSize = 24.0,
    super.isDense = false,
    super.isExpanded = false,
    super.itemHeight = kMinInteractiveDimension,
    super.menuWidth,
    super.focusColor,
    super.autofocus = false,
    super.dropdownColor,
    super.menuMaxHeight,
    super.enableFeedback,
    super.alignment = AlignmentDirectional.centerStart,
    super.borderRadius,
    super.padding,
    super.barrierDismissible = true,
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
