import 'package:flutter/material.dart';

class AxonFormRadioInputStyle extends ThemeExtension<AxonFormRadioInputStyle> {
  const AxonFormRadioInputStyle({this.titleStyle, this.activeColor});

  final TextStyle? titleStyle;
  final Color? activeColor;

  @override
  AxonFormRadioInputStyle copyWith({TextStyle? titleStyle}) {
    return AxonFormRadioInputStyle(titleStyle: titleStyle ?? this.titleStyle);
  }

  @override
  ThemeExtension<AxonFormRadioInputStyle> lerp(
    covariant ThemeExtension<AxonFormRadioInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormRadioInputStyle) {
      return this;
    }
    return AxonFormRadioInputStyle(
      titleStyle: t < 0.5 ? titleStyle : other.titleStyle,
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormRadioInputStyle fallback(BuildContext context) {
    return AxonFormRadioInputStyle();
  }
}
