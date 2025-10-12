import 'package:flutter/material.dart';
import 'package:axon_form_flutter/axon_form_flutter.dart';

class FormProviderState extends ChangeNotifier {
  final FormGraph formGraph;
  final Map<String, dynamic> formData;
  final Map<int, GlobalKey<FormState>> formKeys;
  final PageController pageController;
  int currentPage;
  
  FormProviderState({required this.formGraph}) 
      : formData = {},
        formKeys = {},
        pageController = PageController(),
        currentPage = 0 {
    // Initialize form keys for each page
    for (var i = 0; i < formGraph.layout.pages.length; i++) {
      formKeys[i] = GlobalKey<FormState>();
    }
  }

  bool validateCurrentPage() {
    return formKeys[currentPage]?.currentState?.validate() ?? false;
  }

  void updateField(String fieldName, dynamic value) {
    formData[fieldName] = value;
    notifyListeners();
  }

  Future<void> nextPage() async {
    if (validateCurrentPage()) {
      if (currentPage < formGraph.layout.pages.length - 1) {
        await pageController.nextPage(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
        currentPage++;
        notifyListeners();
      }
    }
  }

  Future<void> previousPage() async {
    if (currentPage > 0) {
      await pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      currentPage--;
      notifyListeners();
    }
  }

  bool get isLastPage => currentPage == formGraph.layout.pages.length - 1;

  @override
  void dispose() {
    pageController.dispose();
    super.dispose();
  }
}