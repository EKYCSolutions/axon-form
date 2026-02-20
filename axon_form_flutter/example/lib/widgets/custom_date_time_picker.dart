import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/shared/ai_autofilled_marker.dart';
import 'package:axon_form_flutter_example/widgets/shared/base_card.dart';
import 'package:axon_form_flutter_example/widgets/shared/gdi_icon.dart';
import 'package:flutter/material.dart';

import 'package:intl/intl.dart';

class CustomDateTimePicker extends StatefulWidget {
  const CustomDateTimePicker({
    super.key,
    required this.label,
    required this.name,
    this.required = false,
    this.autofilled = false,
    this.prefixIcon,
    this.hintText,
    this.autovalidateMode,
    this.enabled = true,
    this.validator,
    // this.valueTransformer,
    this.initialDateString,
    // this.initialValue,
    this.lastDate,
    this.firstDate,
    this.initialDate,

    this.textInputAction = TextInputAction.next,
    this.field,
    this.selectedValue,
    this.onChanged,
    this.errorText,
  });

  final String name;
  final Widget? prefixIcon;
  final String label;
  final String? hintText;
  final AutovalidateMode? autovalidateMode;
  final String? Function(String?)? validator;
  final bool enabled;
  final String? initialDateString;
  final TextInputAction textInputAction;
  // final DateTime? initialValue;

  // final ValueTransformer<String?>? valueTransformer;

  final DateTime? lastDate;
  final DateTime? firstDate;
  final DateTime? initialDate;

  final bool required;
  final bool autofilled;

  final AxonFormNode? field;
  final DateTime? selectedValue;
  final void Function(DateTime? value)? onChanged;
  final String? errorText;

  @override
  State<CustomDateTimePicker> createState() => _CustomDateTimePickerState();
}

class _CustomDateTimePickerState extends State<CustomDateTimePicker> {
  final displayDateFormat = DateFormat("dd/MM/yyyy");

  Future<DateTime?> _showDatePicker(String? dateString) {
    final finalLastDate = widget.lastDate ?? DateTime.now();
    final initialDate = DateTime.tryParse(dateString ?? "");

    print("initialDate $initialDate");

    return showDatePicker(
      context: context,

      initialDate: initialDate ?? widget.initialDate,
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

    final dateValue = widget.selectedValue;
    final label = dateValue != null
        ? Text(
            displayDateFormat.format(dateValue),
            style: context.textTheme.labelMedium,
          )
        : Text(
            widget.hintText ?? "context.localize.select",
            style: context.textTheme.labelMedium,
          );

    return BaseCard(
      padding: const EdgeInsets.all(16),
      backgroundColor: context.colorScheme.surface,

      // child: FormBuilderField(
      //   // maxLines: widget.maxLines,
      //   initialValue: widget.initialDateString,
      //   onChanged: widget.onChanged,
      //   enabled: widget.enabled,
      //   // valueTransformer: widget.valueTransformer,
      //   // textInputAction: widget.textInputAction,
      //   // focusNode: focusNode,
      //   // scrollPadding: widget.scrollPadding,
      //   name: widget.name,
      //   autovalidateMode: widget.autovalidateMode,
      //   // style: context.textTheme.labelMedium,
      //   validator: widget.validator,
      //   // valueTransformer: widget.valueTransformer,
      //   builder: (FormFieldState<String?> field) {
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    widget.label,
                    style: context.textTheme.labelSmall?.copyWith(
                      color: widget.errorText != null
                          ? context.colorScheme.error
                          : context.colorScheme.primary,
                    ),
                  ),
                  if (widget.required)
                    Text(
                      "*",
                      style: context.textTheme.labelSmall?.copyWith(
                        color: context.colorScheme.error,
                      ),
                    ),
                  const Spacer(),
                ],
              ),
              InkWell(
                onTap: () async {
                  // Show the DatePicker
                  final DateTime? selectedDate = await _showDatePicker(
                    widget.selectedValue?.toIso8601String() ??
                        widget.initialDateString,
                  );
                  if (selectedDate != null) {
                    // Transform Date to String
                    final dateString = selectedDate.toIso8601String();
                    widget.onChanged!(selectedDate); // Update the field value
                  }
                },
                child: InputDecorator(
                  decoration: InputDecoration(
                    isDense: true,
                    hintText: widget.hintText,
                    border: InputBorder.none,
                    errorText: widget.errorText,
                    prefixIconConstraints: const BoxConstraints(
                      minWidth: 18 + 8,
                      maxWidth: 18 + 8,
                      minHeight: 18,
                      maxHeight: 18,
                    ),
                    prefixIcon:
                        widget.prefixIcon ??
                        Container(
                          margin: const EdgeInsets.only(right: 8),
                          child: GdiIcon(
                            icon: "Calendar_Filled",
                            color: context.colorScheme.primary,
                          ),
                        ),
                  ),
                  child: label,
                ),
              ),
            ],
          ),
          if (widget.autofilled)
            const Positioned(right: 0, top: 0, child: AiAutoFilledMarker()),
        ],
      ),
    );
  }
}
