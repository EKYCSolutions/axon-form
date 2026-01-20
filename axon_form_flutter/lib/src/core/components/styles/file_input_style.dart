import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

class AxonFormFileInputStyle extends ThemeExtension<AxonFormFileInputStyle> {
  const AxonFormFileInputStyle({this.selectFileBuilder, this.showFileBuilder});

  final Widget Function(
    BuildContext context,
    String? placeholder,
    void Function() onFileSelect,
  )?
  selectFileBuilder;
  final Widget Function(
    BuildContext context,
    PlatformFile? file,
    void Function() onFileRemove,
  )?
  showFileBuilder;

  @override
  AxonFormFileInputStyle copyWith({
    final Widget Function(BuildContext, String?, void Function())?
    selectFileBuilder,
    final Widget Function(BuildContext, PlatformFile?, void Function())?
    showFileBuilder,
  }) {
    return AxonFormFileInputStyle(
      selectFileBuilder: selectFileBuilder ?? this.selectFileBuilder,
      showFileBuilder: showFileBuilder ?? this.showFileBuilder,
    );
  }

  @override
  ThemeExtension<AxonFormFileInputStyle> lerp(
    covariant ThemeExtension<AxonFormFileInputStyle>? other,
    double t,
  ) {
    if (other is! AxonFormFileInputStyle) {
      return this;
    }
    return AxonFormFileInputStyle(
      selectFileBuilder: t < 0.5 ? selectFileBuilder : other.selectFileBuilder,
      showFileBuilder: t < 0.5 ? showFileBuilder : other.showFileBuilder,
    );
  }

  // Helper to create a fallback based on the current context
  static AxonFormFileInputStyle fallback(BuildContext context) {
    return AxonFormFileInputStyle();
  }
}
