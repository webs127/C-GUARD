import 'dart:async';
import 'package:battery_plus/battery_plus.dart';
import 'package:flutter/material.dart';

class BatteryService {
  BatteryService._() {
    _init();
  }
  static final BatteryService _instance = BatteryService._();
  factory BatteryService() => _instance; 

  final Battery _battery = Battery();

  final ValueNotifier<int> level = ValueNotifier(0);
  final ValueNotifier<BatteryState> batteryState = ValueNotifier(BatteryState.unknown);
  StreamSubscription? _sub;

  void _init() async{
    level.value = await _battery.batteryLevel;
    _sub = _battery.onBatteryStateChanged.listen((state) async {
      batteryState.value = state;
      level.value = await _battery.batteryLevel;
    });
  }

  void dispose() {
    _sub?.cancel();
  }

  Future<String> getReadableStatus() async {
    final state = batteryState.value;
    switch (state) {
      case BatteryState.charging:
        return 'Charging';
      case BatteryState.discharging:
        return 'On Battery';
      case BatteryState.full:
        return 'Full';
      case BatteryState.connectedNotCharging:
        return 'Plugged In (Not Charging)';
      case BatteryState.unknown:
        return 'Unknown';
    }
  }
}
