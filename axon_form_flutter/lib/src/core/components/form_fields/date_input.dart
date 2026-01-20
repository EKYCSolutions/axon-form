import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:axon_form_flutter/src/core/components/styles/date_input_style.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AxonDateInput extends AxonBaseInput {
  const AxonDateInput({super.key, required super.node, this.style});

  final AxonFormDateInputStyle? style;

  @override
  State<AxonDateInput> createState() => _AxonDateInputState();
}

class _AxonDateInputState extends State<AxonDateInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final dateFormat = DateFormat('yyyy-MM-dd');

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormDateInputStyle>() ??
        AxonFormDateInputStyle.fallback(context);

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
                  builder: (context, child) {
                    return Theme(
                      data: ThemeData(
                        colorScheme: Theme.of(
                          context,
                        ).colorScheme.copyWith(primary: Colors.red),
                      ),
                      child: child!,
                    );
                  },
                );
                if (picked != null) {
                  formFieldState.didChange(picked);
                }
              },
              child: InputDecorator(
                decoration: style.inputDecoration ?? InputDecoration(),
                child: Text(
                  formFieldState.value != null
                      ? dateFormat.format(formFieldState.value!)
                      : widget.node.label,
                  style: style.labelStyle,
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
