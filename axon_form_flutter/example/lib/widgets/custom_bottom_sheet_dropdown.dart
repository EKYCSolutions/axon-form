import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class CustomAddressBottomSheetDropdown extends StatefulWidget {
  final AxonFormNode node;

  const CustomAddressBottomSheetDropdown({super.key, required this.node});

  @override
  State<CustomAddressBottomSheetDropdown> createState() =>
      _BottomSheetDropdownState();
}

class _BottomSheetDropdownState
    extends State<CustomAddressBottomSheetDropdown> {
  List<AxonFormNode> selectedOptions = [];

  final ValueNotifier<List<AxonFormNode>> _optionsNotifier = ValueNotifier([]);

  @override
  void dispose() {
    _optionsNotifier.dispose();
    super.dispose();
  }

  //
  void _showOptions(
    BuildContext context,
    String? selectedValue,
    Function(String?) onChanged,
    Function(String) onSearch,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.9,
          maxChildSize: 0.95,
          minChildSize: 0.5,
          expand: false,
          builder: (_, controller) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
              ),
              child: Column(
                children: [
                  // Handle Bar
                  const SizedBox(height: 12),
                  Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Header Title
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "ភូមិ", // "Village" in Khmer
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),

                  // Search Bar
                  Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: TextField(
                      onChanged: (val) {
                        onSearch(val);
                      },
                      decoration: InputDecoration(
                        hintText: "ស្វែងរក", // "Search"
                        prefixIcon: const Icon(
                          Icons.search,
                          color: Color(0xFF1A237E),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(vertical: 0),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                      ),
                    ),
                  ),

                  // List of Options
                  Expanded(
                    child: ValueListenableBuilder<List<AxonFormNode>>(
                      valueListenable: _optionsNotifier,
                      builder: (context, options, child) {
                        return ListView.builder(
                          controller: controller,
                          itemCount: options.length,
                          itemBuilder: (context, index) {
                            final item = options[index];
                            final bool isSelected = selectedValue == item.id;

                            final parts = item.label.split('-');
                            final labelKh = parts[0].trim();
                            final labelEn = parts.length > 1
                                ? parts[1].trim()
                                : '';

                            return ListTile(
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 4,
                              ),
                              leading: Icon(
                                isSelected
                                    ? Icons.check_circle
                                    : Icons.radio_button_unchecked,
                                color: const Color(
                                  0xFF1A237E,
                                ), // Deep Navy Blue
                                size: 28,
                              ),
                              title: Text(
                                labelKh,
                                style: const TextStyle(
                                  color: Color(0xFF1A237E),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              subtitle: Text(
                                labelEn,
                                style: TextStyle(
                                  color: Colors.blue.shade900.withOpacity(0.6),
                                  fontSize: 12,
                                ),
                              ),
                              onTap: () {
                                onChanged(item.id);
                                Navigator.pop(context);
                              },
                            );
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return AxonAddressDropdownInput(
      node: widget.node,
      builder:
          (
            context,
            field,
            options,
            selectedValue,
            onChanged,
            onSearch,
            errorText,
          ) {
            // Update the notifier whenever the builder is called with new options
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (mounted) {
                _optionsNotifier.value = options;
              }
            });

            var selectedOption = options.isNotEmpty && selectedValue != null
                ? options.firstWhere((opt) => opt.id == selectedValue)
                : null;

            return GestureDetector(
              onTap: () {
                // Ensure notifier has current data before showing
                _optionsNotifier.value = options;
                _showOptions(context, selectedValue, onChanged, onSearch);
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: 10.0,
                      vertical: 8.0,
                    ),
                    margin: EdgeInsets.symmetric(vertical: 2.0),
                    decoration: BoxDecoration(
                      color: Colors.blueGrey.withAlpha(20),
                      borderRadius: BorderRadius.all(Radius.circular(14.0)),
                    ),
                    child: InputDecorator(
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 0,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            field.label,
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
                                selectedOption != null
                                    ? selectedOption.label.split("-")[0]
                                    : "",
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 14.0,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  errorText != null
                      ? Text(
                          errorText,
                          style: TextStyle(fontSize: 12.0, color: Colors.red),
                        )
                      : SizedBox.shrink(),
                ],
              ),
            );
          },
    );
  }
}
