import 'package:c_guard/mock/corp_member_mock_service.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late CorpMemberMockService corpMemberMockService;

  group("Corp Member tests", () {
    setUp(() async {
      corpMemberMockService = CorpMemberMockService();
      await corpMemberMockService.init();
    });

    test(
      "get total length of corp members",
      () => expect(
        corpMemberMockService.corpMemberList?.corpMemberList.length,
        50,
      ),
    );

    test("finds Corp Members at different positions in the list", () async {
      final expectedNames = {
        "NYSC/FUM/2026/10001": "Adaeze Balogun",
        "NYSC/FUM/2026/10002": "Chinedu Ibrahim",
        "NYSC/FUM/2026/10050": "Gbenga Umar",
      };

      for (final entry in expectedNames.entries) {
        final result = await corpMemberMockService.findCorpMember(
          callUpNumber: entry.key,
        );
        expect(result?.fullname, entry.value);
      }

      final missingMember = await corpMemberMockService.findCorpMember(
        callUpNumber: "NYSC/FUM/2026/99999",
      );
      expect(missingMember, isNull);
    });
  });
}
