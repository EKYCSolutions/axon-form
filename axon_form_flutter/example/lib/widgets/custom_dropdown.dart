import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/shared/ai_autofilled_marker.dart';
import 'package:axon_form_flutter_example/widgets/shared/base_card.dart';
import 'package:axon_form_flutter_example/widgets/shared/base_checkbox.dart';
import 'package:axon_form_flutter_example/widgets/shared/constant.dart';
import 'package:axon_form_flutter_example/widgets/shared/dialog_util.dart';
import 'package:axon_form_flutter_example/widgets/shared/gdi_icon.dart';
import 'package:collection/collection.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class _OptionSearchBar extends StatelessWidget {
  const _OptionSearchBar({required this.onChanged, this.icon});
  final Function(String) onChanged;
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    return BaseCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      borderRadius: Constants.baseCardRadius,
      child: TextField(
        onChanged: onChanged,
        cursorHeight: 20,
        style: const TextStyle(fontSize: 16),
        decoration: InputDecoration(
          prefixIcon: Padding(
            padding: const EdgeInsets.only(right: 8),
            child:
                icon ??
                GdiIcon(
                  icon: "Search",
                  color: context.colorScheme.primary,
                  height: 20,
                  width: 20,
                ),
          ),
          border: InputBorder.none,
          prefixIconConstraints: const BoxConstraints(
            minWidth: 18 + 8,
            maxWidth: 18 + 8,
            minHeight: 18,
            maxHeight: 18,
          ),
          hintText: "ស្វែងរក",
          hintStyle: context.textTheme.bodySmall?.copyWith(
            color: context.colorScheme.onSurface,
          ),
        ),
      ),
    );
  }
}

class _Option extends StatelessWidget {
  const _Option({
    required this.option,
    required this.selected,
    required this.onSelected,
    this.showSubLabel = false,
  });

  final AxonFormNode option;
  final bool selected;
  final Function(String)? onSelected;
  final bool showSubLabel;

  @override
  Widget build(BuildContext context) {
    return CupertinoButton(
      onPressed: () {
        if (onSelected != null) {
          onSelected!(option.id);
        }
      },
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: Constants.containerRadius,
          color: selected ? context.colorScheme.primary.withOpacity(0.1) : null,
        ),
        height: 56,
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 8),

        child: Row(
          children: [
            BaseCheckbox(checked: selected),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(option.label, style: context.textTheme.bodySmall),
                  // if (showSubLabel && option.subLabel != null)
                  //   Text(
                  //     option.subLabel!,
                  //     //caption style with primary color
                  //     // caption = context.textTheme.
                  //     style: context.textTheme.labelSmall?.copyWith(
                  //       color: context.colorScheme.primary,
                  //       fontSize: 11,
                  //     ),
                  //   ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OptionSheet extends StatefulWidget {
  const _OptionSheet({
    required this.title,
    required this.options,
    required this.onSelected,
    this.showSubLabel = false,
    this.allowCustomOption = false,
    this.onCustomOptionSelected,
    this.selected,
    this.searchable,
  });

  final String title;
  final List<AxonFormNode> options;
  final String? selected;
  final Function(String)? onSelected;
  final Function(String)? onCustomOptionSelected;
  final bool? searchable;
  final bool allowCustomOption;
  final bool showSubLabel;

  @override
  State<_OptionSheet> createState() => _OptionSheetState();
}

class _OptionSheetState extends State<_OptionSheet> {
  String? selected;
  String searchText = "";


  @override
  void initState() {
    super.initState();
    setState(() {
      selected = widget.selected;
     
    });
  }

  @override
  Widget build(BuildContext context) {
    var options = widget.options;

    if (searchText.isNotEmpty && !widget.showSubLabel) {
      options = widget.options
          .where((i) => i.label.contains(searchText))
          .toList();
    }

    // else if (searchText.isNotEmpty && widget.showSubLabel) {
    //   options = widget.options.where((i) {
    //     final matchKhm = i.label.contains(searchText);
    //     final matchEng =
    //         (i.subLabel != null &&
    //         i.subLabel!.toLowerCase().contains(searchText));
    //     return matchKhm || matchEng;
    //   }).toList();
    //   // log2("options $options ", addSpacer: true);
    // }

    if (selected != null) {
      final optionsContainSelected =
          (options.firstWhereOrNull((j) => j.id == selected!) != null);
      if (optionsContainSelected) {
        final option = options.firstWhere((j) => j.id == selected!);
        options.removeWhere((j) => j.id == selected!);
        options.insert(0, option);
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 20),
        Text(widget.title, style: context.textTheme.headlineSmall),
        const SizedBox(height: 16),
        if ( widget.searchable ?? widget.options.length > 10)
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _OptionSearchBar(
              onChanged: (String s) {
                setState(() {
                  searchText = s;
                });
              },
            ),
          ),
        Flexible(
          fit: FlexFit.tight,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(32),
            child: SingleChildScrollView(
              child: BaseCard(
                child: options.isEmpty
                    ? _noOptionAvailable(context)
                    : Column(
                        children: options.map((option) {
                          final bool s = selected == null
                              ? false
                              : (selected! == option.id);

                          return _Option(
                            option: option,
                            selected: s,
                            showSubLabel: widget.showSubLabel,
                            onSelected: (value) {
                              widget.onSelected!(value);
                              Navigator.of(context).pop();
                            },
                          );
                        }).toList(),
                      ),
              ),
            ),
          ),
        ),
        SizedBox(
          height: MediaQuery.of(context).padding.bottom == 0
              ? 16
              : MediaQuery.of(context).padding.bottom,
        ),
      ],
    );
  }

  Widget _noOptionAvailable(BuildContext context) {
    if (widget.allowCustomOption) {
      return CupertinoButton(
        onPressed: () {
          if (widget.onCustomOptionSelected != null) {
            widget.onCustomOptionSelected!(searchText);
          }
          Navigator.of(context).pop();
        },
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Container(
          decoration: BoxDecoration(borderRadius: Constants.containerRadius),
          height: 56,
          margin: const EdgeInsets.symmetric(vertical: 4),
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            children: [
              GdiIcon(icon: "Plus_Filled", color: context.colorScheme.primary),
              const SizedBox(width: 8),
              Expanded(
                child: Text(searchText, style: context.textTheme.labelMedium),
              ),
            ],
          ),
        ),
      );
    }
    return Container(
      padding: const EdgeInsets.all(24),
      alignment: Alignment.center,
      child: Text("មិនមានទិន្នន័យ", style: context.textTheme.labelMedium),
    );
  }
}

