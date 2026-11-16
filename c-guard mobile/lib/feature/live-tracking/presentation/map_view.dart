import 'package:c_guard/app/router/route_constants.dart';
import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MapViewWidget extends StatefulWidget {
  const new({super.key});

  @override
  State<MapViewWidget> createState() => _MapViewWidgetState();
}

class _MapViewWidgetState extends State<MapViewWidget> {
  bool showFullScreen = false;

  void onSshowFullScreen() {
    setState(() {
      showFullScreen = !showFullScreen;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: InkWell(
        onTap: () {
          onSshowFullScreen();
        },
        child: SizedBox(
          height: 223,
          width: MediaQuery.of(context).size.width,
          child: Stack(
            children: [
              AnimatedContainer(
                duration: Durations.extralong1,
                height: 223,
                curve: Curves.easeInBack,
                width: MediaQuery.of(context).size.width,
                foregroundDecoration: showFullScreen
                    ? BoxDecoration(
                        color: ColorManager.border.withValues(alpha: .7),
                      )
                    : null,
                color: ColorManager.blueFill,
                child: Center(
                  child: Text(
                    "Map View",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                ),
              ),
              Align(
                alignment: AlignmentGeometry.center,
                child: AnimatedOpacity(
                  duration: Durations.extralong1,
                  opacity: showFullScreen ? 1 : 0,
                  child: IconButton(
                    onPressed: () {
                      context.pushNamed(RouteConstants.mapView);
                    },
                    icon: Icon(Icons.fullscreen_outlined),
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

class FullMapView extends StatefulWidget {
  const new({super.key});

  @override
  State<FullMapView> createState() => _FullMapViewState();
}

class _FullMapViewState extends State<FullMapView> {
  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: "Map-view",
      child: Scaffold(
        body: Center(
          child: Text(
            "Full Map View",
            style: TextStyle(
              color: ColorManager.green,
              fontWeight: FontWeight.w500,
              fontSize: 24,
            ),
          ),
        ),
      ),
    );
  }
}
