import 'package:axon_form_flutter/axon_form_flutter.dart';
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
          validator: (value) {
            return Validators.validate(value, node.validationRules ?? []);
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
          validator: (value) {
            return Validators.validate(value?.id, node.validationRules ?? []);
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
          validator: (value) {
            return Validators.validate(value?.id, node.validationRules ?? []);
          },
        );
      case "datetime":
        return BaseDatePickerInput(
          onChanged: (value) {
            _formData[node.fieldName!] = value;
          },
          label: node.label ?? "LABEL",
          validator: (value) {
            return Validators.validate(value, node.validationRules ?? []);
          },
        );

      case "file":
        return BaseFileInput(
          onChanged: (value) {
            _formData[node.fieldName!] = value;
          },
          validator: (value) {
            return Validators.validate(
              value.toString(),
              node.validationRules ?? [],
            );
          },
          builder: (context, field) {
            return SizedBox(
              height: 60,
              child: Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Stack(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(0),
                        child: Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(50),
                            // color: context.colorScheme.secondary.withOpacity(0.1),
                          ),
                          child: Center(
                            child: Icon(Icons.file_present_rounded),
                          ),
                        ),
                      ),
                      if (field.value != null)
                        const Positioned(
                          bottom: 4,
                          right: 4,
                          child: Icon(Icons.check_circle),
                        ),
                      if (field.value == null)
                        Positioned(
                          bottom: 4,
                          right: 4,
                          child: Icon(Icons.add_circle_rounded),
                        ),
                    ],
                  ),
                  const SizedBox(width: 8),
                  Expanded(flex: 5, child: Text(node.label ?? "LABEL")),
                  const Spacer(),
                  field.value == null
                      ? Icon(Icons.arrow_drop_down_rounded)
                      : IconButton(
                          onPressed: () async {
                            // bool confirm = await showConfirm(
                            //   context: context,
                            //   title: "លុបឯកសារ?",
                            // );
                            // if (confirm) {
                            //   field.didChange(null);
                            //   widget.onRemoved?.call();
                            // }
                          },
                          icon: Icon(Icons.cancel),
                        ),
                ],
              ),
            );
          },
        );

      default:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    final nodes = widget.formGraph.nodes.where((n) => n.type == "input");

    return Form(
      key: _formKey,

      child: Padding(
        padding: EdgeInsetsGeometry.all(16),
        child: SingleChildScrollView(
          child: Column(
            children: [
              ...nodes.map(_buildField),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {

                    


                  if (_formKey.currentState!.validate()) {
                    _formKey.currentState!.save();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Form submitted: $_formData")),
                    );
                  }
                },
                child: const Text("Submit"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
