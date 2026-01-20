import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:flutter/material.dart';

class AxonTextInput extends AxonBaseInput {
  const AxonTextInput({super.key, required super.node});

  @override
  State<AxonTextInput> createState() => _AxonTextInputState();
}

class _AxonTextInputState extends State<AxonTextInput> {
  late TextEditingController _textController;

  @override
  void initState() {
    super.initState();
    final initialValue = widget.node.value?.toString();
    _textController = TextEditingController(text: initialValue);
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    return FormField<String?>(
      initialValue: _textController.text,
      validator: (String? s) {
        var res = controller.validateNode(widget.node.id, s);
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _textController,
              decoration: InputDecoration(hintText: widget.node.label),
              onChanged: (String s) {
                formFieldState.didChange(s);
              },
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
