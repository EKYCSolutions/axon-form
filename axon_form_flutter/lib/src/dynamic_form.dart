import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'models/models.dart';
import 'state/state.dart';
import 'config/config.dart';
import 'widgets/dynamic_form_page.dart';
import 'widgets/default_progress.dart';

class DynamicForm extends StatefulWidget {
  final FormConfig config;
  final Function(Map<String, dynamic>)? onSubmit;
  final FormTheme? theme;
  final FormBuilders? builders;
  final bool showAppBar;
  final String? title;
  final Widget? appBarLeading;
  final List<Widget>? appBarActions;

  const DynamicForm({
    Key? key,
    required this.config,
    this.onSubmit,
    this.theme,
    this.builders,
    this.showAppBar = true,
    this.title,
    this.appBarLeading,
    this.appBarActions,
  }) : super(key: key);

  @override
  State<DynamicForm> createState() => _DynamicFormState();
}

class _DynamicFormState extends State<DynamicForm> {
  late PageController _pageController;
  int _currentPageIndex = 0;
  late FormTheme _theme;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _theme = widget.theme ?? FormTheme.defaultTheme();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _goToNextPage() {
    if (_currentPageIndex < widget.config.layout.pages.length - 1) {
      _pageController.nextPage(
        duration: Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _goToPreviousPage() {
    if (_currentPageIndex > 0) {
      _pageController.previousPage(
        duration: Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _handleSubmit(FormStateNotifier formState) {
    final allData = formState.getAllData();
    widget.onSubmit?.call(allData);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Success'),
        content: Text('Form submitted successfully!'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => FormStateNotifier(widget.config),
      child: Scaffold(
        appBar: widget.showAppBar
            ? AppBar(
                title: Text(widget.title ?? 'Dynamic Form'),
                leading: widget.appBarLeading,
                actions: widget.appBarActions,
              )
            : null,
        body: Consumer<FormStateNotifier>(
          builder: (context, formState, _) {
            return Column(
              children: [
                _buildProgress(context),
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    physics: NeverScrollableScrollPhysics(),
                    onPageChanged: (index) {
                      setState(() => _currentPageIndex = index);
                    },
                    itemCount: widget.config.layout.pages.length,
                    itemBuilder: (context, index) {
                      final page = widget.config.layout.pages[index];
                      return DynamicFormPage(
                        page: page,
                        currentPageIndex: _currentPageIndex,
                        totalPages: widget.config.layout.pages.length,
                        onNext: _goToNextPage,
                        onPrevious: _goToPreviousPage,
                        onSubmit: () => _handleSubmit(formState),
                        theme: _theme,
                        builders: widget.builders,
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildProgress(BuildContext context) {
    if (widget.builders?.progressBuilder != null) {
      return widget.builders!.progressBuilder!(
        context,
        _currentPageIndex,
        widget.config.layout.pages.length,
      );
    }

    return DefaultProgress(
      currentPage: _currentPageIndex,
      totalPages: widget.config.layout.pages.length,
      theme: _theme,
    );
  }
}
