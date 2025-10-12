// import 'package:flutter/material.dart' as DialogUtil show showBottomSheet;
import 'package:axon_form_flutter/src/extensions/theme_extension.dart';
import 'package:axon_form_flutter/src/models/model.dart';
import 'package:axon_form_flutter/src/shared_widgets.dart/shared_widget.dart';
import 'package:flutter/foundation.dart';
import 'package:collection/collection.dart';
import 'package:flutter/cupertino.dart' hide Spacer;
import 'package:flutter/material.dart';

class _OptionSearchBar extends StatelessWidget {
  const _OptionSearchBar({required this.onChanged, this.icon});
  final Function(String) onChanged;
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      // padding: const EdgeInsets.symmetric(
      //   horizontal: kContainerHorizontalPadding,
      //   vertical: kContainerVerticalPadding,
      // ),
      // borderRadius: BorderRadius.circular(kBorderRadius),
      child: TextField(
        onChanged: onChanged,
        cursorHeight: 20,
        style: const TextStyle(fontSize: 16),
        decoration: InputDecoration(
          prefixIcon: Padding(
            padding: const EdgeInsets.only(right: 8),
            child: icon ?? Icon(Icons.search),
          ),
          border: InputBorder.none,
          prefixIconConstraints: const BoxConstraints(
            minWidth: 18 + 8,
            maxWidth: 18 + 8,
            minHeight: 18,
            maxHeight: 18,
          ),
          hintText: "ស្វែងរក",
          // hintStyle: context.textTheme.bodySmall?.copyWith(
          //   color: context.colorScheme.onSurface,
          // ),
        ),
      ),
    );
  }
}

// class Node {
//   const Node({
//     required this.value,
//     required this.label,
//     this.subLabel,
//   });

//   final Node? value;
//   final String label;
//   final String? subLabel;
// }

class _OptionWidget extends StatelessWidget {
  const _OptionWidget({
    required this.option,
    required this.selected,
    required this.onSelected,
    this.showSubLabel = false,
  });

  final Node option;
  final bool selected;
  final Function()? onSelected;
  final bool showSubLabel;

  @override
  Widget build(BuildContext context) {
    return CupertinoButton(
      onPressed: onSelected,
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Container(
        // decoration: BoxDecoration(
        //   borderRadius: BorderRadius.circular(kBorderRadius),
        //   color: selected ? context.colorScheme.primary.withOpacity(0.1) : null,
        // ),
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
                  Text(
                    option.label ?? "LABEL",
                    // style: context.textTheme.labelMedium,
                  ),
                  if (showSubLabel && option.subLabel != null)
                    Text(
                      option.subLabel!,

                      // style: context.textTheme.titleMedium!.copyWith(
                      //   color: context.colorScheme.primary,
                      //   fontSize: 11,
                      // ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OptionList extends StatefulWidget {
  const _OptionList({
    required this.title,
    required this.options,
    required this.onSelected,
    this.showSubLabel = false,
    this.allowCustomOption = false,
    this.onCustomOptionSelected,
    this.selected,
    this.searchable = false,
    this.pinnedItems = const [],
  });

  final String title;
  final List options;
  final List pinnedItems;
  final Node? selected;
  final Function(Node) onSelected;
  final Function(Node)? onCustomOptionSelected;
  final bool searchable;
  final bool allowCustomOption;
  final bool showSubLabel;

  @override
  State<_OptionList> createState() => _OptionListState();
}

class _OptionListState extends State<_OptionList> {
  Node? selected;
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
    } else if (searchText.isNotEmpty && widget.showSubLabel) {
      options = widget.options.where((i) {
        final matchKhm = i.label.contains(searchText);
        final matchEng =
            (i.subLabel != null &&
            i.subLabel!.toLowerCase().contains(searchText));
        return matchKhm || matchEng;
      }).toList();
      // log2("options $options ", addSpacer: true);
    }

    print("widget.pinnedItems ${widget.pinnedItems.length}");
    if (widget.pinnedItems.isNotEmpty) {
      for (var i in widget.pinnedItems) {
        final pinned = options.firstWhereOrNull((j) => j.id == i.id);
        if (pinned != null) {
          options.removeWhere((j) => j.id == pinned.id);
          options.insert(0, pinned);
        }
      }
    }

    if (selected != null) {
      final optionsContainSelected =
          (options.firstWhereOrNull((j) => j.id == selected!.id) != null);
      if (optionsContainSelected) {
        options.removeWhere((j) => j.id == selected!.id);
        options.insert(0, selected!);
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Text(
            widget.title,
            // style: context.textTheme.bodyMedium,
          ),
        ),

        if (widget.searchable)
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
            // smoothness: 1,
            borderRadius: BorderRadius.circular(32),
            child: SingleChildScrollView(
              child: Container(
                child: options.isEmpty
                    ? _noOptionAvailable(context)
                    : Column(
                        children: options.map((option) {
                          final bool s = selected == null
                              ? false
                              : (selected!.id == option.id);

                          return _OptionWidget(
                            option: option,
                            selected: s,
                            showSubLabel: widget.showSubLabel,
                            onSelected: () {
                              widget.onSelected(option);
                              Navigator.of(context).pop();
                            },
                          );
                        }).toList(),
                      ),
              ),
            ),
          ),
        ),
        // SizedBox(
        //   height:
        //       MediaQuery.of(context).padding.bottom == 0
        //           ? 16
        //           : MediaQuery.of(context).padding.bottom,
        // ),
      ],
    );
  }

  Widget _noOptionAvailable(BuildContext context) {
    if (widget.allowCustomOption) {
      return CupertinoButton(
        onPressed: () {
          if (widget.onCustomOptionSelected != null) {
            widget.onCustomOptionSelected!(Node(label: "searchText"));
          }
          Navigator.of(context).pop();
        },
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Container(
          decoration: BoxDecoration(
            // borderRadius: BorderRadius.circular(kBorderRadius),
          ),

          height: 56,
          margin: const EdgeInsets.symmetric(vertical: 4),
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            children: [
              // SvgPicture.asset(
              //   context.icons.add!,
              //   color: context.colorScheme.primary,
              // ),
              Icon(Icons.add),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  searchText,
                  // style: context.textTheme.bodyMedium
                ),
              ),
            ],
          ),
        ),
      );
    }
    return Container(
      padding: const EdgeInsets.all(24),
      alignment: Alignment.center,
      child: Text(
        "មិនមានទិន្នន័យ",
        //  style: context.textTheme.bodyMedium
      ),
    );
  }
}