class FormOptionSheet<T> extends StatefulWidget {
  const FormOptionSheet({
    super.key,
    required this.name,
    required this.sheetLabel,
    required this.label,
    this.required = false,
    this.autofilled = false,
    this.hintText,
    this.prefixIcon,

    this.autoValidateMode,
    this.enabled = true,
    this.validator,
    // this.valueTransformer,
    this.backgroundColor,
    this.disabledColor,
    this.labelPadding,
    this.labelStyle,
    this.materialTapTargetSize,
    this.padding,
    this.selectedColor,
    this.selectedShadowColor,
    this.shadowColor,
    this.shape,
    this.expand = true,
    this.searchable,
    this.allowCustomOption = false,
    this.showSubLabel = false,

    //
    this.errorText,
    this.selectedValue,
    required this.context,
    required this.field,
    required this.onChanged,
    required this.options,
  });

  final String name;
  final String sheetLabel;
  final String label;
  final String? hintText;

  final AutovalidateMode? autoValidateMode;
  final bool enabled;
  final String? Function(T?)? validator;

  // final ValueTransformer<T?>? valueTransformer;

  final Widget? prefixIcon;

  final Color? backgroundColor;

  final Color? disabledColor;

  final EdgeInsets? labelPadding;
  final TextStyle? labelStyle;
  final MaterialTapTargetSize? materialTapTargetSize;
  final EdgeInsets? padding;

  final Color? selectedColor;
  final Color? selectedShadowColor;
  final Color? shadowColor;
  final BoxShape? shape;
  final bool expand;
  final bool? searchable;
  final bool required;
  final bool autofilled;
  final bool allowCustomOption;
  final bool showSubLabel;

  //

  final BuildContext context;
  final AxonFormNode field;
  final List<AxonFormNode> options;
  final String? selectedValue;
  final void Function(String? value) onChanged;
  final String? errorText;

  @override
  State<FormOptionSheet<T>> createState() => _FormOptionSheetState<T>();
}

class _FormOptionSheetState<T> extends State<FormOptionSheet<T>> {
  // FormOptionSheetOption? selectedOption;

