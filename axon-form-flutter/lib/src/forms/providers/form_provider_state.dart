import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:axon_form_flutter/axon_form_flutter.dart';

class FormProviderState extends ChangeNotifier {
  FormGraph? formGraph;
  bool isLoading = true;
  final Map<String, dynamic> formData;
  final Map<int, GlobalKey<FormState>> formKeys;
  final PageController pageController;
  int currentPage;
  final AxonFormCore _core = AxonFormCore(); // for visibility checks

  // Keep default constructor lightweight; graph will be loaded via populateFormGraph
  FormProviderState()
      : formData = {},
        formKeys = {},
        pageController = PageController(),
        currentPage = 0;

  /// Populate the form graph from a JSON asset path and initialize page keys.
  Future<void> populateFormGraph({required String jsonPath}) async {
    isLoading = true;
    notifyListeners();
    try {
      final String jsonString = await rootBundle.loadString(jsonPath);
      final Map<String, dynamic> jsonMap = json.decode(jsonString);

      formGraph = FormGraph.fromJson(jsonMap);

      // Initialize form keys for each page
      formKeys.clear();
      for (var i = 0; i < formGraph!.layout.pages.length; i++) {
        formKeys[i] = GlobalKey<FormState>();
      }
      isLoading = false;
      notifyListeners();
    } catch (e) {
      isLoading = false;
      notifyListeners();
      // rethrow or handle the error as needed (FormBuilder shows SnackBar)
      // throw e;
    }
  }

  bool validateCurrentPage() {
    return formKeys[currentPage]?.currentState?.validate() ?? false;
  }

  void updateField(String fieldName, dynamic value) {
    formData[fieldName] = value;
    notifyListeners();
  }

  /// Animate to the given page index.
  Future<void> jumpToPage(int index) async {
    if (formGraph == null) return;
    if (index < 0 || index >= formGraph!.layout.pages.length) return;
    await pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    currentPage = index;
    notifyListeners();
  }

  /// Validate current page; if valid, navigate to the next visible page.
  /// Returns true if navigation happened, false otherwise (e.g. last page validated).
  Future<bool> nextPage() async {
    if (formGraph == null) return false;
    if (!validateCurrentPage()) return false;
    final pages = formGraph!.layout.pages;
    if (currentPage < pages.length - 1) {
      int? target;
      for (int i = currentPage + 1; i < pages.length; i++) {
        // if (_core.isNodeVisible(pages[i].id)) {
          target = i;
        //   break;
        // }
      }
      target ??= currentPage + 1;
      await jumpToPage(target);
      return true;
    }
    // Last page validated; caller can perform submit
    return false;
  }

  /// Navigate to the previous visible page. Returns true if navigation happened.
  Future<bool> previousPage() async {
    if (formGraph == null) return false;
    final pages = formGraph!.layout.pages;
    if (currentPage <= 0) return false;
    int? target;
    for (int i = currentPage - 1; i >= 0; i--) {
      // if (_core.isNodeVisible(pages[i].id)) {
        target = i;
        // break;
      // }
    }
    target ??= currentPage - 1;
    await jumpToPage(target);
    return true;
  }

  bool get isLastPage => formGraph != null && currentPage == formGraph!.layout.pages.length - 1;

  /// Called by PageView.onPageChanged to keep provider's currentPage in sync.
  void onPageChanged(int index) {
    currentPage = index;
    notifyListeners();
  }

  @override
  void dispose() {
    pageController.dispose();
    super.dispose();
  }

  // --- NEW: Centralized submit / advance logic ---
  Future<bool> advanceOrSubmit({void Function(Map<String, dynamic>)? onSubmitted}) async {
    // Save current page form state if present
    try {
      formKeys[currentPage]?.currentState?.save();
    } catch (_) {
      // ignore save errors, validation will catch issues
    }

    if (!(formKeys[currentPage]?.currentState?.validate() ?? false)) {
      return false;
    }

    final pages = formGraph!.layout.pages;
    if (currentPage < pages.length - 1) {
      // move to next visible page
      await nextPage();
      return false;
    } else {
      // last page: submit
      if (onSubmitted != null) {
        onSubmitted(formData);
      }
      return true;
    }
  }

  Future<bool> submit({void Function(Map<String, dynamic>)? onSubmitted}) async {
    formKeys[currentPage]?.currentState?.save();
    if (!(formKeys[currentPage]?.currentState?.validate() ?? false)) {
      return false;
    }
    if (onSubmitted != null) onSubmitted(formData);
    return true;
  }
}
