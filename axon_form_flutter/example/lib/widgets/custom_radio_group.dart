import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter_example/widgets/shared/base_card.dart';
import 'package:axon_form_flutter_example/widgets/shared/base_checkbox.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class CustomRadioGroup extends StatelessWidget {
  final BuildContext context;
  final AxonFormNode field;
  final List<AxonFormNode> options;
  final String? selectedValue;
  final void Function(String? value) onChanged;
  final String? errorText;

  const CustomRadioGroup({
    required this.context,
    required this.field,
    required this.options,
    required this.selectedValue,
    required this.onChanged,
    required this.errorText,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: BaseCard(
        child: InputDecorator(
          decoration: InputDecoration(
            labelText: "labelText",
            contentPadding: const EdgeInsets.only(top: 10.0, bottom: 0.0),
            border: InputBorder.none,
            errorText: errorText,
          ),
          child: Column(
            children: options
                .map(
                  (option) => Option(
                    option: option,
                    selected: selectedValue == option.id,
                    compact: false,
                    onSelected: () {
                      final choice = field.id != option.id ? option.id : null;
                      onChanged(choice);
                      // field.didChange(choice);
                    },
                  ),
                )
                .toList(),
          ),
        ),
      ),
    );
  }
}

class Option extends StatelessWidget {
  const Option({super.key, 
    required this.option,
    required this.selected,
    required this.onSelected,
    required this.compact,
     this.icon,
  });

  final AxonFormNode option;
  final bool selected;
  final Function()? onSelected;
  final bool compact;
  final Widget? icon;


  @override
  Widget build(BuildContext context) {
    return CupertinoButton(
      onPressed: onSelected,
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          // BaseCheckbox(
          //   checked: selected,
          // ),
          if (!compact) ...[
            Container(
              height: 56,
              width: 56,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(100),
                color: context.colorScheme.primary.withOpacity(0.1),
              ),
              alignment: Alignment.center,
              child: icon?? Icon(Icons.abc),
            ),
            const SizedBox(width: 8),
          ],
          Text(option.label),
          const Spacer(),
          BaseCheckbox(checked: selected),
        
        ],
      ),
    );
  }
}
