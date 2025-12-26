import 'package:flutter/material.dart';
import '../models/models.dart';
import '../state/state.dart';
import 'config.dart';

/// Builder for custom field widgets
typedef FieldBuilder = Widget Function(
  BuildContext context,
  FormNode node,
  FormStateNotifier formState,
  FormTheme theme,
);

/// Builder for custom page navigation controls
typedef NavigationBuilder = Widget Function(
  BuildContext context,
  int currentPage,
  int totalPages,
  VoidCallback? onNext,
  VoidCallback? onPrevious,
  VoidCallback? onSubmit,
);

/// Builder for custom progress indicator
typedef ProgressBuilder = Widget Function(
  BuildContext context,
  int currentPage,
  int totalPages,
);

/// Builder for custom page header
typedef PageHeaderBuilder = Widget Function(
  BuildContext context,
  FormPage page,
);

/// Builder for custom error display
typedef ErrorBuilder = Widget Function(
  BuildContext context,
  String error,
);

/// Builder for custom loading indicator
typedef LoadingBuilder = Widget Function(BuildContext context);

/// Container for all custom builders
class FormBuilders {
  /// Custom builders for specific field types (using enum)
  final Map<FieldType, FieldBuilder>? fieldBuilders;
  
  
  /// Custom navigation controls builder
  final NavigationBuilder? navigationBuilder;
  
  /// Custom progress indicator builder
  final ProgressBuilder? progressBuilder;
  
  /// Custom page header builder
  final PageHeaderBuilder? pageHeaderBuilder;
  
  /// Custom error display builder
  final ErrorBuilder? errorBuilder;
  
  /// Custom loading indicator builder
  final LoadingBuilder? loadingBuilder;
  
  /// Global field wrapper builder (wraps every field)
  final Widget Function(BuildContext context, Widget field)? fieldWrapperBuilder;

  const FormBuilders({
    this.fieldBuilders,

    this.navigationBuilder,
    this.progressBuilder,
    this.pageHeaderBuilder,
    this.errorBuilder,
    this.loadingBuilder,
    this.fieldWrapperBuilder,
  });

  /// Get custom builder for a specific field type (enum version)
  FieldBuilder? getFieldBuilder(FieldType? fieldType) {
    if (fieldType == null) return null;
    
    // Try enum map first
    if (fieldBuilders != null && fieldBuilders!.containsKey(fieldType)) {
      return fieldBuilders![fieldType];
    }
    return null;
    
  }

  /// Get custom builder for a specific field type (string version for backward compatibility)
  FieldBuilder? getFieldBuilderByString(String? fieldTypeString) {
    if (fieldTypeString == null) return null;
    
    final fieldType = FieldType.fromString(fieldTypeString);
    if (fieldType != null) {
      return getFieldBuilder(fieldType);
    }
    
    return null;
  }
}
