import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AxonNumberInput extends AxonBaseInput {
  const AxonNumberInput({
    super.key,
    required super.node,
    this.style,
    this.builder,
  });

  final AxonFormNumberInputStyle? style;
  final Widget Function(
    BuildContext context,
    AxonFormNode field,
    TextEditingController controller,
    void Function(String? val) onChanged,
    String? errorText,
  )?
  builder;

  @override
  State<AxonNumberInput> createState() => _AxonNumberInputState();
}

class _AxonNumberInputState extends State<AxonNumberInput> {
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

    final String newValue = controller.getNodeValue(widget.node.id).toString();
    if (_textController.text != newValue) {
      _textController.value = _textController.value.copyWith(
        text: newValue,
        selection: TextSelection.collapsed(offset: newValue.length),
      );
    }

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormNumberInputStyle>() ??
        AxonFormNumberInputStyle.fallback(context);

    return FormField<String?>(
      initialValue: _textController.text,
      validator: (String? s) {
        var res = controller.validateNode(widget.node.id, s);
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        if (widget.builder != null) {
          return widget.builder!(context, widget.node, _textController, (val) {
            formFieldState.didChange(val);
          }, formFieldState.errorText);
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _textController,
              decoration: style.decoration?.copyWith(
                labelText: widget.node.label,
                hintText: widget.node.placeholder,
              ),
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
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
