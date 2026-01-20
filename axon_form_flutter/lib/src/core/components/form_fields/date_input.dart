import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AxonDateInput extends AxonBaseInput {
  const AxonDateInput({super.key, required super.node});

  @override
  State<AxonDateInput> createState() => _AxonDateInputState();
}

class _AxonDateInputState extends State<AxonDateInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final dateFormat = DateFormat('yyyy-MM-dd');

    return FormField<DateTime?>(
      initialValue: widget.node.value != null
          ? DateTime.tryParse(widget.node.value)
          : null,
      validator: (DateTime? dt) {
        String? s = dt?.toIso8601String();
        var res = controller.validateNode(widget.node.id, s);
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            InkWell(
              onTap: () async {
                final DateTime? picked = await showDatePicker(
                  context: context,
                  initialDate: formFieldState.value ?? DateTime.now(),
                  firstDate: DateTime(1900),
                  lastDate: DateTime(2100),
                );
                if (picked != null) {
                  // onChanged(picked);
                  formFieldState.didChange(picked);
                }
              },
              child: InputDecorator(
                // decoration: getDecoration().copyWith(
                //   suffixIcon: Icon(Icons.calendar_today),
                // ),
                decoration: InputDecoration(),
                child: Text(
                  formFieldState.value != null
                      ? dateFormat.format(formFieldState.value!)
                      : widget.node.label,
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ),
            if (formFieldState.errorText != null)
              Padding(
                padding: const EdgeInsets.only(top: 4.0),
                child: buildError(context, formFieldState.errorText!),
              ),
          ],
        );
      },
    );
  }
}