  // @override
  // void initState() {
  //   super.initState();
  //   if (widget.initialValue != null && widget.options.isNotEmpty) {
  //     setState(() {
  //       selectedOption = widget.options.firstWhere(
  //           (FormOptionSheetOption o) => o.value == widget.initialValue);
  //     });
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    return BaseCard(
      margin: const EdgeInsets.only(top: 8.0, left: 8.0, right: 8.0),

      padding: const EdgeInsets.all(16),
      backgroundColor: widget.enabled
          ? context.colorScheme.surface
          : context.colorScheme.surfaceDim,
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
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
              GestureDetector(
                onTap: widget.enabled
                    ? () async {
                        final selected = widget.options.firstWhereOrNull(
                          (o) => o.id == widget.selectedValue,
                        );
                        await DialogUtil.showBottomSheet(
                          expand: widget.options.length > 10,
                          
                          context: context,
                          child: ClipRRect(
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(32),
                              topRight: Radius.circular(32),
                            ),
                            child: Container(
                              color: context.colorScheme.surface,
                              constraints: BoxConstraints.tightFor(
                                height: widget.options.length * 56 + 200,
                              ),
                              padding: Constants.containerPadding,
                              child: _OptionSheet(
                                title: widget.sheetLabel,
                                options: widget.options,

                                searchable: widget.searchable,
                                allowCustomOption: widget.allowCustomOption,
                                showSubLabel: widget.showSubLabel,
                                onCustomOptionSelected: (String value) {
                                  widget.onChanged(value);
                                  // field.didChange(value);

                                  // setState(() {
                                  //   selectedOption =
                                  //       choice != null ? option : null;
                                  // });
                                },
                                onSelected: (option) {
                                  final choice = selected?.id != option
                                      ? option
                                      : null;
                                  widget.onChanged(choice);
                                  // field.didChange(choice);
                                  // setState(() {
                                  //   selectedOption =
                                  //       choice != null ? option : null;
                                  // });
                                },
                                selected: selected?.id,
                              ),
                            ),
                          ),
                        );
                        // showModalBottomSheet(
                        //     context: context,
                        //     backgroundColor: context.colorScheme.surface,
                        //     builder: (context) {

                        //       return ;
                        //     });
                      }
                    : null,
                child: InputDecorator(
                  decoration: InputDecoration(
                    counterText: "",
                    hintText: widget.hintText,
                    isDense: true,
                    errorText: widget.errorText,

                    prefixIconConstraints: const BoxConstraints(
                      minWidth: 18 + 8,
                      maxWidth: 18 + 8,
                      minHeight: 18,
                      maxHeight: 18,
                    ),
                    suffixIconConstraints: const BoxConstraints(
                      minWidth: 18 + 8,
                      maxWidth: 18 + 8,
                      minHeight: 18,
                      maxHeight: 18,
                    ),
                    border: InputBorder.none,
                    prefixIcon: widget.prefixIcon,

                    // suffix: widget.prefixIcon,
                    suffixIcon: GdiIcon(
                      icon: "Chevron_Down",
                      color: context.colorScheme.surfaceDim,
                      width: 9,
                    ),
                  ),
                  child: Builder(
                    builder: (context) {
                      if (widget.selectedValue == null) {
                        return Text(
                          widget.hintText ?? "context.localize.select",
                          style: context.textTheme.labelMedium,
                        );
                      }
                      final value = widget.options.firstWhereOrNull(
                        (o) => o.id == widget.selectedValue,
                      );

                      if (value == null) {
                        return Text(
                          widget.hintText ?? "context.localize.select",
                          style: context.textTheme.labelMedium,
                        );
                      }
                      return Text(
                        value.label,
                        style: widget.errorText != null
                            ? TextStyle(color: context.colorScheme.error)
                            : context.textTheme.labelMedium,
                      );
                    },
                  ),
                  // child: field.value != null
                  //     ? widget.options
                  //         .firstWhere((o) => o.value == field.value)
                  //         .label
                  //     : Texts.b4(
                  //         context,
                  //         widget.hintText ?? context.localize.select,
                  //         style:
                  //             context.theme.inputDecorationTheme.hintStyle,
                  //       ),
                ),
              ),
            ],
          ),
          Positioned(
            right: 0,
            top: 0,
            child: AnimatedOpacity(
              opacity: widget.autofilled ? 1 : 0,
              duration: Durations.medium3,
              curve: Curves.easeInOutQuad,
              child: AnimatedScale(
                scale: widget.autofilled ? 1 : 0,
                duration: Durations.medium3,
                curve: Curves.easeInOutQuad,
                child: const AiAutoFilledMarker(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
