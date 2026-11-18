import 'dart:convert';

import 'package:c_guard/mock/models/corp_member_model.dart';
import 'package:flutter/services.dart';

class CorpMemberMockService {
  CorpMemberList? corpMemberList;

  Future<void> init() async {
    final jsonString = await rootBundle.loadString(
      "assets/json/mock_corp_members_data.json",
    );
    final data = jsonDecode(jsonString);
    corpMemberList = CorpMemberList.fromJson(data);
  }

  Future<CorpMember?> findCorpMember({required String callUpNumber}) async {
    final members = corpMemberList?.corpMemberList;
    if (members == null) {
      return null;
    }

    return Future.delayed(const Duration(seconds: 4), () {
      for (final corpMember in members) {
        if (callUpNumber == corpMember.callUpNumber) {
          return corpMember;
        }
      }
      return null;
    });
  }
}
