import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class CustomAddressDropdown extends StatelessWidget {
  final AxonFormNode node;

  const CustomAddressDropdown({super.key, required this.node});

  @override
  Widget build(BuildContext context) {
    return AxonAddressDropdownInput(
      node: node,
      builder: (context, field, options, selectedValue, onChanged, errorText) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
              margin: EdgeInsets.symmetric(vertical: 2.0),
              decoration: BoxDecoration(
                color: Colors.blueGrey.withAlpha(20),
                // border: Border.all(color: Colors.black.withAlpha(20)),
                borderRadius: BorderRadius.all(Radius.circular(14.0)),
              ),
              child: InputDecorator(
                decoration: InputDecoration(
                  border:
                      InputBorder.none, // Removes the default border if desired
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 0,
                  ),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: selectedValue,
                    isExpanded: true,
                    hint: Text(
                      options.isNotEmpty ? field.label : "No options available",
                    ),
                    disabledHint: Text(
                      "Please select a parent first",
                      style: TextStyle(color: Colors.grey[500]),
                    ),
                    onChanged: options.isNotEmpty
                        ? (val) {
                            if (val != null) {
                              onChanged(val);
                            }
                          }
                        : null,
                    items: options.map((option) {
                      final parts = option.label.split('-');
                      final labelKh = parts[0].trim();
                      final labelEn = parts.length > 1 ? parts[1].trim() : '';

                      return DropdownMenuItem<String>(
                        value: option.id,
                        child: Row(
                          children: [
                            selectedValue == option.id
                                ? const Icon(
                                    Icons.check_circle,
                                    color: Color(0XFF000080),
                                    size: 22,
                                  )
                                : Icon(
                                    Icons.radio_button_unchecked,
                                    color: Colors.grey.shade400,
                                    size: 22,
                                  ),

                            const SizedBox(width: 12),
                            Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  labelKh,
                                  style: TextStyle(
                                    fontWeight: FontWeight.w500,
                                    fontSize: 14.0,
                                  ),
                                ),
                                Text(
                                  labelEn.toUpperCase(),
                                  style: TextStyle(
                                    fontSize: 10.0,
                                    fontWeight: FontWeight.w400,

                                    color: Color(0XFF000080),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    selectedItemBuilder: (context) => options.map((option) {
                      final parts = option.label.split('-');
                      final labelKh = parts[0].trim();
                      final labelEn = parts.length > 1 ? parts[1].trim() : '';

                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            node.label,
                            style: TextStyle(
                              fontSize: 12.0,
                              color: Color(0XFF000080),
                            ),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Icon(Icons.location_on, color: Color(0XFF000080)),
                              SizedBox(width: 5.0),
                              Text(
                                labelKh,
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 14.0,
                                ),
                              ),
                            ],
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),
            errorText != null
                ? Padding(
                    padding: const EdgeInsets.only(top: 4.0),
                    child: buildError(context, errorText),
                  )
                : SizedBox.shrink(),
          ],
        );
      },
    );
  }
}
