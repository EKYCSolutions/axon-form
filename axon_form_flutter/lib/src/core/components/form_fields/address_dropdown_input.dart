import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AxonAddressDropdownInput extends AxonBaseInput {
  const AxonAddressDropdownInput({
    super.key,
    required super.node,
    this.style,
    this.builder,
  });

  final AxonFormAddressDropdownInputStyle? style;
  final Widget Function(
    BuildContext context,
    AxonFormNode field,
    List<AxonFormNode> options,
    String? selectedValue,
    void Function(String? value) onChanged,
    void Function(String value) onSearch,
    String? errorText,
  )?
  builder;

  @override
  State<AxonAddressDropdownInput> createState() =>
      _AxonAddressDropdownInputState();
}

class _AxonAddressDropdownInputState extends State<AxonAddressDropdownInput> {
  (String kh, String en) _parseLabel(String label) {
    final parts = label.split('-');
    final kh = parts[0].trim();
    final en = parts.length > 1 ? parts[1].trim() : '';
    return (kh, en);
  }

  List<AxonFormNode> onSearch(String query, List<AxonFormNode> options) {
    return options.where((option) {
      final titleLower = option.label.toLowerCase();
      final searchLower = query.toLowerCase();

      return titleLower.contains(searchLower);
    }).toList();
  }

  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final nodeValue = controller.getNodeValue(widget.node.id);

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormAddressDropdownInputStyle>() ??
        AxonFormAddressDropdownInputStyle.fallback(context);

    return FormField<String?>(
      initialValue: nodeValue != null ? nodeValue["id"] : nodeValue,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      validator: (val) {
        if (val != null && val.isNotEmpty) return null;
        return controller.validateAddressNodeSilently(widget.node.id, val);
      },
      builder: (formFieldState) {
        return Selector<AxonFormProvider, int>(
          shouldRebuild: (prev, next) => prev != next,
          selector: (_, pro) {
            final isMe =
                pro.addressNodeIdsToUpdate?.contains(widget.node.id) ?? false;
            return isMe ? pro.pulse : -1;
          },
          builder: (context, pulse, _) {
            var options = controller.getOptions(widget.node.id);
            List<AxonFormNode> selectOptions = _searchQuery.isNotEmpty
                ? onSearch(_searchQuery, options)
                : options;
            final hasOptions = options.isNotEmpty;

            // Check if the current form value is still valid in the new options list
            final bool valueIsValid = options.any(
              (o) => o.id == formFieldState.value,
            );

            // If a parent changed and this field's value is now invalid, clear it
            if (!valueIsValid && formFieldState.value != null) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                formFieldState.didChange(null);
              });
            }

            final selectedValue = valueIsValid ? formFieldState.value : null;

            if (widget.builder != null) {
              return widget.builder!(
                context,
                widget.node,
                selectOptions,
                selectedValue,
                (val) {
                  if (val != null) {
                    formFieldState.didChange(val);
                    controller.validateAddressNode(widget.node.id, val);
                  }
                },
                (query) {
                  setState(() {
                    _searchQuery = query;
                  });
                },
                formFieldState.errorText,
              );
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                DropdownButton<String>(
                  value: selectedValue,
                  isExpanded: true,
                  hint: Text(
                    hasOptions ? widget.node.label : "No options available",
                  ),
                  disabledHint: Text(
                    "Please select a parent first",
                    style: TextStyle(color: Colors.grey[500]),
                  ),
                  elevation: style.elevation,
                  style: style.style,
                  underline: style.underline,
                  icon: style.icon,
                  iconDisabledColor: style.iconDisabledColor,
                  iconEnabledColor: style.iconEnabledColor,
                  iconSize: style.iconSize,
                  isDense: style.isDense,
                  itemHeight: style.itemHeight,
                  menuWidth: style.menuWidth,
                  focusColor: style.focusColor,
                  autofocus: style.autofocus,
                  dropdownColor: style.dropdownColor,
                  menuMaxHeight: style.menuMaxHeight,
                  enableFeedback: style.enableFeedback,
                  alignment: style.alignment,
                  borderRadius: style.borderRadius,
                  padding: style.padding,
                  barrierDismissible: style.barrierDismissible,
                  onChanged: hasOptions
                      ? (val) {
                          if (val != null) {
                            formFieldState.didChange(val);
                            controller.validateAddressNode(widget.node.id, val);
                          }
                        }
                      : null,
                  items: options.map((option) {
                    final (labelKh, labelEn) = _parseLabel(option.label);
                    return DropdownMenuItem<String>(
                      value: option.id,
                      child: style.addressItemBuilder != null
                          ? style.addressItemBuilder!(
                              context,
                              labelKh,
                              labelEn,
                              selectedValue == option.id,
                            )
                          : Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(labelKh),
                                if (labelEn.isNotEmpty)
                                  Text(
                                    labelEn,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey,
                                    ),
                                  ),
                              ],
                            ),
                    );
                  }).toList(),
                  selectedItemBuilder: (context) => options.map((option) {
                    final (labelKh, labelEn) = _parseLabel(option.label);
                    return style.addressSelectedItemBuilder != null
                        ? style.addressSelectedItemBuilder!(
                            context,
                            labelKh,
                            labelEn,
                          )
                        : Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              labelKh,
                              style: const TextStyle(
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          );
                  }).toList(),
                ),

                if (formFieldState.hasError)
                  Padding(
                    padding: const EdgeInsets.only(top: 4.0),
                    child: buildError(context, formFieldState.errorText!),
                  ),
              ],
            );
          },
        );
      },
    );
  }
}
