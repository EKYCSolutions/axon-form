import 'package:flutter/material.dart';

class AxonFormDropdownInputStyle
    extends ThemeExtension<AxonFormDropdownInputStyle> {
  const AxonFormDropdownInputStyle({
    this.titleStyle,
    this.activeColor,
    this.selectedItemBuilder,
    this.itemBuilder,
    this.elevation = 8,
    this.style,
    this.underline,
    this.icon,
    this.iconDisabledColor,
    this.iconEnabledColor,
    this.iconSize = 24.0,
    this.isDense = false,
    this.isExpanded = true,
    this.itemHeight = kMinInteractiveDimension,
    this.menuWidth,
    this.focusColor,
    this.autofocus = false,
    this.dropdownColor,
    this.menuMaxHeight,
    this.enableFeedback,
    this.alignment = AlignmentDirectional.centerStart,
    this.borderRadius,
    this.padding,
    this.barrierDismissible = true,
  });

  final TextStyle? titleStyle;
  final Color? activeColor;
  final Widget Function(BuildContext context, String label)?
  selectedItemBuilder;
  final Widget Function(BuildContext context, String label, bool isSelected)?
  itemBuilder;

  // Added fields
  final int elevation;
  final TextStyle? style;
  final Widget? underline;
  final Widget? icon;
  final Color? iconDisabledColor;
  final Color? iconEnabledColor;
  final double iconSize;
  final bool isDense;
  final bool isExpanded;
  final double? itemHeight;
  final double? menuWidth;
  final Color? focusColor;
  final bool autofocus;
  final Color? dropdownColor;
  final double? menuMaxHeight;
  final bool? enableFeedback;
  final AlignmentGeometry alignment;
  final BorderRadius? borderRadius;
  final EdgeInsetsGeometry? padding;
  final bool barrierDismissible;

  @override
  AxonFormDropdownInputStyle copyWith({
    TextStyle? titleStyle,
    Color? activeColor,
    Widget Function(BuildContext context, String label)? selectedItemBuilder,
    Widget Function(BuildContext context, String label, bool isSelected)?
    itemBuilder,
    int? elevation,
    TextStyle? style,
    Widget? underline,
    Widget? icon,
    Color? iconDisabledColor,
    Color? iconEnabledColor,
    double? iconSize,
    bool? isDense,
    bool? isExpanded,
    double? itemHeight,
    double? menuWidth,
    Color? focusColor,
    bool? autofocus,
    Color? dropdownColor,
    double? menuMaxHeight,
    bool? enableFeedback,
    AlignmentGeometry? alignment,
    BorderRadius? borderRadius,
    EdgeInsetsGeometry? padding,
    bool? barrierDismissible,
  }) {
    return AxonFormDropdownInputStyle(
      titleStyle: titleStyle ?? this.titleStyle,
      activeColor: activeColor ?? this.activeColor,
      selectedItemBuilder: selectedItemBuilder ?? this.selectedItemBuilder,
      itemBuilder: itemBuilder ?? this.itemBuilder,
      elevation: elevation ?? this.elevation,
      style: style ?? this.style,
      underline: underline ?? this.underline,
      icon: icon ?? this.icon,
      iconDisabledColor: iconDisabledColor ?? this.iconDisabledColor,
      iconEnabledColor: iconEnabledColor ?? this.iconEnabledColor,
      iconSize: iconSize ?? this.iconSize,
      isDense: isDense ?? this.isDense,
      isExpanded: isExpanded ?? this.isExpanded,
      itemHeight: itemHeight ?? this.itemHeight,
      menuWidth: menuWidth ?? this.menuWidth,
      focusColor: focusColor ?? this.focusColor,
      autofocus: autofocus ?? this.autofocus,
      dropdownColor: dropdownColor ?? this.dropdownColor,
      menuMaxHeight: menuMaxHeight ?? this.menuMaxHeight,
      enableFeedback: enableFeedback ?? this.enableFeedback,
      alignment: alignment ?? this.alignment,
      borderRadius: borderRadius ?? this.borderRadius,
      padding: padding ?? this.padding,
      barrierDismissible: barrierDismissible ?? this.barrierDismissible,
    );
  }

  @override
  ThemeExtension<AxonFormDropdownInputStyle> lerp(
    covariant ThemeExtension<AxonFormDropdownInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormDropdownInputStyle) {
      return this;
    }
    return AxonFormDropdownInputStyle(
      titleStyle: TextStyle.lerp(titleStyle, other.titleStyle, t),
      activeColor: Color.lerp(activeColor, other.activeColor, t),
      selectedItemBuilder: t < 0.5
          ? selectedItemBuilder
          : other.selectedItemBuilder,
      itemBuilder: t < 0.5 ? itemBuilder : other.itemBuilder,
      elevation: other.elevation, // int values are not lerped
      style: TextStyle.lerp(style, other.style, t),
      underline: t < 0.5
          ? underline
          : other.underline, // Widget values are not lerped
      icon: t < 0.5 ? icon : other.icon, // Widget values are not lerped
      iconDisabledColor: Color.lerp(
        iconDisabledColor,
        other.iconDisabledColor,
        t,
      ),
      iconEnabledColor: Color.lerp(iconEnabledColor, other.iconEnabledColor, t),
      iconSize: (iconSize + (other.iconSize - iconSize) * t),
      isDense: other.isDense, // bool values are not lerped
      isExpanded: other.isExpanded, // bool values are not lerped
      itemHeight: (itemHeight != null && other.itemHeight != null)
          ? (itemHeight! + (other.itemHeight! - itemHeight!) * t)
          : other.itemHeight,
      menuWidth: (menuWidth != null && other.menuWidth != null)
          ? (menuWidth! + (other.menuWidth! - menuWidth!) * t)
          : other.menuWidth,
      focusColor: Color.lerp(focusColor, other.focusColor, t),
      autofocus: other.autofocus, // bool values are not lerped
      dropdownColor: Color.lerp(dropdownColor, other.dropdownColor, t),
      menuMaxHeight: (menuMaxHeight != null && other.menuMaxHeight != null)
          ? (menuMaxHeight! + (other.menuMaxHeight! - menuMaxHeight!) * t)
          : other.menuMaxHeight,
      enableFeedback: other.enableFeedback, // bool values are not lerped
      alignment:
          AlignmentGeometry.lerp(alignment, other.alignment, t) ?? alignment,
      borderRadius: BorderRadius.lerp(borderRadius, other.borderRadius, t),
      padding: EdgeInsetsGeometry.lerp(padding, other.padding, t),
      barrierDismissible:
          other.barrierDismissible, // bool values are not lerped
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormDropdownInputStyle fallback(BuildContext context) {
    return const AxonFormDropdownInputStyle();
  }
}
