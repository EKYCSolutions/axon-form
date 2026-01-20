import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/axon_form_fields.dart';
import 'package:axon_form_flutter/src/core/models/node.dart';
import 'package:flutter/widgets.dart';

class AxonFormField extends StatelessWidget {
  final AxonFormNode node;

  const AxonFormField({super.key, required this.node});

  @override
  Widget build(BuildContext context) {
    switch (node.fieldType) {
      case FieldType.text:
        return AxonTextInput(node: node);
      //
      case FieldType.number:
        return AxonNumberInput(node: node);
      //
      case FieldType.date:
        return AxonDateInput(node: node);
      //
      case FieldType.password:
        return AxonPasswordInput(node: node);
      //
      case FieldType.radio:
        return AxonRadioInput(node: node);
      //
      case FieldType.dropdown:
        return AxonDropdownInput(node: node);
      //
      case FieldType.addressDropdown:
        return AxonAddressDropdownInput(node: node);
      //
      case FieldType.checkbox:
        return AxonCheckboxInput(node: node);
      //
      case FieldType.multiSelect:
        return AxonMultiSelectInput(node: node);
      //
      case FieldType.file:
        return AxonFileInput(node: node);
      default:
        return AxonTextInput(node: node);
    }
  }
}
