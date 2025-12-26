import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../state/state.dart';
import '../config/config.dart';
import 'form_field_factory.dart';
import 'default_navigation.dart';

class DynamicFormPage extends StatelessWidget {
  final FormPage page;
  final int currentPageIndex;
  final int totalPages;
  final VoidCallback? onNext;
  final VoidCallback? onPrevious;
  final VoidCallback? onSubmit;
  final FormTheme theme;
  final FormBuilders? builders;

  const DynamicFormPage({
    super.key,
    required this.page,
    required this.currentPageIndex,
    required this.totalPages,
    this.onNext,
    this.onPrevious,
    this.onSubmit,
    required this.theme,
    this.builders,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<FormStateNotifier>(
      builder: (context, formState, _) {
        return SingleChildScrollView(
          padding: theme.pagePadding ?? EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildPageHeader(context),
              SizedBox(height: theme.fieldSpacing ?? 24),
              ...page.fieldIds.map((fieldId) {
                final node = formState.config.nodes.firstWhere(
                  (n) => n.id == fieldId,
                  orElse: () => throw Exception('Node not found: $fieldId'),
                );
                return FormFieldFactory.createField(
                  context,
                  node,
                  formState,
                  theme,
                  builders,
                );
              }),
              SizedBox(height: theme.fieldSpacing ?? 24),
              _buildNavigation(context, formState),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPageHeader(BuildContext context) {
    if (builders?.pageHeaderBuilder != null) {
      return builders!.pageHeaderBuilder!(context, page);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          page.title,
          style:
              theme.pageTitleStyle ?? Theme.of(context).textTheme.headlineSmall,
        ),
        SizedBox(height: 8),
        Text(
          page.description,
          style:
              theme.pageDescriptionStyle ??
              Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }

  Widget _buildNavigation(BuildContext context, FormStateNotifier formState) {
    if (builders?.navigationBuilder != null) {
      return builders!.navigationBuilder!(
        context,
        currentPageIndex,
        totalPages,
        onNext != null
            ? () {
                if (formState.validatePage(page.fieldIds)) {
                  onNext?.call();
                }
              }
            : null,
        onPrevious,
        onSubmit != null
            ? () {
                if (formState.validatePage(page.fieldIds)) {
                  onSubmit?.call();
                }
              }
            : null,
      );
    }

    return DefaultNavigation(
      currentPage: currentPageIndex,
      totalPages: totalPages,
      theme: theme,
      onNext: onNext != null
          ? () {
              if (formState.validatePage(page.fieldIds)) {
                onNext?.call();
              }
            }
          : null,
      onPrevious: onPrevious,
      onSubmit: onSubmit != null
          ? () {
              if (formState.validatePage(page.fieldIds)) {
                onSubmit?.call();
              }
            }
          : null,
    );
  }
}
