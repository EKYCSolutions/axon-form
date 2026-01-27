class AxonFormPage {
  final String id;
  final String title;
  final String description;
  final List<String> fieldIds;
  final int order;

  AxonFormPage({
    required this.id,
    required this.title,
    required this.description,
    required this.fieldIds,
    required this.order,
  });

  factory AxonFormPage.fromJson(Map<String, dynamic> json) {
    return AxonFormPage(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      fieldIds: List<String>.from(json['field_ids']),
      order: json['order'],
    );
  }
}
