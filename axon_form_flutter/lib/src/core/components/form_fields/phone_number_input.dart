import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Applies [formatter] to the digits as the user types, e.g. the default
/// [_groupDigits] turns "012345678" into "012 345 678". Takes the same
/// formatting function used for the field's display value elsewhere, so
/// a caller-supplied AxonPhoneNumberInput.phoneNumberFormatter behaves
/// identically whether it's applied to a loaded value or live typing.
class _PhoneNumberInputFormatter extends TextInputFormatter {
  const _PhoneNumberInputFormatter(this.formatter);

  final String Function(String digitsOnly) formatter;

  // Cambodian mobile numbers are 9-10 digits.
  static const _maxDigits = 10;

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digitsOnly = newValue.text.replaceAll(RegExp(r'\D'), '');
    final truncated = digitsOnly.length > _maxDigits
        ? digitsOnly.substring(0, _maxDigits)
        : digitsOnly;
    final formatted = formatter(truncated);

    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

/// Groups digits into chunks of 3, except the final group absorbs a lone
/// leftover digit instead of leaving an awkward group of 1 - so a 9-digit
/// number groups as 3+3+3 ("012 345 678") while a 10-digit number groups
/// as 3+3+4 ("012 345 6789"), matching the real Cambodian phone format.
String _groupDigits(String digits) {
  if (digits.length <= 3) return digits;

  final remainder = digits.length % 3;
  final lastGroupSize = remainder == 1 ? 4 : (remainder == 0 ? 3 : remainder);

  final groups = <String>[];
  var index = 0;
  while (digits.length - index > lastGroupSize) {
    groups.add(digits.substring(index, index + 3));
    index += 3;
  }
  groups.add(digits.substring(index));

  return groups.join(' ');
}

/// A Cambodian mobile number is 9-10 digits. Required-ness is left to the
/// engine's own validation rules - an empty value is not flagged here.
String? _validatePhoneNumberLength(
  String digitsOnly,
  int minLength,
  int maxLength,
) {
  if (digitsOnly.isEmpty) return null;
  if (digitsOnly.length < minLength || digitsOnly.length > maxLength) {
    return 'Phone number must be $minLength-$maxLength digits';
  }
  return null;
}

class AxonPhoneNumberInput extends AxonBaseInput {
  const AxonPhoneNumberInput({
    super.key,
    required super.node,
    this.phoneNumberFormatter,
    this.style,
    this.builder,
    this.minLength = 9,
    this.maxLength = 10,
  });

  final String Function(String)? phoneNumberFormatter;

  final AxonFormNumberInputStyle? style;

  final int minLength;
  final int maxLength;

  /// When true, the field displays digits grouped in 3s ("012 345 678"),
  /// enforces a 9-10 digit Cambodian phone number length, and strips the
  /// display spaces back out before the value reaches the engine (so the
  /// stored/submitted value is always plain digits).
  final Widget Function(
    BuildContext context,
    AxonFormNode field,
    TextEditingController controller,
    void Function(String? val) onChanged,
    String? errorText,
  )?
  builder;

  @override
  State<AxonPhoneNumberInput> createState() => _AxonPhoneNumberInputState();
}

class _AxonPhoneNumberInputState extends State<AxonPhoneNumberInput> {
  late TextEditingController _textController;

  String Function(String) get _effectiveFormatter =>
      widget.phoneNumberFormatter ?? _groupDigits;

  @override
  void initState() {
    super.initState();
    final initialValue = widget.node.value?.toString() ?? '';
    _textController = TextEditingController(
      text: _effectiveFormatter(initialValue),
    );
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    final String rawValue = controller.getNodeValue(widget.node.id) != null
        ? controller.getNodeValue(widget.node.id).toString()
        : "";
    final String newValue = _effectiveFormatter(rawValue);

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
        final digitsOnly = (s ?? '').replaceAll(RegExp(r'\D'), '');
        final phoneError = _validatePhoneNumberLength(
          digitsOnly,
          widget.minLength,
          widget.maxLength,
        );
        if (phoneError != null) return phoneError;

        var res = controller.validateNode(widget.node.id, digitsOnly);
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
              keyboardType: TextInputType.phone,
              inputFormatters: [
                _PhoneNumberInputFormatter(_effectiveFormatter),
              ],
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
