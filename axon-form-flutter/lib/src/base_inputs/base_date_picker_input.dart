import 'package:axon_form_flutter/src/extensions/theme_extension.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class BaseDatePickerInput extends StatefulWidget {
  const BaseDatePickerInput({
    super.key,
    this.initialValue,
    this.label,
    this.enabled = true,
    this.required = false,
    this.validator,
    this.autovalidateMode = AutovalidateMode.onUserInteraction,
    this.initialDateString,
    this.lastDate,
    this.firstDate,
    this.autofilled = false,
    this.onChanged,
    this.prefixIcon,
  });

  final bool enabled;
  final String? label; // Label text
  final bool required;
  final String? initialValue;
  final String? initialDateString;
  final DateTime? lastDate;
  final DateTime? firstDate;
  final String? Function(String?)? validator;
  final bool autofilled;
  final void Function(DateTime?)? onChanged;
  final Widget? prefixIcon;
  final AutovalidateMode? autovalidateMode;

  @override
  State<BaseDatePickerInput> createState() => _BaseDatePickerInputState();
}

class _BaseDatePickerInputState extends State<BaseDatePickerInput> {
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.initialValue != null) {
      _controller.text = displayDateFormat.format(
        DateTime.parse(widget.initialValue!),
      );
    }
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
  }

  final displayDateFormat = DateFormat("dd/MM/yyyy");

  Future<DateTime?> _showDatePicker(String? dateString) {
    final finalLastDate = widget.lastDate ?? DateTime.now();
    final initialDate = DateTime.tryParse(dateString ?? "");

    return showDatePicker(
      context: context,

      initialDate: initialDate ?? widget.firstDate,
      firstDate: widget.firstDate ?? DateTime(1900),
      lastDate: finalLastDate,
      // locale: ref.watch(appLanguageProvider),
    );
  }

  @override
  Widget build(BuildContext context) {
    DateTime? initialValue = widget.initialDateString != null
        ? DateTime.tryParse(widget.initialDateString!)
        : null;

    if (initialValue != null &&
        widget.lastDate != null &&
        initialValue.isAfter(widget.lastDate!)) {
      initialValue = null;
    }
    return FormField<String>(
      autovalidateMode: widget.autovalidateMode,
      // validator: (String? s) {
      //   if (s == null && widget.required) {
      //     return "required";
      //   }

      //   return widget.validator?.call(s);
      // },
      validator: widget.validator,
      enabled: widget.enabled,
      builder: (field) {
        return GestureDetector(
          onTap: () async {
            // Show the DatePicker
            final DateTime? selectedDate = await _showDatePicker(
              // field.value,
              field.value,
            );
            if (selectedDate != null) {
              // Transform Date to String
              final dateString = selectedDate.toString();

              _controller.text = displayDateFormat.format(selectedDate);

              widget.onChanged?.call(selectedDate);
              field.didChange(dateString); // Update the field value
            }
          },
          child: Container(
            padding: const EdgeInsets.all(16),
            // backgroundColor:
            //     widget.enabled
            //         ? context.colorScheme.surface
            //         : context.colorScheme.surfaceDim,
            child: Stack(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          widget.label!,
                          // style: context.textTheme.labelLarge!.copyWith(
                          //   color: context.colorScheme.primary,
                          // ),
                        ),
                        if (widget.required)
                          Text(
                            "*",
                            // style: context.textTheme.labelLarge!.copyWith(
                            //   color: context.colorScheme.error,
                            // ),
                          ),
                        const Spacer(),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          // decoration: BoxDecoration(
                          //   border: Border.all(
                          //     color: context.colorScheme.outline,
                          //   ),
                          //   borderRadius: BorderRadius.circular(8),
                          // ),
                          // padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (widget.prefixIcon != null) widget.prefixIcon!,
                              Expanded(
                                child: Text(
                                  _controller.text.isNotEmpty
                                      ? _controller.text
                                      : 'Select date',
                                  // style: context.textTheme.labelMedium,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (field.hasError)
                          Text(
                            field.errorText!,
                            // style: context.textTheme.bodySmall!.copyWith(
                            //   color: context.colorScheme.error,
                            // ),
                          ),
                      ],
                    ),
                  ],
                ),
                // if (widget.autofilled)
                //   const Positioned(
                //     right: 0,
                //     top: 0,
                //     child: AiAutoFilledMarker(),
                //   ),
              ],
            ),
          ),
        );
      },
    );
  }
}
