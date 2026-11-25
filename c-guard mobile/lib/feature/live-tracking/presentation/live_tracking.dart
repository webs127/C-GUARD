import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:c_guard/core/services/battery_service.dart';
import 'package:c_guard/feature/authentication/widgets/custom_background.dart';
import 'package:c_guard/feature/live-tracking/presentation/map_view.dart';
import 'package:c_guard/feature/live-tracking/widgets/custom_button.dart';
import 'package:c_guard/feature/widgets/info_widget.dart';
import 'package:c_guard/providers/map_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_osm_plugin/flutter_osm_plugin.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';

class LiveTrackingScreen extends StatefulWidget {
  const new({super.key});

  @override
  State<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends State<LiveTrackingScreen> {
  final GeoPoint _destination = GeoPoint(latitude: 9.1489, longitude: 7.3168);
  MapProvider? _mapProvider;
  late Future<Duration?> _timeToReachFuture;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final provider = context.read<MapProvider>();
    if (identical(provider, _mapProvider)) return;

    _mapProvider?.removeListener(_refreshTime);
    _mapProvider = provider;
    provider.addListener(_refreshTime);
    _timeToReachFuture = provider.timeToReachDestination(_destination);
  }

  void _refreshTime() {
    final provider = _mapProvider;
    if (provider == null || !mounted) return;

    setState(() {
      _timeToReachFuture = provider.timeToReachDestination(_destination);
    });
  }

