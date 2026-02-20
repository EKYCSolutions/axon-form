class DocumentRequirement {
  final DocumentRequirementCondition? personal;
  final DocumentRequirementCondition? onbehalfBelow15;
  final DocumentRequirementCondition? onbehalfAbove15HasIDcard;
  final DocumentRequirementCondition? onbehalfAbove15NoIDcard;

  final DocumentRequirementCondition? personalExpired;
  final DocumentRequirementCondition? onbehalfExpiredBelow15;
  final DocumentRequirementCondition? onbehalfExpiredAbove15HasIdCard;
  final DocumentRequirementCondition? onbehalfExpiredAbove15NoIdCard;

  final DocumentRequirementCondition? personalLost;
  final DocumentRequirementCondition? onbehalfLostBelow15;
  final DocumentRequirementCondition? onbehalfLostAbove15HasIdCard;
  final DocumentRequirementCondition? onbehalfLostAbove15NoIdCard;

  final DocumentRequirementCondition? personalDamaged;
  final DocumentRequirementCondition? onbehalfDamagedBelow15;
  final DocumentRequirementCondition? onbehalfDamagedAbove15HasIdCard;
  final DocumentRequirementCondition? onbehalfDamagedAbove15NoIdCard;

  final DocumentRequirementCondition? personalCorrectData;
  final DocumentRequirementCondition? onbehalfCorrectDataBelow15;
  final DocumentRequirementCondition? onbehalfCorrectDataAbove15HasIdCard;
  final DocumentRequirementCondition? onbehalfCorrectDataAbove15NoIdCard;

  DocumentRequirement({
    this.personal,
    this.onbehalfBelow15,
    this.onbehalfAbove15HasIDcard,
    this.onbehalfAbove15NoIDcard,
    this.personalExpired,
    this.onbehalfExpiredBelow15,
    this.onbehalfExpiredAbove15HasIdCard,
    this.onbehalfExpiredAbove15NoIdCard,
    this.personalLost,
    this.onbehalfLostBelow15,
    this.onbehalfLostAbove15HasIdCard,
    this.onbehalfLostAbove15NoIdCard,
    this.personalDamaged,
    this.onbehalfDamagedBelow15,
    this.onbehalfDamagedAbove15HasIdCard,
    this.onbehalfDamagedAbove15NoIdCard,
    this.personalCorrectData,
    this.onbehalfCorrectDataBelow15,
    this.onbehalfCorrectDataAbove15HasIdCard,
    this.onbehalfCorrectDataAbove15NoIdCard,
  });

  factory DocumentRequirement.fromJson(Map<String, dynamic> json) {
    return DocumentRequirement(
      personal: json['personal'] != null
          ? DocumentRequirementCondition.fromJson(json['personal'])
          : null,
      onbehalfBelow15: json['onbehalf_below15'] != null
          ? DocumentRequirementCondition.fromJson(json['onbehalf_below15'])
          : null,
      onbehalfAbove15HasIDcard: json['onbehalf_above15_hasIDcard'] != null
          ? DocumentRequirementCondition.fromJson(
              json['onbehalf_above15_hasIDcard'])
          : null,
      onbehalfAbove15NoIDcard: json['onbehalf_above15_noIDcard'] != null
          ? DocumentRequirementCondition.fromJson(
              json['onbehalf_above15_noIDcard'])
          : null,
      personalExpired: json["personal_expired"] != null
          ? DocumentRequirementCondition.fromJson(json["personal_expired"])
          : null,
      onbehalfExpiredBelow15: json["on_behalf_expired_below15"] != null
          ? DocumentRequirementCondition.fromJson(
              json["on_behalf_expired_below15"])
          : null,
      onbehalfExpiredAbove15HasIdCard:
          json["on_behalf_expired_above15_hasIDcard"] != null
              ? DocumentRequirementCondition.fromJson(
                  json["on_behalf_expired_above15_hasIDcard"])
              : null,
      onbehalfExpiredAbove15NoIdCard:
          json["on_behalf_expired_above15_noIDcard"] != null
              ? DocumentRequirementCondition.fromJson(
                  json["on_behalf_expired_above15_noIDcard"])
              : null,
      personalLost: json["personal_lost"] != null
          ? DocumentRequirementCondition.fromJson(json["personal_lost"])
          : null,
      onbehalfLostBelow15: json["on_behalf_lost_below15"] != null
          ? DocumentRequirementCondition.fromJson(
              json["on_behalf_lost_below15"])
          : null,
      onbehalfLostAbove15HasIdCard:
          json["on_behalf_lost_above15_hasIDcard"] != null
              ? DocumentRequirementCondition.fromJson(
                  json["on_behalf_lost_above15_hasIDcard"])
              : null,
      onbehalfLostAbove15NoIdCard:
          json["on_behalf_lost_above15_noIDcard"] != null
              ? DocumentRequirementCondition.fromJson(
                  json["on_behalf_lost_above15_noIDcard"])
              : null,
      personalDamaged: json["personal_damaged"] != null
          ? DocumentRequirementCondition.fromJson(json["personal_damaged"])
          : null,
      onbehalfDamagedBelow15: json["on_behalf_damaged_below15"] != null
          ? DocumentRequirementCondition.fromJson(
              json["on_behalf_damaged_below15"])
          : null,
      onbehalfDamagedAbove15HasIdCard:
          json["on_behalf_damaged_above15_hasIDcard"] != null
              ? DocumentRequirementCondition.fromJson(
                  json["on_behalf_damaged_above15_hasIDcard"])
              : null,
      onbehalfDamagedAbove15NoIdCard:
          json["on_behalf_damaged_above15_noIDcard"] != null
              ? DocumentRequirementCondition.fromJson(
                  json["on_behalf_damaged_above15_noIDcard"])
              : null,
      personalCorrectData: json["personal_correctData"] != null
          ? DocumentRequirementCondition.fromJson(json["personal_correctData"])
          : null,
      onbehalfCorrectDataBelow15: json["on_behalf_correctData_below15"] != null
          ? DocumentRequirementCondition.fromJson(
              json["on_behalf_correctData_below15"])
          : null,
      onbehalfCorrectDataAbove15HasIdCard:
          json["on_behalf_correctData_above15_hasIDcard"] != null
              ? DocumentRequirementCondition.fromJson(
                  json["on_behalf_correctData_above15_hasIDcard"])
              : null,
      onbehalfCorrectDataAbove15NoIdCard:
          json["on_behalf_correctData_above15_noIDcard"] != null
              ? DocumentRequirementCondition.fromJson(
                  json["on_behalf_correctData_above15_noIDcard"])
              : null,
    );
  }
}

