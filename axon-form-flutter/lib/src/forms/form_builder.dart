import 'package:axon_form_flutter/src/base_inputs/base_input.dart';
import 'package:axon_form_flutter/src/extensions/extension.dart';
import 'package:flutter/material.dart';

import '../models/model.dart';

class FormBuilder extends StatefulWidget {
  final FormGraph formGraph;
  const FormBuilder({super.key, required this.formGraph});

  @override
  State<FormBuilder> createState() => _FormBuilderState();
}

class _FormBuilderState extends State<FormBuilder> {
  final Map<String, dynamic> _formData = {};
  final _formKey = GlobalKey<FormState>();

  Widget _buildField(Node node) {
    switch (node.fieldType) {
      case "text":
        return BaseTextInput(
          label: node.label ?? "LABEL",

          onChanged: (value) {
            _formData[node.fieldName!] = value;
          },
        );

      case "dropdown":
        final options = widget.formGraph.getOptionsForNode(node.id ?? "");
        return BaseDropdownRadioSelectInput(
          options: options,
          sheetLabel: "Select",
          label: node.label ?? "LABEL",
          onSelected: (value) {
            setState(() {
              _formData[node.fieldName!] = value;
            });
          },
        );

      case "radio":
        final options = widget.formGraph.getOptionsForNode(node.id ?? "");
        return BaseFormRadioGroupInput(
          options: options,
          labelText: node.label,

          onSelected: (value) {
            setState(() {
              _formData[node.fieldName!] = value;
            });
          },
        );

      // case "file":
      //   return ElevatedButton.icon(
      //     icon: const Icon(Icons.upload_file),
      //     label: Text(node.label),
      //     onPressed: () async {
      //       // Integrate with file picker here
      //       setState(() {
      //         _formData[node.fieldName!] = "dummy_receipt.pdf";
      //       });
      //     },
      //   );

      default:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    final nodes = widget.formGraph.nodes.where((n) => n.type == "input");

    return Form(
      key: _formKey,

      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ...nodes.map(_buildField),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                print("Collected Data: $_formData");
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Form submitted: $_formData")),
                );
              }
            },
            child: const Text("Submit"),
          ),
        ],
      ),
    );
  }
}
