import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class AxonPasswordInput extends AxonBaseInput {
  const AxonPasswordInput({
    super.key,
    required super.node,
    this.style,
    this.builder,
  });

  final AxonFormPasswordInputStyle? style;
  final Widget Function(
    BuildContext context,
    AxonFormNode field,
    TextEditingController controller,
    void Function(String? val) onChanged,
    String? errorText,
  )?
  builder;

  @override
  State<AxonPasswordInput> createState() => _AxonPasswordInputState();
}

class _AxonPasswordInputState extends State<AxonPasswordInput> {
  bool _obscureText = true;
  String? errorMessage;

  late TextEditingController _textController;

  @override
  void initState() {
    super.initState();
    _textController = TextEditingController();
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    final String newValue = controller.getNodeValue(widget.node.id) ?? '';
    if (_textController.text != newValue) {
      _textController.value = _textController.value.copyWith(
        text: newValue,
        selection: TextSelection.collapsed(offset: newValue.length),
      );
    }

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormPasswordInputStyle>() ??
        AxonFormPasswordInputStyle.fallback(context);

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
              obscureText: _obscureText,
              decoration: style.decoration?.copyWith(
                labelText: widget.node.label,
                hintText: widget.node.placeholder,
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureText ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () => setState(() => _obscureText = !_obscureText),
                ),
              ),
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
