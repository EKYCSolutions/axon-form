import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/models/core_response.dart';
import 'package:axon_form_flutter/src/core/models/node.dart';

class AxonFormController {
  final AxonFormProvider _provider;

  AxonFormController(this._provider);

  /// Retrieves the current value of a specific node.
  dynamic getFieldValue(String fieldNodeId) {
    return _provider.getNodeValue(fieldNodeId);
  }

  /// Validates a specific node with a new value.
  CoreResponse updateField(String fieldNodeId, dynamic value) {
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
