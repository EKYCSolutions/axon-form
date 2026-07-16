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

  /// A Map (`{id, label, value}`) means the core resolved this to a known
  /// address entry; a raw String means it fell back to a custom, freely
  /// typed option (see "Case A: Custom Option" in axon-form-core's
  /// GetNodeValue) - the value itself *is* the selection in that case.
  /// Note: `nodeValue?["id"]` is NOT safe here - String defines
  /// `operator [](int index)` for single-character access, so indexing it
  /// with "id" throws a TypeError instead of returning null.
  String? _resolveId(dynamic nodeValue) {
    if (nodeValue is Map) return nodeValue["id"]?.toString();
    if (nodeValue is String) return nodeValue;
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final nodeValue = controller.getNodeValue(widget.node.id);

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormAddressDropdownInputStyle>() ??
        AxonFormAddressDropdownInputStyle.fallback(context);

    return FormField<String?>(
      initialValue: _resolveId(nodeValue),
      autovalidateMode: AutovalidateMode.onUserInteraction,
      validator: (val) {
        if (val != null && val.isNotEmpty) return null;
        var res = controller.validateAddressNodeSilently(widget.node.id, val);
        return res.error;
      },
      builder: (formFieldState) {
        return Selector<AxonFormProvider, int>(
          shouldRebuild: (prev, next) => prev != next,
          selector: (_, provider) {
            final isMe =
                provider.addressNodeIdsToUpdate?.contains(widget.node.id) ??
                false;
            return isMe ? provider.pulse : -1;
          },
          builder: (context, pulse, _) {
            final nodeValue = controller.getNodeValue(widget.node.id);
            //
            String? currentIdFromProvider = _resolveId(nodeValue);
            //
            if (formFieldState.value != currentIdFromProvider) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                if (formFieldState.mounted) {
                  formFieldState.didChange(currentIdFromProvider);
                }
              });
            }

            var options = controller.getOptions(widget.node.id);
            List<AxonFormNode> selectOptions = _searchQuery.isNotEmpty
                ? onSearch(_searchQuery, options)
                : options;
            final hasOptions = options.isNotEmpty;

            // A raw String nodeValue (as opposed to the {id, label, value}
            // map returned for a known address entry) means the core
            // resolved this to a custom, freely-typed option - see
            // "Case A: Custom Option" in axon-form-core's GetNodeValue.
            // In that case the value itself *is* the selection, it won't
            // match any known option id.
            final bool isCustomValue = nodeValue is String;
            final bool valueIsValid = options.any(
              (o) => o.id == currentIdFromProvider,
            );

            final selectedValue = isCustomValue
                ? currentIdFromProvider
                : (valueIsValid ? currentIdFromProvider : null);

            // DropdownButton can only display a `value` that's present in
            // its `items`, so a custom value needs a synthetic item added
            // alongside the real options.
            final List<AxonFormNode> displayOptions =
                isCustomValue &&
                    selectedValue != null &&
                    selectedValue.isNotEmpty &&
                    !options.any((o) => o.id == selectedValue)
                ? [
                    AxonFormNode(
                      id: selectedValue,
                      fieldName: widget.node.fieldName,
                      label: selectedValue,
                      validationRules: const [],
                      order: -1,
                      isVisible: true,
                      isRequired: false,
                    ),
                    ...options,
                  ]
                : options;
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
                  items: displayOptions.map((option) {
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
                  selectedItemBuilder: (context) =>
                      displayOptions.map((option) {
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