class DocumentRequirementCondition {
  final List<DocumentGroup> documentGroups;
  final GroupConditions groupConditions;

  DocumentRequirementCondition({
    required this.documentGroups,
    required this.groupConditions,
  });

  factory DocumentRequirementCondition.fromJson(Map<String, dynamic> json) {
    return DocumentRequirementCondition(
      documentGroups: (json['documents'] as List)
          .map((doc) => DocumentGroup.fromJson(doc))
          .toList(),
      groupConditions: GroupConditions.fromJson(json['group_conditions']),
    );
  }
}

class Document {
  final int id;
  final String nameKhm;
  final String nameEng;

  String get slug => nameEng.toLowerCase().replaceAll(" ", "_");

  Document({
    required this.id,
    required this.nameKhm,
    required this.nameEng,
  });

  factory Document.fromJson(Map<String, dynamic> json) {
    return Document(
      id: json['id'],
      nameKhm: json['name_khm'],
      nameEng: json['name_eng'],
    );
  }
}

class DocumentGroup {
  final Document document;
  final String? note;
  final String group;

  DocumentGroup({
    required this.document,
    this.note,
    required this.group,
  });

  factory DocumentGroup.fromJson(Map<String, dynamic> json) {
    return DocumentGroup(
      document: Document.fromJson(json['document_type']),
      note: json['note'],
      group: json['group'],
    );
  }
}

class GroupCondition {
  final bool isRequired;

  GroupCondition({
    required this.isRequired,
  });

  factory GroupCondition.fromJson(Map<String, dynamic> json) {
    return GroupCondition(
      isRequired: json['is_required'],
    );
  }
}

class GroupConditions {
  final Map<String, GroupCondition> conditions;

  GroupConditions({
    required this.conditions,
  });

  factory GroupConditions.fromJson(Map<String, dynamic> json) {
    return GroupConditions(
      conditions: json
          .map((key, value) => MapEntry(key, GroupCondition.fromJson(value))),
    );
  }
}
