import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AxonAddressDropdownInput extends AxonBaseInput {
  const AxonAddressDropdownInput({super.key, required super.node});

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

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    return FormField<String?>(
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
            final options = controller.getOptions(widget.node.id);
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
                  onChanged: hasOptions
                      ? (val) {
                          if (val != null) {
                            formFieldState.didChange(val);
                            controller.validateAddressNode(widget.node.id, val);
                          }
                        }
                      : null,
                  items: options.map((option) {
                    final (kh, en) = _parseLabel(option.label);
                    return DropdownMenuItem<String>(
                      value: option.id,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(kh),
                          if (en.isNotEmpty)
                            Text(
                              en,
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
                    return Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        _parseLabel(option.label).$1,
                        style: const TextStyle(overflow: TextOverflow.ellipsis),
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