  Widget _timeToReachValue() {
    return FutureBuilder<Duration?>(
      future: _timeToReachFuture,
      builder: (context, snapshot) {
        final duration = snapshot.data;
        final value = duration == null
            ? '--'
            : duration.inHours > 0
            ? '${duration.inHours}h ${duration.inMinutes.remainder(60)}m'
            : '${duration.inMinutes}m ${duration.inSeconds.remainder(60)}s';

        return Text(
          value,
          style: TextStyle(
            color: ColorManager.black,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _mapProvider?.removeListener(_refreshTime);
    BatteryService().dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CustomBackGround(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "JOURNEY IN PROGRESS",
                          style: TextStyle(
                            color: ColorManager.grey,
                            fontSize: 11,
                            letterSpacing: 1.32,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                        Text(
                          "Live Tracking",
                          style: TextStyle(
                            color: ColorManager.black1,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: ColorManager.green1,
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: Row(
                        spacing: 5,
                        children: [
                          SvgPicture.asset(ImageManager.check),
                          Text(
                            "Active",
                            style: TextStyle(
                              color: ColorManager.green,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Divider(color: ColorManager.border),
              Hero(
                tag: "Map-view",
                child: MapViewWidget(destination: _destination),
              ),
              Padding(
                padding: EdgeInsetsGeometry.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 16,
                  children: [
                    Card.filled(
                      color: ColorManager.blue,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 24,
                        ),
                        child: Row(
                          spacing: 13,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: EdgeInsets.all(11),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(14),
                                color: ColorManager.white,
                              ),
                              child: SvgPicture.asset(ImageManager.route),
                            ),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "STATUS",
                                    style: TextStyle(
                                      color: ColorManager.white,
                                      fontSize: 13,
                                      letterSpacing: 1.32,
                                    ),
                                  ),
                                  SizedBox(height: 6),
                                  Text(
                                    "On route to Jabi",
                                    style: TextStyle(
                                      color: ColorManager.white,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  Text(
                                    "Est. arrival: 10:30 AM",
                                    style: TextStyle(
                                      color: ColorManager.whitebackground,
                                      fontSize: 15,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Column(
                      spacing: 8,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "Progress",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              "30 of 45 km",
                              style: TextStyle(
                                color: ColorManager.black1,
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        LinearProgressIndicator(
                          minHeight: 8,
                          borderRadius: BorderRadius.circular(14),
                          color: ColorManager.blue,
                          value: 30 / 45,
                          backgroundColor: ColorManager.border,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "Started",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 15,
                              ),
                            ),
                            Text(
                              "Destination",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 15,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    //TODO: expose duration and time data
                    Row(
                      spacing: 12,
                      children: List.generate(3, (i) {
                        final List<Map<String, dynamic>> data = [
                          {"text": "Duration"},
                          {"text": "Speed", "value": "32 km/h"},
                          {"text": "Battery", "value": "78%"},
                        ];
                        return Expanded(
                          child: Card.outlined(
                            color: ColorManager.white,
                            shape: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: ColorManager.border,
                              ),
                              borderRadius: BorderRadius.circular(13.5),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Column(
                                spacing: 8,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    data[i]["text"],
                                    style: TextStyle(
                                      color: ColorManager.grey,
                                      fontSize: 13,
                                    ),
                                  ),
                                  i == 0
                                      ? _timeToReachValue()
                                      : i == 2
                                      ? ValueListenableBuilder<int>(
                                          valueListenable:
                                              BatteryService().level,
                                          builder: (ctx, level, _) => Text(
                                            "$level%",
                                            style: TextStyle(
                                              color: ColorManager.black,
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        )
                                      : Text(
                                          "${data[i]["value"]}",
                                          style: TextStyle(
                                            color: ColorManager.black,
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                    ),
                    Column(
                      spacing: 8,
                      children: List.generate(3, (i) {
                        final List<Map<String, dynamic>> data = [
                          {
                            "text": "Location",
                            "icon": Icons.location_on_outlined,
                            "status": "Tracking",
                          },
                          {
                            "text": "Connection",
                            "icon": Icons.wifi,
                            "status": "Stable",
                          },
                          {
                            "text": "Monitoring",
                            "icon": Icons.remove_red_eye_outlined,
                            "status": "6 Monitors",
                          },
                        ];
                        return CustomButton(
                          text: data[i]["text"],
                          icon: data[i]["icon"] as IconData,
                          suffix: SuffixWidget(
                            text: data[i]["status"],
                            color: i == data.length - 1
                                ? ColorManager.blueFill
                                : null,
                            textcolor: i == data.length - 1
                                ? ColorManager.blue
                                : null,
                          ),
                        );
                      }),
                    ),
                    InfoWidget(
                      text: "Your journey is being actively monitored by NYSC personnel. SOS is always available.",
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      spacing: 8,
                      children: [
                        Text(
                          "ACTIONS",
                          style: TextStyle(
                            color: ColorManager.grey,
                            letterSpacing: 1.32,
                          ),
                        ),
                        Column(
                          spacing: 8,
                          children: List.generate(2, (i) {
                            final List<Map<String, dynamic>> data = [
                              {
                                "text": "Message Monitor",
                                "icon": ImageManager.message,
                              },
                              {
                                "text": "SOS Emergency",
                                "icon": ImageManager.light,
                              },
                            ];
                            return CustomButton(
                              text: data[i]["text"],
                              textcolor: i == 1 ? ColorManager.white : null,
                              onPressed: () {},
                              color: i == 1 ? ColorManager.red : null,
                              fontWeight: FontWeight.w500,
                              suffix: SvgPicture.asset(
                                data[i]["icon"],
                                color: i == 1 ? ColorManager.white : null,
                                width: 16,
                                height: 16,
                              ),
                            );
                          }),
                        ),
                        SizedBox(height: 16),
                      ],
                    ),
                  ],
                ),
              ),
              Divider(color: ColorManager.border),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: MaterialButton(
                  onPressed: () {},
                  disabledColor: ColorManager.whitebackground,
                  padding: EdgeInsets.all(16),
                  color: ColorManager.whitebackground,
                  elevation: 0,
                  shape: OutlineInputBorder(
                    borderSide: BorderSide(color: ColorManager.border),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    spacing: 8,
                    children: [
                      Icon(Icons.pause),
                      Text(
                        "End journey",
                        style: TextStyle(
                          color: ColorManager.black1,
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
