import 'dart:convert';

import 'package:axon_form_flutter_example/model/document_requirement.dart';
import 'package:axon_form_flutter_example/widgets/shared/constant.dart';
import 'package:flutter/material.dart';

enum FormApplicationType { request, requestOnBehalf, reportAsLost }

enum DocumentType { birthCertificate, passport, identityCard }

class PassportApplicationFormProvider extends ChangeNotifier {
  String? selectedSubServiceType;
  FormApplicationType? formApplicationType;
  String? renewalReason;
  DateTime? applicationDob;
  bool? applicantHasIdCard;

  DocumentRequirement? documentRequirement;

  setFormApplicationType(FormApplicationType type) {
    formApplicationType = type;
    notifyListeners();
  }

  setSelectedSubServiceType(String subServiceType, BuildContext context) {
    selectedSubServiceType = subServiceType;
    initloadServiceDocumentRequirement(context);
    notifyListeners();
  }

  void initloadServiceDocumentRequirement(BuildContext context) async {
    if (selectedSubServiceType == "pvst63sw2p953g8") {
      // load new passport document requirement
      // load config from config-services-1-subservices-1-documents.json
      final String jsonString = await DefaultAssetBundle.of(
        context,
        // ).loadString('assets/form.json');
      ).loadString('assets/config-services-1-subservices-1-documents.json');

      documentRequirement = DocumentRequirement.fromJson(
        json.decode(jsonString)['documents'],
      );
    } else if (selectedSubServiceType == "nbdaes1kfp807x1") {
      // load renew passport document requirement
      // load config from config-services-1-subservices-2-documents.json
      final String jsonString = await DefaultAssetBundle.of(
        context,
        // ).loadString('assets/form.json');
      ).loadString('assets/config-services-1-subservices-2-documents.json');

      documentRequirement = DocumentRequirement.fromJson(
        json.decode(jsonString)['documents'],
      );
    }
  }

  DocumentRequirementCondition getDocumentRequirementConditions(

  ) {
    late DocumentRequirementCondition requirementConditions;

    bool userSelectRenewalService = selectedSubServiceType == "nbdaes1kfp807x1";
    if (!userSelectRenewalService) {
      if (formApplicationType == FormApplicationType.request) {
        requirementConditions = documentRequirement!.personal!;
      } else if (formApplicationType == FormApplicationType.requestOnBehalf) {
        int age = 0;

        if (applicationDob != null) {
          DateTime currentDate = DateTime.now();

          age = currentDate.year - applicationDob!.year;
        }

        final bool above15AndHasIdCard =
            age >= 15 && (applicantHasIdCard ?? true);
        final bool above15AndHasNoIdCard =
            age >= 15 && !(applicantHasIdCard ?? true);
        final bool below15 = age < 15;
        if (above15AndHasIdCard) {
          requirementConditions = documentRequirement!.onbehalfAbove15HasIDcard!;
        } else if (above15AndHasNoIdCard) {
          requirementConditions = documentRequirement!.onbehalfAbove15NoIDcard!;
        } else if (below15) {
          requirementConditions = documentRequirement!.onbehalfBelow15!;
        } else {
          throw UnimplementedError();
        }
      }
    }
    if (userSelectRenewalService) {
      List<String> reasons = [
        Constants.renewalReasonExpired,
        Constants.renewalReasonLost,
        Constants.renewalReasonDamaged,
        Constants.renewalReasonCorrectData,
      ];

      final renewalReasontype = reasons.firstWhere((i) => i == renewalReason);

      if (formApplicationType == FormApplicationType.request) {
        requirementConditions = switch (renewalReasontype) {
          Constants.renewalReasonExpired => documentRequirement!.personalExpired!,
          Constants.renewalReasonLost => documentRequirement!.personalLost!,
          Constants.renewalReasonDamaged => documentRequirement!.personalDamaged!,
          Constants.renewalReasonCorrectData =>
            documentRequirement!.personalCorrectData!,
          _ => throw UnimplementedError(),
        };
      } else if (formApplicationType == FormApplicationType.requestOnBehalf) {
     
        int ages = 0;


        if (applicationDob != null) {
          DateTime currentDate = DateTime.now();

          ages = currentDate.year - applicationDob!.year;
        }

        final bool above15AndHasIdCard = ages >= 15 && (applicantHasIdCard  ?? true);
        final bool above15AndHasNoIdCard = ages >= 15 && !(applicantHasIdCard ?? true);
        final bool below15 = ages < 15;

        if (above15AndHasIdCard) {
          requirementConditions = requirementConditions =
              switch (renewalReason) {
                Constants.renewalReasonExpired =>
                  documentRequirement!.onbehalfExpiredAbove15HasIdCard!,
                Constants.renewalReasonLost =>
                  documentRequirement!.onbehalfLostAbove15HasIdCard!,
                Constants.renewalReasonDamaged =>
                  documentRequirement!.onbehalfDamagedAbove15HasIdCard!,
                Constants.renewalReasonCorrectData =>
                  documentRequirement!.onbehalfCorrectDataAbove15HasIdCard!,
                _ => throw UnimplementedError(),
              };
        } else if (above15AndHasNoIdCard) {
          requirementConditions = requirementConditions =
              switch (renewalReason) {
                Constants.renewalReasonExpired =>
                  documentRequirement!.onbehalfExpiredAbove15NoIdCard!,
                Constants.renewalReasonLost =>
                  documentRequirement!.onbehalfLostAbove15NoIdCard!,
                Constants.renewalReasonDamaged =>
                  documentRequirement!.onbehalfDamagedAbove15NoIdCard!,
                Constants.renewalReasonCorrectData =>
                  documentRequirement!.onbehalfCorrectDataAbove15NoIdCard!,
                _ => throw UnimplementedError(),
              };
        } else if (below15) {
          requirementConditions = requirementConditions =
              switch (renewalReason) {
                Constants.renewalReasonExpired =>
                  documentRequirement!.onbehalfExpiredBelow15!,
                Constants.renewalReasonLost =>
                  documentRequirement!.onbehalfLostBelow15!,
                Constants.renewalReasonDamaged =>
                  documentRequirement!.onbehalfDamagedBelow15!,
                Constants.renewalReasonCorrectData =>
                  documentRequirement!.onbehalfCorrectDataBelow15!,
                _ => throw UnimplementedError(),
              };
        } else {
          throw UnimplementedError();
        }
      }
    }

    return requirementConditions;
  }
}