class BaseDropdownRadioSelectInput extends StatefulWidget {
  const BaseDropdownRadioSelectInput({
    super.key,
    required this.options,
    required this.sheetLabel,
    required this.label,
    this.required = false,
    this.autofilled = false,
    this.prefixIcon,
    this.initialValue,
    this.autoValidateMode = AutovalidateMode.onUserInteraction,
    this.enabled = true,
    this.validator,
    // this.valueTransformer,
    this.onSelected,
    this.searchable = false,
    this.allowCustomOption = false,
    this.showSubLabel = false,
    this.pinnedItems = const [],
  });
  final List<Node> options;
  final List<Node> pinnedItems;
  final String sheetLabel;
  final String label;
  final Node? initialValue;
  final AutovalidateMode? autoValidateMode;
  final bool enabled;
  final String? Function(Node?)? validator;
  final Function(Node?)? onSelected;
  final Widget? prefixIcon;
  final bool searchable;
  final bool required;
  final bool autofilled;
  final bool allowCustomOption;
  final bool showSubLabel;

  @override
  State<BaseDropdownRadioSelectInput> createState() =>
      _BaseRadioSelectInputState();
}

class _BaseRadioSelectInputState extends State<BaseDropdownRadioSelectInput> {
  Node? selectedOption;

  @override
  void initState() {
    super.initState();
    if (widget.initialValue != null && widget.options.isNotEmpty) {
      setState(() {
        selectedOption = widget.options.firstWhereOrNull(
          (o) => o.id == widget.initialValue?.id,
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        border: Border.all(
          color: widget.enabled
              ? context.colorScheme.outline
              : context.colorScheme.outlineVariant,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      // backgroundColor: widget.enabled
      //     ? context.colorScheme.surface
      //     : context.colorScheme.surfaceDim,
      child: FormField<Node>(
        // name: widget.name,
        validator: (Node? s) {
          // if ((s == null || s == '') && widget.required) {
          //   return "required";
          // }
          return widget.validator?.call(s);
        },
        initialValue: selectedOption,
        autovalidateMode: widget.autoValidateMode,
        enabled: widget.enabled,
        // onSaved: widget.onChanged,
        builder: (FormFieldState<Node> field) {
          return GestureDetector(
            onTap: widget.enabled
                ? () async {
                    Node? selected = widget.options.firstWhereOrNull(
                      (o) => o.id == field.value?.id,
                    );

                    if (kIsWeb) {
                      selected = await showDialog(
                        context: context,
                        builder: (context) {
                          return Center(
                            child: WebPopUpDialog(
                              child: SizedBox(
                                height: 600,
                                width: 800,
                                child: Dialog(
                                  child: _OptionList(
                                    title: widget.sheetLabel,
                                    options: widget.options,
                                    pinnedItems: widget.pinnedItems,
                                    searchable: widget.searchable,
                                    allowCustomOption: widget.allowCustomOption,
                                    showSubLabel: widget.showSubLabel,
                                    onCustomOptionSelected: (Node value) {
                                      field.didChange(value);
                                      widget.onSelected?.call(value as Node?);
                                    },
                                    onSelected: (option) {
                                      final choice =
                                          field.value?.id != option.id
                                          ? option
                                          : null;

                                      field.didChange(choice);
                                      widget.onSelected?.call(choice);
                                    },
                                    selected: selected,
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      );
                    } else {
                      selected = await showModalBottomSheet(
                        context: context,
                        builder: (context) {
                          return _OptionList(
                            title: widget.sheetLabel,
                            options: widget.options,
                            pinnedItems: widget.pinnedItems,
                            searchable: widget.searchable,
                            allowCustomOption: widget.allowCustomOption,
                            showSubLabel: widget.showSubLabel,
                            onCustomOptionSelected: (Node value) {
                              field.didChange(value);
                              widget.onSelected?.call(value as Node?);
                            },
                            onSelected: (Node option) {
                              final choice = field.value?.id != option.id
                                  ? option
                                  : null;
                              field.didChange(choice);
                              widget.onSelected?.call(choice);
                            },
                            selected: selected,
                          );
                        },
                      );
                    }
                  }
                : null,
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

                          style: TextStyle(
                            color: field.hasError
                                ? context.colorScheme.error
                                : context.colorScheme.primary,
                          ),
                        ),
                        if (widget.required)
                          Text(
                            "*",
                            style: TextStyle(color: context.colorScheme.error),
                          ),
                        const Spacer(),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: InputDecorator(
                            decoration: InputDecoration(
                              counterText: "",
                              hintText: widget.label,
                              isDense: true,
                              errorText: field.errorText,
                          
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
                              suffixIcon: Icon(
                                Icons.arrow_drop_down_rounded,
                                color: context.colorScheme.surfaceDim,
                                size: 9,
                              ),
                            ),
                            child: Builder(
                              builder: (context) {
                                if (field.value == null) {
                                  return Text(
                                    "Select",
                                    // style: context.textTheme.bodyMedium,
                                  );
                                }
                                final value = widget.options.firstWhereOrNull(
                                  (o) => o.id == field.value?.id,
                                );
                          
                                if (value == null && widget.allowCustomOption) {
                                  return Text(
                                    field.value?.label ?? "Custom",
                                    // style: context.textTheme.bodyMedium,
                                  );
                                }
                                if (value == null && !widget.allowCustomOption) {
                                  return Text(
                                    "Select",
                                    // style: context.textTheme.bodyMedium,
                                  );
                                }
                          
                                return Text(
                                  value?.label ?? field.value?.label ?? "",
                                  // style: field.hasError
                                  //     ? context.textTheme.bodyMedium!.copyWith(
                                  //         color: context.colorScheme.error,
                                  //       )
                                  //     : null,
                                );
                              },
                            ),
                          ),
                        ),
                      Icon(
                        Icons.arrow_drop_down_rounded
                      )
                      
                      ],
                    ),
                  ],
                ),
                // Positioned(
                //   right: 0,
                //   top: 0,
                //   child: AnimatedOpacity(
                //     opacity: widget.autofilled ? 1 : 0,
                //     duration: Durations.medium3,
                //     curve: Curves.easeInOutQuad,
                //     child: AnimatedScale(
                //       scale: widget.autofilled ? 1 : 0,
                //       duration: Durations.medium3,
                //       curve: Curves.easeInOutQuad,
                //       child: const AiAutoFilledMarker(),
                //     ),
                //   ),
                // )
              ],
            ),
          );
        },
      ),
    );
  }
}
