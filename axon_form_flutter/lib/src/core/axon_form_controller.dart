import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/models/core_response.dart';

class AxonFormController {
  final AxonFormProvider _provider;

  AxonFormController(this._provider);

  /// Retrieves the current value of a specific node.
  dynamic getFieldValue(String fieldNodeId) {
    return _provider.getNodeValue(fieldNodeId);
  }

  /// Validates a specific node with a new value.
  CoreResponse setFieldValue(String fieldNodeId, dynamic value) {
    var node = _provider.graph?.nodes['inputs']?[fieldNodeId];

    if (node == null) {
      throw Exception(
        "[AxonFormController] setFieldValue | Ffield id: $fieldNodeId not found",
      );
    }

    if (node.fieldType == FieldType.addressDropdown) {
      return _provider.validateAddressNode(fieldNodeId, value);
    }

    return _provider.validateNode(fieldNodeId, value);
  }

  /// Validates all inputs on a specific page and returns the form data.
  Map<String, dynamic> validatePage(String pageId) {
    return _provider.validatePage(pageId);
  }

  /// Retrieves a list of option nodes for dropdowns or selection inputs.
  List<AxonFormNode> getOptions(String nodeId) {
    return _provider.getOptions(nodeId);
  }

  /// Navigates to the previous page in the form.
  void prevPage() {
    _provider.prevPage();
  }

  /// Validates the current page and navigates to the next page.
  void nextPage() {
    _provider.nextPage();
  }
}
