class CorpMember {
  final int id;
  final String fullname;
  final String gender;
  final String email;
  final String phoneNumber;
  final String callUpNumber;
  final String stateCode;
  final String assignedState;
  final String batch;
  final String orientationCamp;

  CorpMember({
    required this.id,
    required this.fullname,
    required this.gender,
    required this.email,
    required this.phoneNumber,
    required this.callUpNumber,
    required this.stateCode,
    required this.assignedState,
    required this.batch,
    required this.orientationCamp,
  });

  factory toJson({
    required int id,
    required String fullname,
    required String gender,
    required String email,
    required String phoneNumber,
    required String callUpNumber,
    required String stateCode,
    required String assignedState,
    required String batch,
    required String orientationCamp,
  }) => CorpMember(
    id: id,
    fullname: fullname,
    gender: gender,
    email: email,
    phoneNumber: phoneNumber,
    callUpNumber: callUpNumber,
    stateCode: stateCode,
    assignedState: assignedState,
    batch: batch,
    orientationCamp: orientationCamp,
  );

  factory fromJson(Map<String, dynamic> json) {
    return CorpMember(
      id: json['id'],
      fullname: json['fullName'],
      gender: json['gender'],
      email: json['email'],
      phoneNumber: json['phoneNumber'],
      callUpNumber: json['callUpNumber'],
      stateCode: json['stateCode'],
      assignedState: json['assignedState'],
      batch: json['batch'],
      orientationCamp: json['orientationCamp'],
    );
  }
}

enum Gender { male, female }


class CorpMemberList {
  final List<CorpMember> corpMemberList;

  new({required this.corpMemberList});

  factory fromJson(List json) {
    final corpMemberList = json.map((e) => CorpMember.fromJson(e)).toList();
    return CorpMemberList(corpMemberList: corpMemberList);
  }
}