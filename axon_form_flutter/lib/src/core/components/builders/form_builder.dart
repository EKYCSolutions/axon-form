import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter/src/core/axon_form_provider.dart';
import 'package:axon_form_flutter/src/core/components/page_navigation_bar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class FormBuilder extends StatefulWidget {
  const FormBuilder({
    super.key,
    required this.pages,
    required this.onSubmit,
    this.pageBuilder,
    this.pageNavigatorBuilder,
    this.fieldBuilder,
  });

  final List<AxonFormPage> pages;
  final void Function(Map<String, dynamic> result) onSubmit;

  //
  final Widget? Function(
    BuildContext context,
    AxonFormPage page,
    List<AxonFormNode> nodes,
    Widget? Function(BuildContext context, AxonFormNode field)?,
  )?
  pageBuilder;
  final Widget? Function(
    BuildContext context,
    int currentPage,
    int pageCount,
    void Function() nextPage,
    void Function() prevPage,
  )?
  pageNavigatorBuilder;
  final Widget? Function(BuildContext context, AxonFormNode field)?
  fieldBuilder;

  @override
  State<FormBuilder> createState() => _FormBuilderState();
}

class _FormBuilderState extends State<FormBuilder> {
  final Map<String, GlobalKey<FormState>> _pageKeys = {};
  late PageController _pageViewController;

  @override
  void initState() {
    super.initState();
    _pageViewController = PageController();
  }

  GlobalKey<FormState> _getPageKey(String pageId) {
    return _pageKeys.putIfAbsent(pageId, () => GlobalKey<FormState>());
  }

  @override
  void dispose() {
    _pageViewController.dispose();
    super.dispose();
  }

  void _onNavigate(int targetIndex, AxonFormProvider controller) {
    if (targetIndex < controller.currentPageIndex) {
      controller.prevPage();
      _animateToPage(targetIndex);
      return;
    }

    // Get current page ID to find the correct form key
    final currentPageId = widget.pages[controller.currentPageIndex].id;
    final currentFormKey = _getPageKey(currentPageId);

    if (!(currentFormKey.currentState?.validate() ?? false)) return;

    if (targetIndex == controller.pageCount) {
      widget.onSubmit(controller.submitForm());
      return;
    }

    controller.nextPage();
    _animateToPage(targetIndex);
  }

  void _animateToPage(int index) {
    _pageViewController.animateToPage(
      index,
      duration: const Duration(milliseconds: 400),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Expanded(
          child: PageView.builder(
            physics: const NeverScrollableScrollPhysics(),
            controller: _pageViewController,
            itemCount: widget.pages.length,
            itemBuilder: (context, index) {
              var currentPage = widget.pages[index];
              return Form(
                key: _getPageKey(currentPage.id),
                child: Selector<AxonFormProvider, bool>(
                  selector: (context, provider) {
                    return provider
                            .graph
                            ?.nodes["pages"]?[currentPage.id]
                            ?.isVisible ??
                        false;
                  },

                  builder: (context, isVisible, child) {
                    if (!isVisible) {
                      return const SizedBox.shrink();
                    }

                    return PageBuilder(
                      page: widget.pages[index],
                      pageBuilder: widget.pageBuilder,
                      fieldBuilder: widget.fieldBuilder,
                    );
                  },
                ),
              );
            },
          ),
        ),
        Consumer<AxonFormProvider>(
          builder: (context, controller, _) {
            void next() =>
                _onNavigate(controller.currentPageIndex + 1, controller);
            void prev() =>
                _onNavigate(controller.currentPageIndex - 1, controller);

            //
            if (widget.pageNavigatorBuilder != null) {
              final customNavigator = widget.pageNavigatorBuilder!(
                context,
                controller.currentPageIndex,
                controller.pageCount,
                next,
                prev,
              );
              if (customNavigator != null) return customNavigator;
            }

            // Default Navigator
            return PageNavigationBar(
              currentPage: controller.currentPageIndex,
              pageCount: controller.pageCount,
              nextPage: next,
              prevPage: prev,
            );
          },
        ),
      ],
    );
  }
}
