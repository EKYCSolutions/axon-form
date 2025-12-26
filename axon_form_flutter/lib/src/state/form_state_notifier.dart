import 'package:flutter/material.dart';
import '../models/form_config.dart';

class FormStateNotifier extends ChangeNotifier {
  final Map<String, dynamic> _formData = {};
  final Map<String, String?> _errors = {};
  final FormConfig config;

  FormStateNotifier(this.config);

  // Get value for a field
  dynamic getValue(String fieldName) => _formData[fieldName];

  // Set value for a field
  void setValue(String fieldName, dynamic value) {
    _formData[fieldName] = value;
    _errors[fieldName] = null; // Clear error when value changes
    notifyListeners();
  }

  // Get error for a field
  String? getError(String fieldName) => _errors[fieldName];

  // Set error for a field
  void setError(String fieldName, String? error) {
    _errors[fieldName] = error;
    notifyListeners();
  }

  // Validate a single field
  String? validateField(FormNode node) {
    final value = _formData[node.fieldName];

    for (final rule in node.validationRules) {
      switch (rule.type) {
        case 'required':
          if (value == null ||
              (value is String && value.isEmpty) ||
              (value is List && value.isEmpty) ||
              (value is bool && !value)) {
            return rule.message;
          }
          break;
        case 'min_length':
          if (value is String && value.length < (rule.value as int)) {
            return rule.message;
          }
          break;
        case 'min':
          if (value is num && value < (rule.value as num)) {
            return rule.message;
          }
          break;
        case 'max':
          if (value is num && value > (rule.value as num)) {
            return rule.message;
          }
          break;
      }
    }
    return null;
  }

  // Validate all fields on a page
  bool validatePage(List<String> fieldIds) {
    bool isValid = true;

    for (final fieldId in fieldIds) {
      final node = config.nodes.firstWhere(
        (n) => n.id == fieldId,
        orElse: () => throw Exception('Node not found: $fieldId'),
      );

      if (node.type == 'input') {
        final error = validateField(node);
        if (error != null) {
          _errors[node.fieldName] = error;
          isValid = false;
        }
      }
    }

    if (!isValid) {
      notifyListeners();
    }

    return isValid;
  }

  // Get all form data
  Map<String, dynamic> getAllData() => Map.from(_formData);

  // Clear all form data
  void clear() {
    _formData.clear();
    _errors.clear();
    notifyListeners();
  }

  // Get options for a field (dropdown, radio, multi-select)
  List<FormNode> getOptionsForField(String fieldId) {
    final edges = config.edges.where(
      (edge) => edge.sourceNode == fieldId && edge.type == 'has_options',
    );

    return edges.map((edge) {
      return config.nodes.firstWhere((node) => node.id == edge.targetNode);
    }).toList();
  }
}
